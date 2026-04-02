import { useState } from "react";
import { StoryScreen } from "./components/StoryScreen";
import { TitleScreen } from "./components/TitleScreen";
import { useStoryEngine } from "./game/engine/useStoryEngine";
import { initialChapterId, storyRegistry } from "./game/story";

type AppScreen = "title" | "story";

const chapter = storyRegistry[initialChapterId];

function App() {
  const [screen, setScreen] = useState<AppScreen>("title");
  const engine = useStoryEngine(chapter);

  const handleStart = () => {
    engine.restart();
    setScreen("story");
  };

  const handleReturnTitle = () => {
    engine.restart();
    setScreen("title");
  };

  return (
    <main className="app-shell">
      {screen === "title" ? (
        <TitleScreen title={chapter.title} subtitle={chapter.subtitle} onStart={handleStart} />
      ) : (
        <StoryScreen
          chapter={engine.chapter}
          node={engine.currentNode}
          text={engine.currentText}
          speakerName={engine.currentCharacter?.name}
          speakerTitle={engine.currentCharacter?.title}
          background={engine.currentBackground}
          canAdvance={engine.canAdvance}
          isEnding={engine.isEnding}
          onAdvance={engine.advance}
          onChoose={engine.choose}
          onReturnTitle={handleReturnTitle}
        />
      )}
    </main>
  );
}

export default App;
