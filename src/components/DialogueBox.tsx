interface DialogueBoxProps {
  speakerName?: string;
  speakerTitle?: string;
  text: string[];
}

export const DialogueBox = ({ speakerName, speakerTitle, text }: DialogueBoxProps) => {
  return (
    <section className="dialogue-box">
      <div className="dialogue-box__header">
        <div>
          <p className="dialogue-box__speaker">{speakerName ?? "旁白"}</p>
          {speakerTitle ? <p className="dialogue-box__title">{speakerTitle}</p> : null}
        </div>
      </div>
      <div className="dialogue-box__body">
        {text.map((paragraph, index) => (
          <p key={`${paragraph}-${index}`}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
};
