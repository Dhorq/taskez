import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";

import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";

import { useState } from "react";

import CompletedTasks from "../components/CompletedTasks";
import Delivery from "../components/Delivery";
import NewTasks from "../components/NewTasks";
import ReviewTasks from "../components/ReviewTasks";
import AddTask from "../components/AddTask";

type Task = {
  id: string;
  title: string;
};

type ColumnId = "new" | "review" | "delivery" | "completed";
type Columns = Record<ColumnId, Task[]>;

const Home = () => {
  const [openModal, setOpenModal] = useState(false);

  const handleAddTask = () => {
    setOpenModal(true);
  };

  const handleSubmitTask = (title: string) => {
    setColumns((prev) => ({
      ...prev,
      new: [
        ...prev.new,
        {
          id: crypto.randomUUID(),
          title,
        },
      ],
    }));
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const [columns, setColumns] = useState<Columns>({
    new: [{ id: "1", title: "Task 1" }],
    review: [],
    delivery: [],
    completed: [],
  });

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const from = event.active.data.current?.columnId as ColumnId;
    if (!from) return;

    const task = columns[from].find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveTask(null);
    if (!over) return;

    const from = active.data.current?.columnId as ColumnId;
    const to = over.data.current?.columnId as ColumnId;

    if (!from || !to) return;

    if (from === to) {
      setColumns((prev) => {
        const items = [...prev[from]];

        const oldIndex = items.findIndex((t) => t.id === active.id);
        const newIndex = items.findIndex((t) => t.id === over.id);

        const [moved] = items.splice(oldIndex, 1);
        items.splice(newIndex, 0, moved);

        return {
          ...prev,
          [from]: items,
        };
      });

      return;
    }

    setColumns((prev) => {
      const source = [...prev[from]];
      const target = [...prev[to]];

      const index = source.findIndex((t) => t.id === active.id);
      const [moved] = source.splice(index, 1);

      target.push(moved);

      return {
        ...prev,
        [from]: source,
        [to]: target,
      };
    });
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-4 gap-10">
          <NewTasks
            tasks={columns.new}
            columnId="new"
            onAddClick={handleAddTask}
          />
          <ReviewTasks tasks={columns.review} columnId="review" />
          <Delivery tasks={columns.delivery} columnId="delivery" />
          <CompletedTasks tasks={columns.completed} columnId="completed" />
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="bg-white/80 text-white p-3 h-50 rounded-lg shadow-2xl scale-105 cursor-grabbing select-none">
              {activeTask.title}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <AddTask
        open={openModal}
        onClose={() => setOpenModal(false)}
        onAdd={handleSubmitTask}
      />
    </>
  );
};

export default Home;
