export type CharacterId = string;
export type BackgroundId = string;
export type StoryNodeId = string;

export interface CharacterProfile {
  id: CharacterId;
  name: string;
  title?: string;
  accentColor?: string;
}

export interface BackgroundProfile {
  id: BackgroundId;
  label: string;
  description: string;
}

export interface StoryChoice {
  id: string;
  text: string;
  nextId: StoryNodeId;
}

interface StoryNodeBase {
  id: StoryNodeId;
  text: string | string[];
  backgroundId: BackgroundId;
  speakerId?: CharacterId;
}

export interface LinearStoryNode extends StoryNodeBase {
  kind: "line";
  nextId: StoryNodeId;
}

export interface ChoiceStoryNode extends StoryNodeBase {
  kind: "choice";
  choices: [StoryChoice, StoryChoice];
}

export interface EndStoryNode extends StoryNodeBase {
  kind: "end";
  endLabel?: string;
}

export type StoryNode = LinearStoryNode | ChoiceStoryNode | EndStoryNode;

export interface StoryChapter {
  id: string;
  title: string;
  subtitle: string;
  startId: StoryNodeId;
  characters: Record<CharacterId, CharacterProfile>;
  backgrounds: Record<BackgroundId, BackgroundProfile>;
  nodes: Record<StoryNodeId, StoryNode>;
}

export const isChoiceNode = (node: StoryNode): node is ChoiceStoryNode =>
  node.kind === "choice";

export const isLinearNode = (node: StoryNode): node is LinearStoryNode =>
  node.kind === "line";

export const isEndNode = (node: StoryNode): node is EndStoryNode =>
  node.kind === "end";
