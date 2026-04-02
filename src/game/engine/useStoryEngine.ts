import { useMemo, useState } from "react";
import {
  isChoiceNode,
  isLinearNode,
  type BackgroundProfile,
  type CharacterProfile,
  type StoryChapter,
  type StoryNode,
} from "../types";

const normalizeText = (text: StoryNode["text"]): string[] =>
  Array.isArray(text) ? text : [text];

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

    if (isLinearNode(node) && !chapter.nodes[node.nextId]) {
      throw new Error(`Missing next node "${node.nextId}" for node "${node.id}"`);
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

  useMemo(() => validateChapter(chapter), [chapter]);

  const currentNode = chapter.nodes[currentNodeId];
  const currentCharacter: CharacterProfile | undefined = currentNode.speakerId
    ? chapter.characters[currentNode.speakerId]
    : undefined;
  const currentBackground: BackgroundProfile = chapter.backgrounds[currentNode.backgroundId];

  const advance = () => {
    if (!isLinearNode(currentNode)) {
      return;
    }

    setCurrentNodeId(currentNode.nextId);
  };

  const choose = (choiceId: string) => {
    if (!isChoiceNode(currentNode)) {
      return;
    }

    const selectedChoice = currentNode.choices.find((choice) => choice.id === choiceId);
    if (!selectedChoice) {
      return;
    }

    setCurrentNodeId(selectedChoice.nextId);
  };

  const restart = () => {
    setCurrentNodeId(chapter.startId);
  };

  return {
    chapter,
    currentNode,
    currentCharacter,
    currentBackground,
    currentText: normalizeText(currentNode.text),
    canAdvance: isLinearNode(currentNode),
    hasChoices: isChoiceNode(currentNode),
    isEnding: currentNode.kind === "end",
    advance,
    choose,
    restart,
  };
};
