import type { TaskPriority, TaskStatus } from "../types/task";

export type TaskFormValues = {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
};

export const PRIORITIES: { value: TaskPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export const STATUSES: { value: TaskStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "review", label: "Review" },
  { value: "delivery", label: "Delivery" },
  { value: "completed", label: "Completed" },
];

export const inputClass =
  "w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/70 transition-colors focus:border-primary";

export function getErrorMessage(
  err: unknown,
  fallback: string,
  field?: string,
): string {
  const maybe =
    typeof err === "object" && err !== null
      ? (err as { response?: { data?: { message?: unknown } } }).response?.data
          ?.message
      : undefined;
  if (typeof maybe === "string" && maybe) return maybe;

  if (field) {
    const fieldMsgs =
      typeof err === "object" && err !== null
        ? (
            err as {
              response?: { data?: { errors?: Record<string, string[]> } };
            }
          ).response?.data?.errors?.[field]
        : undefined;
    if (Array.isArray(fieldMsgs) && typeof fieldMsgs[0] === "string") {
      return fieldMsgs[0];
    }
  }

  return fallback;
}
