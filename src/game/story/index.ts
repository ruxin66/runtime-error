import { storyChapters } from "./chapters";

export const storyRegistry = Object.fromEntries(
  storyChapters.map((chapter) => [chapter.id, chapter]),
);

export const initialChapterId = storyChapters[0].id;
