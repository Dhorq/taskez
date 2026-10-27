import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { Plus, type LucideIcon } from "lucide-react";
import TaskCard from "./Task";
import {
  COLUMN_LABELS,
  type TaskStatus,
  type Task as TaskType,
} from "../types/task";

type Props = {
  tasks: TaskType[];
  columnId: TaskStatus;
  icon: LucideIcon;
  iconColor: string;
  onAddClick: () => void;
  onEdit: (task: TaskType) => void;
  onDelete: (task: TaskType) => void;
  emptyAction?: () => void;
};

type ColumnMeta = Record<TaskStatus, { accent: string; soft: string }>;

const COLUMN_META: Record<TaskStatus, ColumnMeta[TaskStatus]> = {
  new: { accent: "bg-primary", soft: "bg-primary-soft" },
  review: { accent: "bg-amber-400", soft: "bg-amber-50" },
  delivery: { accent: "bg-sky-500", soft: "bg-sky-50" },
  completed: { accent: "bg-emerald-500", soft: "bg-emerald-50" },
};

const TaskColumn = ({
  tasks,
  columnId,
  icon: Icon,
  iconColor,
  onAddClick,
  onEdit,
  onDelete,
  emptyAction,
}: Props) => {
  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
    data: { columnId },
  });

  const meta = COLUMN_META[columnId];

  return (
    <section
      ref={setNodeRef}
      aria-label={`${columnId} column`}
      className={`flex h-full min-h-0 flex-col rounded-2xl border border-line bg-canvas/80 transition-colors ${
        isOver ? "border-primary/40 bg-primary-soft/40" : ""
      }`}
    >
      {/* Column header */}
      <header className="flex items-center justify-between px-4 pb-2 pt-4">
        <div className="flex items-center gap-2">
          <span
            className={`flex size-6 items-center justify-center rounded-lg ${meta.soft} ${iconColor}`}
          >
            <Icon className="size-3.5" aria-hidden="true" />
          </span>
          <h2 className="text-sm font-semibold text-ink">
            {COLUMN_LABELS[columnId]}
          </h2>
          <span className="rounded-full bg-surface px-1.5 py-0.5 text-[11px] font-medium text-ink-muted border border-line">
            {tasks.length}
          </span>
        </div>
        <button
          type="button"
          onClick={onAddClick}
          aria-label={`Add task to ${columnId}`}
          className="rounded-lg p-1.5 text-ink-muted hover:bg-surface hover:text-ink shadow-sm transition-colors"
        >
          <Plus className="size-4" />
        </button>
      </header>

      {/* Task list */}
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto scrollbar-thin px-3 pb-3 pt-1">
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <button
            type="button"
            onClick={emptyAction ?? onAddClick}
            className="flex min-h-24 flex-1 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-line bg-surface/50 p-4 text-center transition-colors hover:border-primary/40 hover:bg-primary-soft/40"
          >
            <Plus className="size-4 text-ink-muted" aria-hidden="true" />
            <p className="text-xs font-medium text-ink-secondary">
              {columnId === "completed"
                ? "Drop done tasks here"
                : "No tasks yet"}
            </p>
            <p className="text-[11px] text-ink-muted">Click to add one</p>
          </button>
        )}
      </div>
    </section>
  );
};

export default TaskColumn;
