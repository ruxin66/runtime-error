import type { StorySaveData, StorySnapshot } from "./types";

const STORY_SAVE_KEY = "runtime-error.story-save.v1";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const saveStoryProgress = (snapshot: StorySnapshot) => {
  if (typeof window === "undefined") {
    return;
  }

  const payload: StorySaveData = {
    ...snapshot,
    savedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(STORY_SAVE_KEY, JSON.stringify(payload));
};

export const loadStoryProgress = (): StorySaveData | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(STORY_SAVE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
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

    return {
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
  } catch {
    return null;
  }
};

export const clearStoryProgress = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORY_SAVE_KEY);
};
