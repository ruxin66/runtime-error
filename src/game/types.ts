export type CharacterId = string;
export type BackgroundId = string;
export type StoryNodeId = string;
export type StoryFlagValue = string | number | boolean;
export type ProtagonistGender = "female" | "male";
export type ReaderTextSize = "compact" | "standard" | "large";

export interface ProtagonistProfile {
  gender: ProtagonistGender;
  displayName: string;
  title: string;
  pronoun: string;
  possessive: string;
  appearance: string;
  servicePersona: string;
}

export interface StoryCondition {
  key: string;
  operator?: "equals" | "notEquals" | "truthy" | "falsy";
  value?: StoryFlagValue;
}

export interface StoryEffect {
  key: string;
  type: "set" | "increment";
  value: StoryFlagValue;
}

export interface StoryBranch {
  nextId: StoryNodeId;
  conditions: StoryCondition[];
}

export interface StoryTransition {
  fallbackId: StoryNodeId;
  branches?: StoryBranch[];
}

export interface StoryState {
  flags: Record<string, StoryFlagValue>;
  protagonist: ProtagonistProfile;
}

export interface ReaderSettings {
  textSize: ReaderTextSize;
  showAdvanceHint: boolean;
}

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
  effects?: StoryEffect[];
}

interface StoryNodeBase {
  id: StoryNodeId;
  text: string | string[];
  backgroundId: BackgroundId;
  speakerId?: CharacterId;
  enterEffects?: StoryEffect[];
}

export interface LinearStoryNode extends StoryNodeBase {
  kind: "line";
  next: StoryTransition;
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
  initialState?: StoryState;
  characters: Record<CharacterId, CharacterProfile>;
  backgrounds: Record<BackgroundId, BackgroundProfile>;
  nodes: Record<StoryNodeId, StoryNode>;
}

export interface StorySnapshot {
  chapterId: string;
  currentNodeId: StoryNodeId;
  state: StoryState;
}

export interface StorySaveData extends StorySnapshot {
  slotId: number;
  savedAt: string;
}

export interface StoryHistoryEntry {
  nodeId: StoryNodeId;
  speakerName: string;
  speakerTitle?: string;
  text: string[];
}

export const isChoiceNode = (node: StoryNode): node is ChoiceStoryNode =>
  node.kind === "choice";

export const isLinearNode = (node: StoryNode): node is LinearStoryNode =>
  node.kind === "line";

export const isEndNode = (node: StoryNode): node is EndStoryNode =>
  node.kind === "end";
