import { OverlayPanel } from "./OverlayPanel";
import type { ReaderSettings } from "../game/types";

interface SettingsPanelProps {
  settings: ReaderSettings;
  onChangeTextSize: (textSize: ReaderSettings["textSize"]) => void;
  onToggleAdvanceHint: () => void;
  onClose: () => void;
}

export const SettingsPanel = ({
  settings,
  onChangeTextSize,
  onToggleAdvanceHint,
  onClose,
}: SettingsPanelProps) => {
  return (
    <OverlayPanel title="设置" onClose={onClose}>
      <div className="settings-panel">
        <section className="settings-panel__group">
          <p className="settings-panel__label">正文字号</p>
          <div className="settings-panel__actions">
            <button
              className={settings.textSize === "compact" ? "selector-button is-active" : "selector-button"}
              type="button"
              onClick={() => onChangeTextSize("compact")}
            >
              小
            </button>
            <button
              className={settings.textSize === "standard" ? "selector-button is-active" : "selector-button"}
              type="button"
              onClick={() => onChangeTextSize("standard")}
            >
              中
            </button>
            <button
              className={settings.textSize === "large" ? "selector-button is-active" : "selector-button"}
              type="button"
              onClick={() => onChangeTextSize("large")}
            >
              大
            </button>
          </div>
        </section>

        <section className="settings-panel__group">
          <p className="settings-panel__label">提示文本</p>
          <button className="selector-button" type="button" onClick={onToggleAdvanceHint}>
            {settings.showAdvanceHint ? "隐藏“点击继续”" : "显示“点击继续”"}
          </button>
        </section>
      </div>
    </OverlayPanel>
  );
};
