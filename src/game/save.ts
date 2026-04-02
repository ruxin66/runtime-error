import type { StorySaveData, StorySnapshot } from "./types";

const LEGACY_STORY_SAVE_KEY = "runtime-error.story-save.v1";
const STORY_SAVE_KEY = "runtime-error.story-saves.v2";
export const MAX_SAVE_SLOTS = 3;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const parseSaveData = (parsed: unknown, fallbackSlotId = 1): StorySaveData | null => {
  if (!isRecord(parsed)) {
    return null;
  }

  if (
    typeof parsed.chapterId !== "string" ||
    typeof parsed.currentNodeId !== "string" ||
    typeof parsed.savedAt !== "string" ||
    !isRecord(parsed.state) ||
    !isRecord(parsed.state.flags) ||
    !isRecord(parsed.state.protagonist) ||
    typeof parsed.state.protagonist.gender !== "string"
  ) {
    return null;
  }

  const slotId =
    typeof parsed.slotId === "number" && parsed.slotId >= 1 && parsed.slotId <= MAX_SAVE_SLOTS
      ? parsed.slotId
      : fallbackSlotId;

  return {
    slotId,
    chapterId: parsed.chapterId,
    currentNodeId: parsed.currentNodeId,
    savedAt: parsed.savedAt,
    state: {
      flags: parsed.state.flags as Record<string, string | number | boolean>,
      protagonist: {
        gender: parsed.state.protagonist.gender === "male" ? "male" : "female",
        displayName:
          typeof parsed.state.protagonist.displayName === "string"
            ? parsed.state.protagonist.displayName
            : "余闯",
        title:
          typeof parsed.state.protagonist.title === "string"
            ? parsed.state.protagonist.title
            : "主角",
        pronoun:
          typeof parsed.state.protagonist.pronoun === "string"
            ? parsed.state.protagonist.pronoun
            : parsed.state.protagonist.gender === "male"
              ? "他"
              : "她",
        possessive:
          typeof parsed.state.protagonist.possessive === "string"
            ? parsed.state.protagonist.possessive
            : parsed.state.protagonist.gender === "male"
              ? "他的"
              : "她的",
        appearance:
          typeof parsed.state.protagonist.appearance === "string"
            ? parsed.state.protagonist.appearance
            : "黑发黑眸的余闯",
        servicePersona:
          typeof parsed.state.protagonist.servicePersona === "string"
            ? parsed.state.protagonist.servicePersona
            : "被临时打扮起来的服务员",
      },
    },
  };
};

const readStoredSaves = (): StorySaveData[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(STORY_SAVE_KEY);
  if (raw) {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed
          .map((entry, index) => parseSaveData(entry, index + 1))
          .filter((entry): entry is StorySaveData => Boolean(entry))
          .sort((a, b) => a.slotId - b.slotId);
      }
    } catch {
      return [];
    }
  }

  const legacyRaw = window.localStorage.getItem(LEGACY_STORY_SAVE_KEY);
  if (!legacyRaw) {
    return [];
  }

  try {
    const migrated = parseSaveData(JSON.parse(legacyRaw), 1);
    if (!migrated) {
      return [];
    }

    const migratedList = [migrated];
    window.localStorage.setItem(STORY_SAVE_KEY, JSON.stringify(migratedList));
    window.localStorage.removeItem(LEGACY_STORY_SAVE_KEY);
    return migratedList;
  } catch {
    return [];
  }
};

const writeStoredSaves = (saves: StorySaveData[]) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORY_SAVE_KEY, JSON.stringify(saves));
};

export const listStoryProgress = (): StorySaveData[] => readStoredSaves();

export const loadStoryProgress = (slotId: number): StorySaveData | null =>
  readStoredSaves().find((entry) => entry.slotId === slotId) ?? null;

export const saveStoryProgress = (slotId: number, snapshot: StorySnapshot) => {
  if (typeof window === "undefined") {
    return;
  }

  const payload: StorySaveData = {
    ...snapshot,
    slotId,
    savedAt: new Date().toISOString(),
  };

  const nextSaves = readStoredSaves().filter((entry) => entry.slotId !== slotId);
  nextSaves.push(payload);
  writeStoredSaves(nextSaves.sort((a, b) => a.slotId - b.slotId));
};

export const clearStoryProgress = (slotId?: number) => {
  if (typeof window === "undefined") {
    return;
  }

  if (typeof slotId !== "number") {
    window.localStorage.removeItem(STORY_SAVE_KEY);
    window.localStorage.removeItem(LEGACY_STORY_SAVE_KEY);
    return;
  }

  const nextSaves = readStoredSaves().filter((entry) => entry.slotId !== slotId);
  writeStoredSaves(nextSaves);
};
