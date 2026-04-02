import type { ProtagonistGender } from "../game/types";

interface ProtagonistSelectScreenProps {
  selectedGender: ProtagonistGender;
  onSelectGender: (gender: ProtagonistGender) => void;
  onConfirm: () => void;
  onBack: () => void;
}

export const ProtagonistSelectScreen = ({
  selectedGender,
  onSelectGender,
  onConfirm,
  onBack,
}: ProtagonistSelectScreenProps) => {
  return (
    <section className="protagonist-select-screen">
      <div className="protagonist-select-screen__backdrop" />

      <div className="protagonist-select-screen__content">
        <header className="protagonist-select-screen__header">
          <p className="eyebrow">Character Select</p>
          <h1>选择余闯的身份</h1>
          <p>点击开始游戏后进入身份选择。后续会在这里替换成真正的左右立绘图片。</p>
        </header>

        <div className="protagonist-select-screen__stage">
          <button
            className={
              selectedGender === "female"
                ? "protagonist-card is-active"
                : "protagonist-card"
            }
            type="button"
            onClick={() => onSelectGender("female")}
          >
            <div className="protagonist-card__portrait protagonist-card__portrait--left">
              <div className="protagonist-card__silhouette" />
            </div>
            <div className="protagonist-card__meta">
              <p className="protagonist-card__name">余闯</p>
              <p className="protagonist-card__detail">她</p>
            </div>
          </button>

          <button
            className={
              selectedGender === "male"
                ? "protagonist-card is-active"
                : "protagonist-card"
            }
            type="button"
            onClick={() => onSelectGender("male")}
          >
            <div className="protagonist-card__portrait protagonist-card__portrait--right">
              <div className="protagonist-card__silhouette" />
            </div>
            <div className="protagonist-card__meta">
              <p className="protagonist-card__name">余闯</p>
              <p className="protagonist-card__detail">他</p>
            </div>
          </button>
        </div>

        <div className="protagonist-select-screen__actions">
          <button className="ghost-button" type="button" onClick={onBack}>
            返回标题
          </button>
          <button className="primary-button" type="button" onClick={onConfirm}>
            进入剧情
          </button>
        </div>
      </div>
    </section>
  );
};
