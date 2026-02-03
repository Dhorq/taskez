import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  id: string;
  title: string;
  columnId: string;
};

const Task = ({ id, title, columnId }: Props) => {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => e.stopPropagation()}
      className="
        bg-white/15 border-gray-500 border text-white p-3 h-40 w-full shrink-0 rounded-lg
        cursor-grab active:cursor-grabbing
        select-none
        shadow-md hover:shadow-xl
        transition-all duration-200
      "
    >
      {title}
    </div>
  );
};

export default Task;
