import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Pencil, Trash2 } from "lucide-react";

type Props = {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  columnId: string;
  onEdit: () => void;
  onDelete: () => void;
};

const Task = ({ id, title, description, priority, columnId, onEdit, onDelete }: Props) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: { columnId },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? "transform 150ms ease",
    opacity: isDragging ? 0.25 : 1,
  };

  const priorityColor = {
    low: "bg-green-500/20 text-green-400 border-green-400/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-400/30",
    high: "bg-red-500/20 text-red-400 border-red-400/30",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="
        w-full min-h-28 shrink-0
        bg-white/10 backdrop-blur-md
        border border-white/10
        rounded-xl p-4
        cursor-grab active:cursor-grabbing
        select-none
        shadow-md hover:shadow-xl
        hover:-translate-y-0.5
        transition-all duration-300
        flex flex-col gap-2
        group
      "
    >
      <div className="flex justify-between items-center">
        <span
          className={`
            text-xs font-semibold px-2 py-1 rounded-md border
            ${priorityColor[priority]}
          `}
        >
          {priority.toUpperCase()}
        </span>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1.5 rounded-md bg-white/10 hover:bg-blue-500/30 text-gray-300 hover:text-blue-300 transition-colors"
          >
            <Pencil className="size-3.5" />
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 rounded-md bg-white/10 hover:bg-red-500/30 text-gray-300 hover:text-red-400 transition-colors"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>

      <h3 className="font-semibold text-white text-md leading-snug">{title}</h3>

      {description && (
        <p className="text-xs text-gray-300 line-clamp-3">{description}</p>
      )}
    </div>
  );
};

export default Task;
