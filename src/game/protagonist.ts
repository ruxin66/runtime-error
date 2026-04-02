import type { ProtagonistGender, ProtagonistProfile, StoryState } from "./types";

const protagonistProfiles: Record<ProtagonistGender, ProtagonistProfile> = {
  female: {
    gender: "female",
    displayName: "余闯",
    title: "主角",
    pronoun: "她",
    possessive: "她的",
    appearance: "黑发黑眸的余闯",
    servicePersona: "被临时打扮起来的服务员",
  },
  male: {
    gender: "male",
    displayName: "余闯",
    title: "主角",
    pronoun: "他",
    possessive: "他的",
    appearance: "黑发黑眸的余闯",
    servicePersona: "被临时打扮起来的服务员",
  },
};

export const createProtagonistProfile = (
  gender: ProtagonistGender,
): ProtagonistProfile => protagonistProfiles[gender];

export const createTextTemplateMap = (state: StoryState): Record<string, string> => ({
  playerName: state.protagonist.displayName,
  playerTitle: state.protagonist.title,
  playerPronoun: state.protagonist.pronoun,
  playerPossessive: state.protagonist.possessive,
  playerAppearance: state.protagonist.appearance,
  playerServicePersona: state.protagonist.servicePersona,
});
