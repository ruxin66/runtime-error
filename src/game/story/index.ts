import { prologueChapter } from "./prologue";

export const storyRegistry = {
  [prologueChapter.id]: prologueChapter,
};

export const initialChapterId = prologueChapter.id;
