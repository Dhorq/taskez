import type { Priority, Status } from "../../types/task";

const priorityStyles: Record<Priority, { label: string; dot: string; text: string; bg: string }> = {
  low: {
    label: "Low",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  medium: {
    label: "Medium",
    dot: "bg-amber-500",
    text: "text-amber-700",
    bg: "bg-amber-50",
  },
  high: {
    label: "High",
    dot: "bg-rose-500",
    text: "text-rose-700",
    bg: "bg-rose-50",
  },
};

/** Priority shown with a colored dot + label so it never relies on color alone. */
export function PriorityBadge({ priority }: { priority: Priority }) {
  const s = priorityStyles[priority] ?? priorityStyles.low;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${s.bg} ${s.text}`}
    >
      <span className={`size-1.5 rounded-full ${s.dot}`} aria-hidden="true" />
      {s.label}
    </span>
  );
}

const statusStyles: Record<Status, { label: string; text: string; bg: string }> = {
  new: { label: "New", text: "text-primary", bg: "bg-primary-soft" },
  review: { label: "Review", text: "text-amber-700", bg: "bg-amber-50" },
  delivery: { label: "Delivery", text: "text-sky-700", bg: "bg-sky-50" },
  completed: { label: "Completed", text: "text-emerald-700", bg: "bg-emerald-50" },
};

export function StatusBadge({ status }: { status: Status }) {
  const s = statusStyles[status] ?? statusStyles.new;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${s.bg} ${s.text}`}
    >
      {s.label}
    </span>
  );
}
