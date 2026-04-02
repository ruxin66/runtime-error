import { useEffect, useState } from "react";
import { ProtagonistSelectScreen } from "./components/ProtagonistSelectScreen";
import { StoryScreen } from "./components/StoryScreen";
import { TitleScreen } from "./components/TitleScreen";
import { useStoryEngine } from "./game/engine/useStoryEngine";
import { loadReaderSettings, saveReaderSettings } from "./game/preferences";
import { createProtagonistProfile } from "./game/protagonist";
import { listStoryProgress, loadStoryProgress, MAX_SAVE_SLOTS, saveStoryProgress } from "./game/save";
import { initialChapterId, storyRegistry } from "./game/story";
import type { ProtagonistGender, ReaderSettings, StorySaveData } from "./game/types";

type AppScreen = "title" | "protagonist-select" | "story";
type StoryOverlay = "history" | "settings" | "save" | "load" | null;

function App() {
  const [screen, setScreen] = useState<AppScreen>("title");
  const [selectedGender, setSelectedGender] = useState<ProtagonistGender>("female");
  const [currentChapterId, setCurrentChapterId] = useState(initialChapterId);
  const [activeOverlay, setActiveOverlay] = useState<StoryOverlay>(null);
  const [settings, setSettings] = useState<ReaderSettings>(() => loadReaderSettings());
  const [selectedSlot, setSelectedSlot] = useState(1);
  const [saveSlots, setSaveSlots] = useState<StorySaveData[]>(() => listStoryProgress());
  const [pendingLoad, setPendingLoad] = useState<StorySaveData | null>(null);
  const [saveStatus, setSaveStatus] = useState<string>("");
  const chapter = storyRegistry[currentChapterId];
  const engine = useStoryEngine(chapter);
  const selectedSave = saveSlots.find((entry) => entry.slotId === selectedSlot) ?? null;
  const continueLabel = selectedSave
    ? `继续游戏 · ${storyRegistry[selectedSave.chapterId]?.title ?? selectedSave.chapterId}`
    : undefined;

  useEffect(() => {
    saveReaderSettings(settings);
  }, [settings]);

  useEffect(() => {
    if (!saveStatus) {
      return;
    }

    const timeoutId = window.setTimeout(() => setSaveStatus(""), 1800);
    return () => window.clearTimeout(timeoutId);
  }, [saveStatus]);

  useEffect(() => {
    if (!pendingLoad) {
      return;
    }

    if (engine.chapter.id !== pendingLoad.chapterId) {
      return;
    }

    const restored = engine.restore(pendingLoad);
    if (restored) {
      setSelectedGender(pendingLoad.state.protagonist.gender);
      setScreen("story");
      setActiveOverlay(null);
      setSaveStatus(`已读取 ${pendingLoad.slotId} 号位`);
    }

    setPendingLoad(null);
  }, [engine, pendingLoad]);

  const handleStart = () => {
    setActiveOverlay(null);
    setScreen("protagonist-select");
  };

  const handleConfirmProtagonist = () => {
    setCurrentChapterId(initialChapterId);
    setActiveOverlay(null);
    engine.restart({
      protagonist: createProtagonistProfile(selectedGender),
    });
    setScreen("story");
  };

  const handleSave = () => {
    const snapshot = engine.createSnapshot();
    saveStoryProgress(selectedSlot, snapshot);
    setSaveSlots(listStoryProgress());
    setActiveOverlay(null);
    setSaveStatus(`已保存到 ${selectedSlot} 号位`);
  };

  const handleLoad = () => {
    const snapshot = loadStoryProgress(selectedSlot);
    if (!snapshot) {
      setActiveOverlay(null);
      setSaveStatus(`${selectedSlot} 号位为空`);
      return;
    }

    if (!storyRegistry[snapshot.chapterId]) {
      setActiveOverlay(null);
      setSaveStatus("存档章节不存在");
      return;
    }

    setCurrentChapterId(snapshot.chapterId);
    setPendingLoad(snapshot);
  };

  const handleReturnTitle = () => {
    setSelectedGender(engine.protagonist.gender);
    setActiveOverlay(null);
    setScreen("title");
  };

  const slotOptions = Array.from({ length: MAX_SAVE_SLOTS }, (_, index) => {
    const slotId = index + 1;
    const saveEntry = saveSlots.find((entry) => entry.slotId === slotId);

    return {
      slotId,
      label: saveEntry
        ? `${slotId} 号位`
        : `${slotId} 号位 · 空`,
      detail: saveEntry
        ? `${storyRegistry[saveEntry.chapterId]?.title ?? saveEntry.chapterId} · ${new Date(
            saveEntry.savedAt,
          ).toLocaleString("zh-CN", {
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}`
        : "空白存档",
    };
  });

  return (
    <main className="app-shell">
      {screen === "title" ? (
        <TitleScreen
          title={chapter.title}
          subtitle={chapter.subtitle}
          selectedSlot={selectedSlot}
          slotOptions={slotOptions}
          hasSave={Boolean(selectedSave)}
          continueLabel={continueLabel}
          onStart={handleStart}
          onSelectSlot={setSelectedSlot}
          onContinue={handleLoad}
        />
      ) : screen === "protagonist-select" ? (
        <ProtagonistSelectScreen
          selectedGender={selectedGender}
          onSelectGender={setSelectedGender}
          onConfirm={handleConfirmProtagonist}
          onBack={() => setScreen("title")}
        />
      ) : (
        <StoryScreen
          chapter={engine.chapter}
          node={engine.currentNode}
          text={engine.currentText}
          choices={engine.currentChoices}
          speakerName={engine.currentSpeakerName}
          speakerTitle={engine.currentSpeakerTitle}
          background={engine.currentBackground}
          canAdvance={engine.canAdvance}
          isEnding={engine.isEnding}
          saveStatus={saveStatus}
          settings={settings}
          history={engine.history}
          activeOverlay={activeOverlay}
          selectedSlot={selectedSlot}
          slotOptions={slotOptions}
          canLoad={Boolean(selectedSave)}
          onAdvance={engine.advance}
          onChoose={engine.choose}
          onOpenSave={() => setActiveOverlay("save")}
          onOpenLoad={() => setActiveOverlay("load")}
          onOpenHistory={() => setActiveOverlay("history")}
          onOpenSettings={() => setActiveOverlay("settings")}
          onConfirmSave={handleSave}
          onConfirmLoad={handleLoad}
          onSelectSlot={setSelectedSlot}
          onChangeTextSize={(textSize) =>
            setSettings((previousSettings) => ({ ...previousSettings, textSize }))
          }
          onToggleAdvanceHint={() =>
            setSettings((previousSettings) => ({
              ...previousSettings,
              showAdvanceHint: !previousSettings.showAdvanceHint,
            }))
          }
          onCloseOverlay={() => setActiveOverlay(null)}
          onReturnTitle={handleReturnTitle}
        />
      )}
    </main>
  );
}

export default App;
