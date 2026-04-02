import type { ProtagonistGender } from "../game/types";

interface SaveSlotOption {
  slotId: number;
  label: string;
}

interface TitleScreenProps {
  title: string;
  subtitle: string;
  selectedGender: ProtagonistGender;
  onSelectGender: (gender: ProtagonistGender) => void;
  selectedSlot: number;
  slotOptions: SaveSlotOption[];
  hasSave: boolean;
  continueLabel?: string;
  onStart: () => void;
  onSelectSlot: (slotId: number) => void;
  onContinue: () => void;
}

export const TitleScreen = ({
  title,
  subtitle,
  selectedGender,
  onSelectGender,
  selectedSlot,
  slotOptions,
  hasSave,
  continueLabel,
  onStart,
  onSelectSlot,
  onContinue,
}: TitleScreenProps) => {
  return (
    <section className="title-screen">
      <div className="title-screen__backdrop" />
      <div className="title-screen__content">
        <p className="eyebrow">Steam Galgame MVP</p>
        <h1>{title}</h1>
        <p className="title-screen__subtitle">{subtitle}</p>
        <div className="title-screen__selector">
          <p className="title-screen__selector-label">主角身份</p>
          <div className="title-screen__selector-actions">
            <button
              className={selectedGender === "female" ? "selector-button is-active" : "selector-button"}
              type="button"
              onClick={() => onSelectGender("female")}
            >
              余闯（她）
            </button>
            <button
              className={selectedGender === "male" ? "selector-button is-active" : "selector-button"}
              type="button"
              onClick={() => onSelectGender("male")}
            >
              余闯（他）
            </button>
          </div>
        </div>
        <div className="title-screen__selector">
          <p className="title-screen__selector-label">存档位</p>
          <div className="title-screen__selector-actions">
            {slotOptions.map((slot) => (
              <button
                key={slot.slotId}
                className={selectedSlot === slot.slotId ? "selector-button is-active" : "selector-button"}
                type="button"
                onClick={() => onSelectSlot(slot.slotId)}
              >
                {slot.label}
              </button>
            ))}
          </div>
        </div>
        <div className="title-screen__cta">
          <button className="primary-button" type="button" onClick={onStart}>
            开始游戏
          </button>
          <button
            className="ghost-button"
            type="button"
            onClick={onContinue}
            disabled={!hasSave}
          >
            {continueLabel ?? "继续游戏"}
          </button>
        </div>
      </div>
    </section>
  );
};
