import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";

type ToastKind = "success" | "error" | "info";

type Toast = {
  id: number;
  kind: ToastKind;
  message: string;
};

type ToastContextType = {
  toast: (kind: ToastKind, message: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

const icons: Record<ToastKind, ReactNode> = {
  success: <CheckCircle2 className="size-4 text-success" aria-hidden="true" />,
  error: <XCircle className="size-4 text-danger" aria-hidden="true" />,
  info: <Info className="size-4 text-primary" aria-hidden="true" />,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (kind: ToastKind, message: string) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev.slice(-3), { id, kind, message }]);
      window.setTimeout(() => remove(id), 4000);
    },
    [remove],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-4 left-1/2 z-[60] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4 sm:left-auto sm:right-4 sm:translate-x-0 sm:px-0"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="toast-in pointer-events-auto flex items-center gap-2.5 rounded-xl border border-line bg-surface px-3.5 py-2.5 shadow-overlay"
          >
            {icons[t.kind]}
            <p className="flex-1 text-sm text-ink">{t.message}</p>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => remove(t.id)}
              className="rounded-md p-1 text-ink-muted hover:bg-canvas hover:text-ink transition-colors"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
