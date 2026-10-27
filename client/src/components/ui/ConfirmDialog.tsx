import Modal from "./Modal";
import { Trash2 } from "lucide-react";

type Props = {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmDialog({
  open,
  title = "Delete task?",
  message,
  confirmLabel = "Delete",
  loading = false,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <Modal
      open={open}
      onClose={loading ? () => {} : onCancel}
      title={title}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-danger-soft text-danger">
          <Trash2 className="size-4" aria-hidden="true" />
        </span>
        <p className="text-sm leading-relaxed text-ink-secondary">{message}</p>
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-lg border border-line bg-surface px-3.5 py-2 text-sm font-medium text-ink-secondary hover:bg-canvas transition-colors disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg bg-danger px-3.5 py-2 text-sm font-medium text-white hover:bg-danger/90 transition-colors disabled:opacity-60"
        >
          {loading && (
            <span className="size-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          )}
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
