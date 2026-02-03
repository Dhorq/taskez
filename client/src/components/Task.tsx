import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  columnId: string;
};

const Task = ({ id, title, description, priority, columnId }: Props) => {
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
      onClick={(e) => e.stopPropagation()}
      className="
        w-full h-50
        bg-white/10 backdrop-blur-md
        border border-white/10
        rounded-xl p-4
        cursor-grab active:cursor-grabbing
        select-none
        shadow-md hover:shadow-xl
        hover:-translate-y-0.5
        transition-all duration-300
        flex flex-col gap-2
      "
    >
      <div className="flex justify-start">
        <span
          className={`
            text-xs font-semibold px-2 py-1 rounded-md border
            ${priorityColor[priority]}
          `}
        >
          {priority.toUpperCase()}
        </span>
      </div>

      <h3 className="font-semibold text-white text-md leading-snug">{title}</h3>

      {description && (
        <p className="text-xs text-gray-300 line-clamp-3">{description}</p>
      )}
    </div>
  );
};

export default Task;
