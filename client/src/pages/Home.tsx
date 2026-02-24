import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";

import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";

import { useEffect, useState } from "react";

import CompletedTasks from "../components/CompletedTasks";
import Delivery from "../components/Delivery";
import NewTasks from "../components/NewTasks";
import ReviewTasks from "../components/ReviewTasks";
import AddTask from "../components/AddTask";
import EditTask from "../components/EditTask";
import api from "../lib/axios";

type Task = {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
};

type ColumnId = "new" | "review" | "delivery" | "completed";
type Columns = Record<ColumnId, Task[]>;

const Home = () => {
  const [columns, setColumns] = useState<Columns>({
    new: [],
    review: [],
    delivery: [],
    completed: [],
  });
  const [openModal, setOpenModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [addTargetColumn, setAddTargetColumn] = useState<ColumnId>("new");

  // Load tasks from DB on mount
  useEffect(() => {
    api
      .get("/task")
      .then((res) => {
        const tasks: Array<{
          id: number;
          title: string;
          description: string | null;
          priority: string;
          status: string;
        }> = res.data.data;

        const cols: Columns = { new: [], review: [], delivery: [], completed: [] };

        for (const t of tasks) {
          const colId = t.status as ColumnId;
          if (colId in cols) {
            cols[colId].push({
              id: String(t.id),
              title: t.title,
              description: t.description ?? "",
              priority: (t.priority as Task["priority"]) ?? "low",
            });
          }
        }

        setColumns(cols);
      })
      .catch((err) => console.error("Failed to load tasks:", err));
  }, []);

  const handleAddTask = (targetColumn: ColumnId = "new") => {
    setAddTargetColumn(targetColumn);
    setOpenModal(true);
  };

  const handleSubmitTask = async (
    title: string,
    description: string,
    priority: "low" | "medium" | "high",
  ) => {
    try {
      const res = await api.post("/task/create", {
        title,
        description,
        priority,
        status: addTargetColumn,
      });

      const created = res.data.data;

      setColumns((prev) => ({
        ...prev,
        [addTargetColumn]: [
          ...prev[addTargetColumn],
          {
            id: String(created.id),
            title: created.title,
            description: created.description ?? "",
            priority: created.priority as Task["priority"],
          },
        ],
      }));
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setEditModal(true);
  };

  const handleSaveEdit = async (
    id: string,
    title: string,
    description: string,
    priority: "low" | "medium" | "high",
  ) => {
    try {
      await api.post(`/task/update/${id}`, { title, description, priority });

      setColumns((prev) => {
        const updated = { ...prev };
        for (const col of Object.keys(updated) as ColumnId[]) {
          updated[col] = updated[col].map((t) =>
            t.id === id ? { ...t, title, description, priority } : t,
          );
        }
        return updated;
      });
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    // Optimistic update
    setColumns((prev) => {
      const updated = { ...prev };
      for (const col of Object.keys(updated) as ColumnId[]) {
        updated[col] = updated[col].filter((t) => t.id !== id);
      }
      return updated;
    });

    try {
      await api.post(`/task/delete/${id}`);
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

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
        return { ...prev, [from]: items };
      });
      return;
    }

    // Optimistic column change
    setColumns((prev) => {
      const source = [...prev[from]];
      const target = [...prev[to]];
      const index = source.findIndex((t) => t.id === active.id);
      const [moved] = source.splice(index, 1);
      target.push(moved);
      return { ...prev, [from]: source, [to]: target };
    });

    // Sync status to DB in background
    api
      .post(`/task/update/${active.id}`, { status: to })
      .catch((err) => console.error("Failed to update task status:", err));
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
            onAddClick={() => handleAddTask("new")}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
          <ReviewTasks
            tasks={columns.review}
            columnId="review"
            onAddClick={() => handleAddTask("review")}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
          <Delivery
            tasks={columns.delivery}
            columnId="delivery"
            onAddClick={() => handleAddTask("delivery")}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
          <CompletedTasks
            tasks={columns.completed}
            columnId="completed"
            onAddClick={() => handleAddTask("completed")}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="bg-white/80 text-white p-3 min-h-28 rounded-lg shadow-2xl scale-105 cursor-grabbing select-none" />
          ) : null}
        </DragOverlay>
      </DndContext>

      <AddTask
        open={openModal}
        onClose={() => setOpenModal(false)}
        onAdd={handleSubmitTask}
      />

      <EditTask
        open={editModal}
        task={editingTask}
        onClose={() => {
          setEditModal(false);
          setEditingTask(null);
        }}
        onSave={handleSaveEdit}
      />
    </>
  );
};

export default Home;
