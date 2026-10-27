import { useState } from "react";
import Modal from "./ui/Modal";
import TaskFormFields from "./TaskFormFields";
import type { Task as TaskType } from "../types/task";
import type { TaskFormValues } from "./formConstants";

type Props = {
  open: boolean;
  task: TaskType | null;
  loading: boolean;
  onClose: () => void;
  onSave: (values: TaskFormValues) => Promise<boolean>;
};

export default function EditTask({ open, task, loading, onClose, onSave }: Props) {
  if (!open || !task) return null;

  return (
    <Modal
      open={open}
      onClose={loading ? () => {} : onClose}
      title="Edit task"
      description="Update the task details or move it between stages."
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-line bg-surface px-3.5 py-2 text-sm font-medium text-ink-secondary hover:bg-canvas transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-task-form"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors disabled:opacity-60"
          >
            {loading && (
              <span className="size-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            Save changes
          </button>
        </>
      }
    >
      <EditTaskForm key={task.id} task={task} loading={loading} onSave={onSave} />
    </Modal>
  );
}

function EditTaskForm({
  task,
  onSave,
}: {
  task: TaskType;
  loading: boolean;
  onSave: (values: TaskFormValues) => Promise<boolean>;
}) {
  const [values, setValues] = useState<TaskFormValues>({
    title: task.title,
    description: task.description,
    priority: task.priority,
    status: task.status,
  });
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof TaskFormValues>(key: K, v: TaskFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  const handleSave = () => {
    if (!values.title.trim()) {
      setError("Please enter a title.");
      return;
    }
    void onSave(values);
  };

  return (
    <form id="edit-task-form" onSubmit={handleSave}>
      <TaskFormFields
        values={values}
        error={error}
        priorityNamePrefix="edit"
        showStatus
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
