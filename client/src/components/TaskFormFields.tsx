import type { TaskFormValues } from "./formConstants";
import { inputClass, PRIORITIES, STATUSES } from "./formConstants";
import type { TaskPriority, TaskStatus } from "../types/task";

type Props = {
  values: TaskFormValues;
  error?: string | null;
  onTitleChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onPriorityChange: (v: TaskPriority) => void;
  onStatusChange: (v: TaskStatus) => void;
  priorityNamePrefix?: string;
  showStatus?: boolean;
};

/** Shared field set for the add/edit task modals. */
export default function TaskFormFields({
  values,
  error,
  onTitleChange,
  onDescriptionChange,
  onPriorityChange,
  onStatusChange,
  priorityNamePrefix = "priority",
  showStatus = false,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={`${priorityNamePrefix}-title`}
          className="text-xs font-medium text-ink-secondary"
        >
          Title
        </label>
        <input
          id={`${priorityNamePrefix}-title`}
          name="title"
          value={values.title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="e.g. Finish onboarding screens"
          aria-invalid={!!error}
          aria-describedby={error ? `${priorityNamePrefix}-title-error` : undefined}
          className={`${inputClass} ${error ? "border-danger" : ""}`}
          maxLength={100}
        />
        {error && (
          <p id={`${priorityNamePrefix}-title-error`} role="alert" className="text-xs text-danger">
            {error}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={`${priorityNamePrefix}-description`}
          className="text-xs font-medium text-ink-secondary"
        >
          Description <span className="text-ink-muted">(optional)</span>
        </label>
        <textarea
          id={`${priorityNamePrefix}-description`}
          name="description"
          value={values.description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Add any extra context…"
          rows={3}
          maxLength={500}
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${priorityNamePrefix}-status`} className="text-xs font-medium text-ink-secondary">
          Priority
        </label>
        <div
          role="radiogroup"
          aria-label="Priority"
          className="flex gap-1 rounded-xl bg-canvas p-1"
        >
          {PRIORITIES.map((p) => {
            const active = values.priority === p.value;
            return (
              <button
                key={p.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onPriorityChange(p.value)}
                className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "bg-surface text-ink shadow-sm ring-1 ring-line"
                    : "text-ink-secondary hover:text-ink"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {showStatus && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${priorityNamePrefix}-status`} className="text-xs font-medium text-ink-secondary">
            Status
          </label>
          <div className="flex gap-2">
            <select
              id={`${priorityNamePrefix}-status`}
              name="status"
              value={values.status}
              onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
              className={`${inputClass} flex-1`}
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
