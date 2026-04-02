import type { BackgroundProfile } from "../game/types";

interface BackgroundStageProps {
  background: BackgroundProfile;
}

export const BackgroundStage = ({ background }: BackgroundStageProps) => {
  return (
    <div className="background-stage">
      <div className="background-stage__glow" />
      <div className="background-stage__meta">
        <p className="eyebrow">背景</p>
        <h2>{background.label}</h2>
        <p>{background.description}</p>
      </div>
    </div>
  );
};
