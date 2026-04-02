import { OverlayPanel } from "./OverlayPanel";
import type { StoryHistoryEntry } from "../game/types";

interface HistoryPanelProps {
  entries: StoryHistoryEntry[];
  onClose: () => void;
}

export const HistoryPanel = ({ entries, onClose }: HistoryPanelProps) => {
  return (
    <OverlayPanel title="回看记录" onClose={onClose}>
      <div className="history-panel">
        {entries.length === 0 ? (
          <p className="empty-state">还没有可回看的内容。</p>
        ) : (
          entries.map((entry, index) => (
            <article key={`${entry.nodeId}-${index}`} className="history-panel__entry">
              <p className="history-panel__speaker">{entry.speakerName}</p>
              {entry.speakerTitle ? (
                <p className="history-panel__title">{entry.speakerTitle}</p>
              ) : null}
              <div className="history-panel__text">
                {entry.text.map((paragraph, paragraphIndex) => (
                  <p key={`${entry.nodeId}-${paragraphIndex}`}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))
        )}
      </div>
    </OverlayPanel>
  );
};
