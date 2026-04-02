import { BackgroundStage } from "./BackgroundStage";
import { ChoicePanel } from "./ChoicePanel";
import { DialogueBox } from "./DialogueBox";
import {
  isChoiceNode,
  isEndNode,
  type BackgroundProfile,
  type StoryChapter,
  type StoryNode,
} from "../game/types";

interface StoryScreenProps {
  chapter: StoryChapter;
  node: StoryNode;
  text: string[];
  speakerName?: string;
  speakerTitle?: string;
  background: BackgroundProfile;
  canAdvance: boolean;
  isEnding: boolean;
  onAdvance: () => void;
  onChoose: (choiceId: string) => void;
  onReturnTitle: () => void;
}

export const StoryScreen = ({
  chapter,
  node,
  text,
  speakerName,
  speakerTitle,
  background,
  canAdvance,
  isEnding,
  onAdvance,
  onChoose,
  onReturnTitle,
}: StoryScreenProps) => {
  const renderFooter = () => {
    if (isChoiceNode(node)) {
      return <ChoicePanel choices={node.choices} onSelect={onChoose} />;
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
        <button className="ghost-button" type="button" onClick={onReturnTitle}>
          返回标题
        </button>
      </header>

      <BackgroundStage background={background} />

      <div className="story-screen__panel">
        <DialogueBox speakerName={speakerName} speakerTitle={speakerTitle} text={text} />
        {renderFooter()}
      </div>
    </section>
  );
};
