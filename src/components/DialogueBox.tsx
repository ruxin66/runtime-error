import type { ReaderTextSize } from "../game/types";

interface DialogueBoxProps {
  speakerName?: string;
  speakerTitle?: string;
  text: string[];
  clickable?: boolean;
  showAdvanceHint?: boolean;
  textSize?: ReaderTextSize;
  onAdvance?: () => void;
}

export const DialogueBox = ({
  speakerName,
  speakerTitle,
  text,
  clickable = false,
  showAdvanceHint = true,
  textSize = "standard",
  onAdvance,
}: DialogueBoxProps) => {
  const handleClick = () => {
    if (!clickable || !onAdvance) {
      return;
    }

    onAdvance();
  };

  return (
    <section
      className={
        clickable
          ? `dialogue-box is-clickable is-${textSize}`
          : `dialogue-box is-${textSize}`
      }
      onClick={handleClick}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={
        clickable
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleClick();
              }
            }
          : undefined
      }
    >
      <div className="dialogue-box__nameplate">
        <p className="dialogue-box__speaker">{speakerName ?? "旁白"}</p>
        {speakerTitle ? <p className="dialogue-box__title">{speakerTitle}</p> : null}
      </div>
      <div className="dialogue-box__body">
        {text.map((paragraph, index) => (
          <p key={`${paragraph}-${index}`}>{paragraph}</p>
        ))}
      </div>
      {clickable && showAdvanceHint ? <p className="dialogue-box__hint">点击文字框继续</p> : null}
    </section>
  );
};
