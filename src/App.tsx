import { useEffect, useState } from "react";
import { StoryScreen } from "./components/StoryScreen";
import { TitleScreen } from "./components/TitleScreen";
import { useStoryEngine } from "./game/engine/useStoryEngine";
import { createProtagonistProfile } from "./game/protagonist";
import { listStoryProgress, loadStoryProgress, MAX_SAVE_SLOTS, saveStoryProgress } from "./game/save";
import { initialChapterId, storyRegistry } from "./game/story";
import type { ProtagonistGender, StorySaveData } from "./game/types";

type AppScreen = "title" | "story";

function App() {
  const [screen, setScreen] = useState<AppScreen>("title");
  const [selectedGender, setSelectedGender] = useState<ProtagonistGender>("female");
  const [currentChapterId, setCurrentChapterId] = useState(initialChapterId);
  const [selectedSlot, setSelectedSlot] = useState(1);
  const [saveSlots, setSaveSlots] = useState<StorySaveData[]>(() => listStoryProgress());
  const [pendingLoad, setPendingLoad] = useState<StorySaveData | null>(null);
  const [saveStatus, setSaveStatus] = useState<string>("");
  const chapter = storyRegistry[currentChapterId];
  const engine = useStoryEngine(chapter);
  const speakerName =
    engine.currentCharacter?.id === "protagonist"
      ? engine.protagonist.displayName
      : engine.currentCharacter?.name;
  const speakerTitle =
    engine.currentCharacter?.id === "protagonist"
      ? engine.protagonist.title
      : engine.currentCharacter?.title;
  const selectedSave = saveSlots.find((entry) => entry.slotId === selectedSlot) ?? null;
  const continueLabel = selectedSave
    ? `继续游戏 · ${storyRegistry[selectedSave.chapterId]?.title ?? selectedSave.chapterId}`
    : undefined;

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
      setSaveStatus(`已读取 ${pendingLoad.slotId} 号位`);
    }

    setPendingLoad(null);
  }, [engine, pendingLoad]);

  const handleStart = () => {
    setCurrentChapterId(initialChapterId);
    engine.restart({
      protagonist: createProtagonistProfile(selectedGender),
    });
    setScreen("story");
  };

  const handleSave = () => {
    const snapshot = engine.createSnapshot();
    saveStoryProgress(selectedSlot, snapshot);
    setSaveSlots(listStoryProgress());
    setSaveStatus(`已保存到 ${selectedSlot} 号位`);
  };

  const handleLoad = () => {
    const snapshot = loadStoryProgress(selectedSlot);
    if (!snapshot) {
      setSaveStatus(`${selectedSlot} 号位为空`);
      return;
    }

    if (!storyRegistry[snapshot.chapterId]) {
      setSaveStatus("存档章节不存在");
      return;
    }

    setCurrentChapterId(snapshot.chapterId);
    setPendingLoad(snapshot);
  };

  const handleReturnTitle = () => {
    setSelectedGender(engine.protagonist.gender);
    setScreen("title");
  };

  const slotOptions = Array.from({ length: MAX_SAVE_SLOTS }, (_, index) => {
    const slotId = index + 1;
    const saveEntry = saveSlots.find((entry) => entry.slotId === slotId);

    return {
      slotId,
      label: saveEntry
        ? `${slotId} 号位 · ${storyRegistry[saveEntry.chapterId]?.title ?? saveEntry.chapterId}`
        : `${slotId} 号位 · 空`,
    };
  });

  return (
    <main className="app-shell">
      {screen === "title" ? (
        <TitleScreen
          title={chapter.title}
          subtitle={chapter.subtitle}
          selectedGender={selectedGender}
          onSelectGender={setSelectedGender}
          selectedSlot={selectedSlot}
          slotOptions={slotOptions}
          hasSave={Boolean(selectedSave)}
          continueLabel={continueLabel}
          onStart={handleStart}
          onSelectSlot={setSelectedSlot}
          onContinue={handleLoad}
        />
      ) : (
        <StoryScreen
          chapter={engine.chapter}
          node={engine.currentNode}
          text={engine.currentText}
          choices={engine.currentChoices}
          speakerName={speakerName}
          speakerTitle={speakerTitle}
          background={engine.currentBackground}
          canAdvance={engine.canAdvance}
          isEnding={engine.isEnding}
          saveStatus={saveStatus}
          selectedSlot={selectedSlot}
          slotOptions={slotOptions}
          canLoad={Boolean(selectedSave)}
          onAdvance={engine.advance}
          onChoose={engine.choose}
          onSave={handleSave}
          onLoad={handleLoad}
          onSelectSlot={setSelectedSlot}
          onReturnTitle={handleReturnTitle}
        />
      )}
    </main>
  );
}

export default App;
