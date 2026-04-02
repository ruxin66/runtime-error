import { BackgroundStage } from "./BackgroundStage";
import { ChoicePanel } from "./ChoicePanel";
import { DialogueBox } from "./DialogueBox";
import { HistoryPanel } from "./HistoryPanel";
import { SavePanel } from "./SavePanel";
import { SettingsPanel } from "./SettingsPanel";
import {
  isChoiceNode,
  isEndNode,
  type BackgroundProfile,
  type ReaderSettings,
  type StoryChapter,
  type StoryChoice,
  type StoryHistoryEntry,
  type StoryNode,
} from "../game/types";

interface SaveSlotOption {
  slotId: number;
  label: string;
  detail?: string;
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
  settings: ReaderSettings;
  history: StoryHistoryEntry[];
  activeOverlay: "history" | "settings" | "save" | "load" | null;
  selectedSlot: number;
  slotOptions: SaveSlotOption[];
  canLoad: boolean;
  onAdvance: () => void;
  onChoose: (choiceId: string) => void;
  onOpenSave: () => void;
  onOpenLoad: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  onConfirmSave: () => void;
  onConfirmLoad: () => void;
  onSelectSlot: (slotId: number) => void;
  onChangeTextSize: (textSize: ReaderSettings["textSize"]) => void;
  onToggleAdvanceHint: () => void;
  onCloseOverlay: () => void;
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
  settings,
  history,
  activeOverlay,
  selectedSlot,
  slotOptions,
  canLoad,
  onAdvance,
  onChoose,
  onOpenSave,
  onOpenLoad,
  onOpenHistory,
  onOpenSettings,
  onConfirmSave,
  onConfirmLoad,
  onSelectSlot,
  onChangeTextSize,
  onToggleAdvanceHint,
  onCloseOverlay,
  onReturnTitle,
}: StoryScreenProps) => {
  const showChoices = isChoiceNode(node) && Boolean(choices);
  const showEndingAction = isEnding && isEndNode(node);

  return (
    <section className="story-screen">
      <header className="story-screen__topbar">
        <div className="story-screen__chapter-tag">
          <p className="eyebrow">Chapter</p>
          <h1>{chapter.title}</h1>
        </div>
        <div className="story-screen__topbar-actions">
          <button className="hud-button" type="button" onClick={onOpenSave}>
            保存
          </button>
          <button className="hud-button" type="button" onClick={onOpenLoad} disabled={!canLoad}>
            读取
          </button>
          <button className="hud-button" type="button" onClick={onOpenHistory}>
            回看
          </button>
          <button className="hud-button" type="button" onClick={onOpenSettings}>
            设置
          </button>
          <button className="hud-button" type="button" onClick={onReturnTitle}>
            返回
          </button>
        </div>
      </header>

      <BackgroundStage background={background} />

      {showChoices ? (
        <div className="story-screen__choice-overlay">
          <ChoicePanel choices={choices!} onSelect={onChoose} />
        </div>
      ) : null}

      <div className="story-screen__bottom">
        {saveStatus ? <p className="story-screen__save-status">{saveStatus}</p> : null}
        <div className="story-screen__panel">
          <DialogueBox
            speakerName={speakerName}
            speakerTitle={speakerTitle}
            text={text}
            clickable={canAdvance}
            showAdvanceHint={settings.showAdvanceHint}
            textSize={settings.textSize}
            onAdvance={onAdvance}
          />
          {showEndingAction ? (
            <div className="story-screen__actions">
              <button className="primary-button" type="button" onClick={onReturnTitle}>
                {node.endLabel ?? "返回标题"}
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {activeOverlay === "history" ? (
        <HistoryPanel entries={history} onClose={onCloseOverlay} />
      ) : null}

      {activeOverlay === "settings" ? (
        <SettingsPanel
          settings={settings}
          onChangeTextSize={onChangeTextSize}
          onToggleAdvanceHint={onToggleAdvanceHint}
          onClose={onCloseOverlay}
        />
      ) : null}

      {activeOverlay === "save" ? (
        <SavePanel
          mode="save"
          slotOptions={slotOptions}
          selectedSlot={selectedSlot}
          onSelectSlot={onSelectSlot}
          onConfirm={onConfirmSave}
          onClose={onCloseOverlay}
        />
      ) : null}

      {activeOverlay === "load" ? (
        <SavePanel
          mode="load"
          slotOptions={slotOptions}
          selectedSlot={selectedSlot}
          onSelectSlot={onSelectSlot}
          onConfirm={onConfirmLoad}
          onClose={onCloseOverlay}
          canConfirm={canLoad}
        />
      ) : null}
    </section>
  );
};
