import { useState } from "react";
import Modal from "./ui/Modal";
import TaskFormFields from "./TaskFormFields";
import type { TaskFormValues } from "./formConstants";
import type { TaskStatus } from "../types/task";

type Props = {
  open: boolean;
  targetStatus: TaskStatus;
  loading: boolean;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => Promise<boolean>;
};

export default function AddTask({
  open,
  targetStatus,
  loading,
  onClose,
  onSubmit,
}: Props) {
  if (!open) return null;

  const handleReset = onClose;

  return (
    <Modal
      open={open}
      onClose={loading ? () => {} : onClose}
      title="Add a task"
      description="Only a title is required — add details later if needed."
      footer={
        <>
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="rounded-lg border border-line bg-surface px-3.5 py-2 text-sm font-medium text-ink-secondary hover:bg-canvas transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-task-form"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors disabled:opacity-60"
          >
            {loading && (
              <span className="size-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            Add task
          </button>
        </>
      }
    >
      <AddTaskForm
        key={targetStatus + String(open)}
        targetStatus={targetStatus}
        onSubmit={onSubmit}
      />
    </Modal>
  );
}

function AddTaskForm({
  targetStatus,
  onSubmit,
}: {
  targetStatus: TaskStatus;
  onSubmit: (values: TaskFormValues) => Promise<boolean>;
}) {
  const [values, setValues] = useState<TaskFormValues>({
    title: "",
    description: "",
    priority: "low",
    status: targetStatus,
  });
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof TaskFormValues>(key: K, v: TaskFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.title.trim()) {
      setError("Please enter a title.");
      return;
    }
    await onSubmit(values);
  };

  return (
    <form id="add-task-form" onSubmit={handleSubmit}>
      <TaskFormFields
        values={values}
        error={error}
        priorityNamePrefix="add"
        showStatus={false}
        onTitleChange={(v) => {
          set("title", v);
          if (error && v.trim()) setError(null);
        }}
        onDescriptionChange={(v) => set("description", v)}
        onPriorityChange={(v) => set("priority", v)}
        onStatusChange={(v) => set("status", v)}
      />
    </form>
  );
}
