import type { ReaderSettings } from "./types";

const READER_SETTINGS_KEY = "runtime-error.reader-settings.v1";

export const defaultReaderSettings: ReaderSettings = {
  textSize: "standard",
  showAdvanceHint: true,
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const loadReaderSettings = (): ReaderSettings => {
  if (typeof window === "undefined") {
    return defaultReaderSettings;
  }

  const raw = window.localStorage.getItem(READER_SETTINGS_KEY);
  if (!raw) {
    return defaultReaderSettings;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) {
      return defaultReaderSettings;
    }

    return {
      textSize:
        parsed.textSize === "compact" || parsed.textSize === "large"
          ? parsed.textSize
          : "standard",
      showAdvanceHint:
        typeof parsed.showAdvanceHint === "boolean"
          ? parsed.showAdvanceHint
          : defaultReaderSettings.showAdvanceHint,
    };
  } catch {
    return defaultReaderSettings;
  }
};

export const saveReaderSettings = (settings: ReaderSettings) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(READER_SETTINGS_KEY, JSON.stringify(settings));
};
