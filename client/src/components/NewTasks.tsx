import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import Task from "./Task";
import { CirclePlus } from "lucide-react";

type TaskType = {
  id: string;
  title: string;
};

type Props = {
  tasks: TaskType[];
  columnId: string;
  onAddClick: () => void;
};

const NewTasks = ({ tasks, columnId, onAddClick }: Props) => {
  const { setNodeRef } = useDroppable({
    id: columnId,
    data: { columnId },
  });

  return (
    <div
      ref={setNodeRef}
      className="bg-white/5 shadow-xl rounded-lg h-[83vh] p-3 flex flex-col gap-2 overflow-y-auto overflow-x-hidden"
    >
      <div className="items-center flex justify-between">
        <p className="font-bold text-2xl text-shadow-2xs text-white">
          New Tasks
        </p>
        <CirclePlus
          onClick={onAddClick}
          className="cursor-pointer hover:opacity-50"
        />
      </div>

      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        {tasks.map((task) => (
          <Task
            key={task.id}
            id={task.id}
            title={task.title}
            columnId={columnId}
            priority={"low"}
            description={"Test"}
          />
        ))}
      </SortableContext>
    </div>
  );
};

export default NewTasks;
