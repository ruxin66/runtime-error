import type { StoryChoice } from "../game/types";

interface ChoicePanelProps {
  choices: [StoryChoice, StoryChoice];
  onSelect: (choiceId: string) => void;
}

export const ChoicePanel = ({ choices, onSelect }: ChoicePanelProps) => {
  return (
    <div className="choice-panel">
      {choices.map((choice, index) => (
        <button
          key={choice.id}
          className="choice-panel__button"
          type="button"
          onClick={() => onSelect(choice.id)}
        >
          <span className="choice-panel__index">0{index + 1}</span>
          <span>{choice.text}</span>
        </button>
      ))}
    </div>
  );
};
