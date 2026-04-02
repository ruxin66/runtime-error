import type { BackgroundProfile } from "../game/types";

interface BackgroundStageProps {
  background: BackgroundProfile;
}

export const BackgroundStage = ({ background }: BackgroundStageProps) => {
  return (
    <div
      className="background-stage"
      aria-label={background.label}
      title={background.description}
    >
      <div className="background-stage__glow" />
      <div className="background-stage__portrait-zone" aria-hidden="true">
        <div className="background-stage__portrait-frame">
          <div className="background-stage__portrait-head" />
          <div className="background-stage__portrait-body" />
        </div>
      </div>
    </div>
  );
};
