import { BackgroundStage } from "./BackgroundStage";
import { ChoicePanel } from "./ChoicePanel";
import { DialogueBox } from "./DialogueBox";
import {
  isChoiceNode,
  isEndNode,
  type BackgroundProfile,
  type StoryChapter,
  type StoryChoice,
  type StoryNode,
} from "../game/types";

interface SaveSlotOption {
  slotId: number;
  label: string;
}

interface StoryScreenProps {
  chapter: StoryChapter;
  node: StoryNode;
  text: string[];
  speakerName?: string;
  speakerTitle?: string;
  background: BackgroundProfile;
  choices?: [StoryChoice, StoryChoice];
  canAdvance: boolean;
  isEnding: boolean;
  saveStatus?: string;
  selectedSlot: number;
  slotOptions: SaveSlotOption[];
  canLoad: boolean;
  onAdvance: () => void;
  onChoose: (choiceId: string) => void;
  onSave: () => void;
  onLoad: () => void;
  onSelectSlot: (slotId: number) => void;
  onReturnTitle: () => void;
}

export const StoryScreen = ({
  chapter,
  node,
  text,
  speakerName,
  speakerTitle,
  background,
  choices,
  canAdvance,
  isEnding,
  saveStatus,
  selectedSlot,
  slotOptions,
  canLoad,
  onAdvance,
  onChoose,
  onSave,
  onLoad,
  onSelectSlot,
  onReturnTitle,
}: StoryScreenProps) => {
  const renderFooter = () => {
    if (isChoiceNode(node)) {
      return choices ? <ChoicePanel choices={choices} onSelect={onChoose} /> : null;
    }

    if (isEnding && isEndNode(node)) {
      return (
        <div className="story-screen__actions">
          <button className="primary-button" type="button" onClick={onReturnTitle}>
            {node.endLabel ?? "返回标题"}
          </button>
        </div>
      );
    }

    if (canAdvance) {
      return (
        <div className="story-screen__actions">
          <button className="primary-button" type="button" onClick={onAdvance}>
            继续
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <section className="story-screen">
      <header className="story-screen__topbar">
        <div>
          <p className="eyebrow">Chapter</p>
          <h1>{chapter.title}</h1>
        </div>
        <div className="story-screen__topbar-actions">
          <div className="story-screen__slot-actions">
            {slotOptions.map((slot) => (
              <button
                key={slot.slotId}
                className={selectedSlot === slot.slotId ? "selector-button is-active" : "selector-button"}
                type="button"
                onClick={() => onSelectSlot(slot.slotId)}
              >
                {slot.slotId} 号位
              </button>
            ))}
          </div>
          <button className="ghost-button" type="button" onClick={onSave}>
            保存
          </button>
          <button className="ghost-button" type="button" onClick={onLoad} disabled={!canLoad}>
            读取
          </button>
          <button className="ghost-button" type="button" onClick={onReturnTitle}>
            返回标题
          </button>
        </div>
      </header>

      <BackgroundStage background={background} />

      <div className="story-screen__panel">
        <DialogueBox speakerName={speakerName} speakerTitle={speakerTitle} text={text} />
        {saveStatus ? <p className="story-screen__save-status">{saveStatus}</p> : null}
        {renderFooter()}
      </div>
    </section>
  );
};
