import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import Task from "./Task";

type TaskType = {
  id: string;
  title: string;
};

type Props = {
  tasks: TaskType[];
  columnId: string;
};

const CompletedTasks = ({ tasks, columnId }: Props) => {
  const { setNodeRef } = useDroppable({
    id: columnId,
    data: { columnId },
  });

  return (
    <div
      ref={setNodeRef}
      className="bg-white/5 shadow-xl rounded-sm h-[83vh] p-3 flex flex-col gap-2 overflow-y-auto overflow-x-hidden"
    >
      <p className="font-bold text-2xl text-shadow-2xs text-white">
        Completed Tasks
      </p>

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

export default CompletedTasks;
