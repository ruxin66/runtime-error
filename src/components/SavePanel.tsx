import { OverlayPanel } from "./OverlayPanel";

interface SaveSlotOption {
  slotId: number;
  label: string;
  detail?: string;
}

interface SavePanelProps {
  mode: "save" | "load";
  slotOptions: SaveSlotOption[];
  selectedSlot: number;
  onSelectSlot: (slotId: number) => void;
  onConfirm: () => void;
  onClose: () => void;
  canConfirm?: boolean;
}

export const SavePanel = ({
  mode,
  slotOptions,
  selectedSlot,
  onSelectSlot,
  onConfirm,
  onClose,
  canConfirm = true,
}: SavePanelProps) => {
  const title = mode === "save" ? "存档" : "读档";

  return (
    <OverlayPanel title={title} onClose={onClose}>
      <div className="save-panel">
        <div className="save-panel__slots">
          {slotOptions.map((slot) => (
            <button
              key={slot.slotId}
              className={selectedSlot === slot.slotId ? "save-panel__slot is-active" : "save-panel__slot"}
              type="button"
              onClick={() => onSelectSlot(slot.slotId)}
            >
              <p className="save-panel__slot-label">{slot.label}</p>
              {slot.detail ? <p className="save-panel__slot-detail">{slot.detail}</p> : null}
            </button>
          ))}
        </div>

        <div className="save-panel__actions">
          <button className="ghost-button" type="button" onClick={onClose}>
            取消
          </button>
          <button className="primary-button" type="button" onClick={onConfirm} disabled={!canConfirm}>
            {mode === "save" ? `存到 ${selectedSlot} 号位` : `读取 ${selectedSlot} 号位`}
          </button>
        </div>
      </div>
    </OverlayPanel>
  );
};
