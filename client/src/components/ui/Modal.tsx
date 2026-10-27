import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  labelledById?: string;
};

/**
 * Shared accessible modal: overlay click + Escape close, focus is moved
 * into the dialog on open and restored on close.
 */
export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>(
      "input, textarea, select, button",
    )?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previouslyFocused.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-ink/40 fade-in"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-surface w-full max-w-md rounded-2xl shadow-overlay modal-pop overflow-hidden"
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-5">
          <div>
            <h2 className="text-base font-semibold text-ink">{title}</h2>
            {description && (
              <p className="mt-0.5 text-sm text-ink-muted">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-ink-muted hover:bg-canvas hover:text-ink transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>

        {footer && (
          <div className="flex justify-end gap-2 border-t border-line bg-canvas/60 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
