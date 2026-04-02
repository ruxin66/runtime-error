import type {
  BackgroundId,
  CharacterId,
  StoryChapter,
  StoryChoice,
  StoryNode,
  StoryNodeId,
} from "../types";

export const defineChapter = (chapter: StoryChapter) => chapter;

export const line = (
  id: StoryNodeId,
  backgroundId: BackgroundId,
  text: string | string[],
  nextId: StoryNodeId,
  speakerId?: CharacterId,
): StoryNode => ({
  id,
  kind: "line",
  backgroundId,
  speakerId,
  text,
  nextId,
});

export const choice = (
  id: StoryNodeId,
  backgroundId: BackgroundId,
  text: string | string[],
  choices: [StoryChoice, StoryChoice],
  speakerId?: CharacterId,
): StoryNode => ({
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
): StoryNode => ({
  id,
  kind: "end",
  backgroundId,
  speakerId,
  text,
  endLabel,
});
