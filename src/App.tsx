import { useEffect, useState } from "react";
import { StoryScreen } from "./components/StoryScreen";
import { TitleScreen } from "./components/TitleScreen";
import { useStoryEngine } from "./game/engine/useStoryEngine";
import { createProtagonistProfile } from "./game/protagonist";
import { loadStoryProgress, saveStoryProgress } from "./game/save";
import { initialChapterId, storyRegistry } from "./game/story";
import type { ProtagonistGender, StorySaveData } from "./game/types";

type AppScreen = "title" | "story";

function App() {
  const [screen, setScreen] = useState<AppScreen>("title");
  const [selectedGender, setSelectedGender] = useState<ProtagonistGender>("female");
  const [currentChapterId, setCurrentChapterId] = useState(initialChapterId);
  const [saveData, setSaveData] = useState<StorySaveData | null>(() => loadStoryProgress());
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
  const continueLabel = saveData
    ? `继续游戏 · ${storyRegistry[saveData.chapterId]?.title ?? saveData.chapterId}`
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
      setSaveStatus("已读取存档");
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
    saveStoryProgress(snapshot);
    setSaveData(loadStoryProgress());
    setSaveStatus("已保存进度");
  };

  const handleLoad = () => {
    const snapshot = loadStoryProgress();
    if (!snapshot) {
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

  return (
    <main className="app-shell">
      {screen === "title" ? (
        <TitleScreen
          title={chapter.title}
          subtitle={chapter.subtitle}
          selectedGender={selectedGender}
          onSelectGender={setSelectedGender}
          hasSave={Boolean(saveData)}
          continueLabel={continueLabel}
          onStart={handleStart}
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
          canLoad={Boolean(saveData)}
          onAdvance={engine.advance}
          onChoose={engine.choose}
          onSave={handleSave}
          onLoad={handleLoad}
          onReturnTitle={handleReturnTitle}
        />
      )}
    </main>
  );
}

export default App;
