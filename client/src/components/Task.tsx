import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Pencil, GripVertical } from "lucide-react";
import type { Task as TaskData } from "../types/task";
import { PriorityBadge } from "./ui/Badges";

type Props = {
  task: TaskData;
  onEdit: (task: TaskData) => void;
  onDelete: (task: TaskData) => void;
};

const Task = ({ task, onEdit, onDelete }: Props) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({
    id: task.id,
    data: { columnId: task.status },
  });

  const completed = task.status === "completed";

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? "transform 150ms ease",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      role="button"
      aria-label={`Task: ${task.title}. Open editor`}
      onClick={() => onEdit(task)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onEdit(task);
        }
      }}
      className={`
        group relative w-full shrink-0 cursor-grab select-none rounded-xl border
        bg-surface p-3.5 pl-9 shadow-card text-left
        transition-shadow duration-200 hover:shadow-lift
        active:cursor-grabbing
        ${isDragging ? "opacity-40 border-primary/30" : ""}
        ${isOver ? "ring-2 ring-primary/40" : ""}
        border-line
      `}
    >
      {/* Drag handle zone (whole card carries listeners; handle is the visual affordance) */}
      <span
        aria-hidden="true"
        className="absolute left-2 top-3.5 text-ink-muted/50 group-hover:text-ink-muted transition-colors"
      >
        <GripVertical className="size-4" />
      </span>

      <div className="mb-1.5 flex items-center justify-between gap-2">
        <PriorityBadge priority={task.priority} />
        <div
          className="flex gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            aria-label={`Edit task ${task.title}`}
            className="rounded-md p-1.5 text-ink-muted hover:bg-canvas hover:text-ink transition-colors"
          >
            <Pencil className="size-3.5" />
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task);
            }}
            aria-label={`Delete task ${task.title}`}
            className="rounded-md p-1.5 text-ink-muted hover:bg-danger-soft hover:text-danger transition-colors"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      <h3
        className={`text-sm font-medium leading-snug break-words ${
          completed ? "text-ink-muted line-through" : "text-ink"
        }`}
      >
        {task.title}
      </h3>

      {task.description && (
        <p
          className={`mt-1 text-xs leading-relaxed line-clamp-2 ${
            completed ? "text-ink-muted/70" : "text-ink-secondary"
          }`}
        >
          {task.description}
        </p>
      )}
    </div>
  );
};

function TrashIcon() {
  return (
    <svg
      className="size-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    </svg>
  );
}

export default Task;
