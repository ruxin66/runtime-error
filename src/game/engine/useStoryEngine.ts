import { useEffect, useMemo, useRef, useState } from "react";
import { createProtagonistProfile, createTextTemplateMap } from "../protagonist";
import {
  isChoiceNode,
  isLinearNode,
  type BackgroundProfile,
  type CharacterProfile,
  type ProtagonistProfile,
  type StoryChapter,
  type StoryCondition,
  type StoryEffect,
  type StoryChoice,
  type StorySnapshot,
  type StoryState,
  type StoryTransition,
  type StoryNode,
} from "../types";

const normalizeText = (text: StoryNode["text"]): string[] =>
  Array.isArray(text) ? text : [text];

const cloneState = (
  state?: StoryState,
  overrides?: Partial<Pick<StoryState, "flags" | "protagonist">>,
): StoryState => ({
  flags: { ...(state?.flags ?? {}), ...(overrides?.flags ?? {}) },
  protagonist:
    overrides?.protagonist ?? state?.protagonist ?? createProtagonistProfile("female"),
});

const resolveTemplateString = (value: string, state: StoryState): string => {
  const templateMap = createTextTemplateMap(state);

  return value.replace(/\{\{(\w+)\}\}/g, (fullMatch, token: string) => {
    return templateMap[token] ?? fullMatch;
  });
};

const resolveText = (text: StoryNode["text"], state: StoryState): string[] =>
  normalizeText(text).map((paragraph) => resolveTemplateString(paragraph, state));

const resolveChoiceText = (choice: StoryChoice, state: StoryState): StoryChoice => ({
  ...choice,
  text: resolveTemplateString(choice.text, state),
});

const matchesCondition = (
  condition: StoryCondition,
  flags: StoryState["flags"],
): boolean => {
  const currentValue = flags[condition.key];
  const operator = condition.operator ?? "truthy";

  switch (operator) {
    case "equals":
      return currentValue === condition.value;
    case "notEquals":
      return currentValue !== condition.value;
    case "truthy":
      return Boolean(currentValue);
    case "falsy":
      return !currentValue;
    default:
      return false;
  }
};

const resolveTransition = (transition: StoryTransition, state: StoryState): string => {
  const matchedBranch = transition.branches?.find((branch) =>
    branch.conditions.every((condition) => matchesCondition(condition, state.flags)),
  );

  return matchedBranch?.nextId ?? transition.fallbackId;
};

const applyEffects = (state: StoryState, effects?: StoryEffect[]): StoryState => {
  if (!effects?.length) {
    return state;
  }

  const nextFlags = { ...state.flags };

  effects.forEach((effect) => {
    if (effect.type === "set") {
      nextFlags[effect.key] = effect.value;
      return;
    }

    if (effect.type === "increment") {
      const currentValue = nextFlags[effect.key];
      const safeCurrent = typeof currentValue === "number" ? currentValue : 0;
      const safeDelta = typeof effect.value === "number" ? effect.value : 0;
      nextFlags[effect.key] = safeCurrent + safeDelta;
    }
  });

  return {
    ...state,
    flags: nextFlags,
  };
};

const validateChapter = (chapter: StoryChapter) => {
  if (!chapter.nodes[chapter.startId]) {
    throw new Error(`Missing start node: ${chapter.startId}`);
  }

  Object.values(chapter.nodes).forEach((node) => {
    if (!chapter.backgrounds[node.backgroundId]) {
      throw new Error(`Missing background "${node.backgroundId}" for node "${node.id}"`);
    }

    if (node.speakerId && !chapter.characters[node.speakerId]) {
      throw new Error(`Missing speaker "${node.speakerId}" for node "${node.id}"`);
    }

    if (isLinearNode(node)) {
      if (!chapter.nodes[node.next.fallbackId]) {
        throw new Error(`Missing next node "${node.next.fallbackId}" for node "${node.id}"`);
      }

      node.next.branches?.forEach((branch) => {
        if (!chapter.nodes[branch.nextId]) {
          throw new Error(`Missing branch node "${branch.nextId}" for node "${node.id}"`);
        }
      });
    }

    if (isChoiceNode(node)) {
      node.choices.forEach((choice) => {
        if (!chapter.nodes[choice.nextId]) {
          throw new Error(
            `Missing next node "${choice.nextId}" for choice "${choice.id}" on node "${node.id}"`,
          );
        }
      });
    }
  });
};

export const useStoryEngine = (chapter: StoryChapter) => {
  const [currentNodeId, setCurrentNodeId] = useState(chapter.startId);
  const [state, setState] = useState<StoryState>(() => cloneState(chapter.initialState));
  const appliedEnterEffectsRef = useRef<string | null>(null);

  useMemo(() => validateChapter(chapter), [chapter]);

  useEffect(() => {
    appliedEnterEffectsRef.current = null;
    setCurrentNodeId(chapter.startId);
    setState(cloneState(chapter.initialState));
  }, [chapter.id]);

  const currentNode = chapter.nodes[currentNodeId];
  const currentCharacter: CharacterProfile | undefined = currentNode.speakerId
    ? chapter.characters[currentNode.speakerId]
    : undefined;
  const currentBackground: BackgroundProfile = chapter.backgrounds[currentNode.backgroundId];
  const currentChoices = isChoiceNode(currentNode)
    ? (currentNode.choices.map((choice) => resolveChoiceText(choice, state)) as [
        StoryChoice,
        StoryChoice,
      ])
    : undefined;
  const protagonist: ProtagonistProfile = state.protagonist;

  useEffect(() => {
    if (!currentNode.enterEffects?.length) {
      return;
    }

    if (appliedEnterEffectsRef.current === currentNode.id) {
      return;
    }

    appliedEnterEffectsRef.current = currentNode.id;
    setState((previousState) => applyEffects(previousState, currentNode.enterEffects));
  }, [currentNode]);

  const advance = () => {
    if (!isLinearNode(currentNode)) {
      return;
    }

    appliedEnterEffectsRef.current = null;
    setCurrentNodeId(resolveTransition(currentNode.next, state));
  };

  const choose = (choiceId: string) => {
    if (!isChoiceNode(currentNode)) {
      return;
    }

    const selectedChoice = currentNode.choices.find((choice) => choice.id === choiceId);
    if (!selectedChoice) {
      return;
    }

    setState((previousState) => applyEffects(previousState, selectedChoice.effects));
    appliedEnterEffectsRef.current = null;
    setCurrentNodeId(selectedChoice.nextId);
  };

  const restart = (overrides?: Partial<Pick<StoryState, "flags" | "protagonist">>) => {
    appliedEnterEffectsRef.current = null;
    setCurrentNodeId(chapter.startId);
    setState(cloneState(chapter.initialState, overrides));
  };

  const restore = (snapshot: Pick<StorySnapshot, "currentNodeId" | "state">) => {
    if (!chapter.nodes[snapshot.currentNodeId]) {
      return false;
    }

    appliedEnterEffectsRef.current = null;
    setCurrentNodeId(snapshot.currentNodeId);
    setState(cloneState(snapshot.state));
    return true;
  };

  const createSnapshot = (): StorySnapshot => ({
    chapterId: chapter.id,
    currentNodeId,
    state: cloneState(state),
  });

  return {
    chapter,
    currentNode,
    currentCharacter,
    currentBackground,
    currentText: resolveText(currentNode.text, state),
    currentChoices,
    protagonist,
    state,
    canAdvance: isLinearNode(currentNode),
    hasChoices: isChoiceNode(currentNode),
    isEnding: currentNode.kind === "end",
    advance,
    choose,
    restart,
    restore,
    createSnapshot,
  };
};
