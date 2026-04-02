import type { ReactNode } from "react";

interface OverlayPanelProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export const OverlayPanel = ({ title, onClose, children }: OverlayPanelProps) => {
  return (
    <div className="overlay-panel" role="dialog" aria-modal="true">
      <div className="overlay-panel__backdrop" onClick={onClose} />
      <section className="overlay-panel__card">
        <header className="overlay-panel__header">
          <h2>{title}</h2>
          <button className="ghost-button" type="button" onClick={onClose}>
            关闭
          </button>
        </header>
        <div className="overlay-panel__body">{children}</div>
      </section>
    </div>
  );
};
