import type {
  BackgroundId,
  CharacterId,
  StoryChapter,
  StoryEffect,
  StoryChoice,
  LinearStoryNode,
  EndStoryNode,
  ChoiceStoryNode,
  StoryNodeId,
  StoryTransition,
} from "../types";

export const defineChapter = (chapter: StoryChapter) => chapter;

export const line = (
  id: StoryNodeId,
  backgroundId: BackgroundId,
  text: string | string[],
  next: StoryNodeId | StoryTransition,
  speakerId?: CharacterId,
  enterEffects?: StoryEffect[],
): LinearStoryNode => ({
  id,
  kind: "line",
  backgroundId,
  speakerId,
  text,
  next: typeof next === "string" ? { fallbackId: next } : next,
  enterEffects,
});

export const choice = (
  id: StoryNodeId,
  backgroundId: BackgroundId,
  text: string | string[],
  choices: [StoryChoice, StoryChoice],
  speakerId?: CharacterId,
): ChoiceStoryNode => ({
  id,
  kind: "choice",
  backgroundId,
  speakerId,
  text,
  choices,
});

export const ending = (
  id: StoryNodeId,
  backgroundId: BackgroundId,
  text: string | string[],
  endLabel?: string,
  speakerId?: CharacterId,
  enterEffects?: StoryEffect[],
): EndStoryNode => ({
  id,
  kind: "end",
  backgroundId,
  speakerId,
  text,
  endLabel,
  enterEffects,
});
