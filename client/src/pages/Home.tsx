import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  CircleDot,
  Eye,
  Truck,
  CheckCircle2,
  Search,
  X,
  Plus,
  AlertTriangle,
  Inbox,
  ClipboardList,
} from "lucide-react";

import TaskColumn from "../components/TaskColumn";
import AddTask from "../components/AddTask";
import EditTask from "../components/EditTask";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { PriorityBadge } from "../components/ui/Badges";
import { useToast } from "../components/ui/Toast";
import type { TaskFormValues } from "../components/formConstants";
import api from "../lib/axios";
import {
  COLUMN_LABELS,
  COLUMN_ORDER,
  type Columns,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from "../types/task";

const COLUMN_ICONS: Record<TaskStatus, typeof CircleDot> = {
  new: CircleDot,
  review: Eye,
  delivery: Truck,
  completed: CheckCircle2,
};

const COLUMN_ICON_COLORS: Record<TaskStatus, string> = {
  new: "text-primary",
  review: "text-amber-600",
  delivery: "text-sky-600",
  completed: "text-emerald-600",
};

const FILTERS: { id: TaskPriority | "all"; label: string }[] = [
  { id: "all", label: "All priorities" },
  { id: "low", label: "Low" },
  { id: "medium", label: "Medium" },
  { id: "high", label: "High" },
];

const Home = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const stageParam = searchParams.get("stage") as TaskStatus | null;
  const activeStage: TaskStatus | "all" =
    stageParam && COLUMN_ORDER.includes(stageParam) ? stageParam : "all";

  const setStage = (stage: TaskStatus | "all") => {
    setSearchParams(stage === "all" ? {} : { stage }, { replace: true });
  };

  const [columns, setColumns] = useState<Columns>({
    new: [],
    review: [],
    delivery: [],
    completed: [],
  });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [query, setQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "all">(
    "all",
  );

  const [addOpen, setAddOpen] = useState(false);
  const [addStatus, setAddStatus] = useState<TaskStatus>("new");
  const [saving, setSaving] = useState(false);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const lastFocusedTask = useRef<Task | null>(null);

  const loadTasks = async (silent = false) => {
    if (!silent) {
      setLoading(true);
      setLoadError(false);
    }
    try {
      const res = await api.get("/task");
      const tasks: Array<{
        id: number;
        title: string;
        description: string | null;
        priority: string;
        status: string;
      }> = res.data.data;

      const cols: Columns = { new: [], review: [], delivery: [], completed: [] };
      for (const t of tasks) {
        const colId = t.status as TaskStatus;
        if (colId in cols) {
          cols[colId].push({
            id: String(t.id),
            title: t.title,
            description: t.description ?? "",
            priority: (t.priority as Task["priority"]) ?? "low",
            status: colId,
          });
        }
      }
      setColumns(cols);
    } catch (err) {
      console.error("Failed to load tasks:", err);
      if (!silent) setLoadError(true);
      else toast("error", "Couldn't refresh tasks. Showing saved state.");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    void loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard shortcut: "n" opens quick add (ignored fields/modals)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        e.key.toLowerCase() === "n" &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        target.tagName !== "INPUT" &&
        target.tagName !== "TEXTAREA" &&
        target.tagName !== "SELECT"
      ) {
        e.preventDefault();
        setAddStatus(activeStage === "all" ? "new" : activeStage);
        setAddOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeStage]);

  /* ---------- Filtering ---------- */

  const visibleColumns = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered: Columns = { new: [], review: [], delivery: [], completed: [] };
    for (const col of COLUMN_ORDER) {
      const tasks =
        activeStage === "all" ? columns[col] : col === activeStage ? columns[col] : [];
      filtered[col] = tasks.filter(
        (t) =>
          (priorityFilter === "all" || t.priority === priorityFilter) &&
          (!q ||
            t.title.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q)),
      );
    }
    return filtered;
  }, [columns, query, priorityFilter, activeStage]);

  const stats = useMemo(() => {
    const all = COLUMN_ORDER.flatMap((c) => columns[c]);
    return {
      total: all.length,
      active: all.filter((t) => t.status !== "completed").length,
      highPriority: all.filter(
        (t) => t.priority === "high" && t.status !== "completed",
      ).length,
      completed: all.filter((t) => t.status === "completed").length,
    };
  }, [columns]);

  const isFiltering = query.trim() !== "" || priorityFilter !== "all";

  /* ---------- Task actions ---------- */

  const handleSubmitTask = async (values: TaskFormValues) => {
    setSaving(true);
    try {
      const res = await api.post("/task/create", {
        title: values.title,
        description: values.description,
        priority: values.priority,
        status: values.status,
      });
      const created = res.data.data;
      const newTask: Task = {
        id: String(created.id),
        title: created.title,
        description: created.description ?? "",
        priority: created.priority as Task["priority"],
        status: values.status,
      };
      setColumns((prev) => ({
        ...prev,
        [values.status]: [...prev[values.status], newTask],
      }));
      toast("success", "Task created.");
      setAddOpen(false);
      return true;
    } catch (err) {
      console.error("Failed to create task:", err);
      toast("error", "Couldn't create the task. Please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleOpenEdit = (task: Task) => {
    lastFocusedTask.current = task;
    setEditingTask(task);
    setEditOpen(true);
  };

  const handleSaveEdit = async (
    values: TaskFormValues,
  ) => {
    if (!editingTask) return false;
    setSaving(true);
    // Optimistic update, rolled back if the API fails.
    const previous = columns;
    const next: Task = { ...editingTask, ...values };
    setColumns((prev) => {
      const updated: Columns = { ...prev };
      for (const col of COLUMN_ORDER) {
        const list = updated[col].filter((t) => t.id !== next.id);
        if (col === next.status) list.push(next);
        updated[col] = list;
      }
      return updated;
    });
    setEditOpen(false);
    setEditingTask(null);
    try {
      await api.post(`/task/update/${next.id}`, {
        title: values.title,
        description: values.description,
        priority: values.priority,
        status: values.status,
      });
      toast("success", "Task updated.");
      return true;
    } catch (err) {
      console.error("Failed to update task:", err);
      setColumns(previous);
      setEditingTask(next);
      setEditOpen(true);
      toast("error", "Couldn't save your changes. The task was restored.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleRequestDelete = (task: Task) => {
    lastFocusedTask.current = task;
    setDeletingTask(task);
  };

  const handleDeleteTask = async () => {
    if (!deletingTask) return;
    setDeleteLoading(true);
    const snapshot = columns;
    const id = deletingTask.id;
    // Optimistic removal with rollback on failure.
    setColumns((prev) => {
      const updated: Columns = { ...prev };
      for (const col of COLUMN_ORDER) {
        updated[col] = updated[col].filter((t) => t.id !== id);
      }
      return updated;
    });
    setDeletingTask(null);
    try {
      await api.post(`/task/delete/${id}`);
      toast("success", "Task deleted.");
    } catch (err) {
      console.error("Failed to delete task:", err);
      setColumns(snapshot);
      toast("error", "Couldn't delete the task. It was restored.");
    } finally {
      setDeleteLoading(false);
    }
  };

  /* ---------- Drag & drop ---------- */

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    for (const col of COLUMN_ORDER) {
      const task = columns[col].find((t) => t.id === event.active.id);
      if (task) {
        setActiveTask(task);
        return;
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const from = active.data.current?.columnId as TaskStatus;
    const to = over.data.current?.columnId as TaskStatus;
    if (!from || !to) return;

    const sameColumn = from === to;
    if (sameColumn) {
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

    const movedTask = columns[from].find((t) => t.id === active.id);
    if (!movedTask) return;
    const snapshot = columns;

    // Optimistic move
    setColumns((prev) => {
      const source = [...prev[from]];
      const target = [...prev[to]];
      const index = source.findIndex((t) => t.id === active.id);
      if (index !== -1) {
        const [task] = source.splice(index, 1);
        target.push({ ...task, status: to });
      }
      return { ...prev, [from]: source, [to]: target };
    });

    // Sync status to DB; restore on failure
    api
      .post(`/task/update/${String(active.id)}`, { status: to })
      .then(() => {
        toast("success", `Moved to ${COLUMN_LABELS[to]}.`);
      })
      .catch((err) => {
        console.error("Failed to update task status:", err);
        setColumns(snapshot);
        toast("error", "Couldn't move the task. It was restored.");
      });
  };

  /* ---------- Derived rendering ---------- */

  const filteredOut =
    isFiltering && COLUMN_ORDER.every((c) => visibleColumns[c].length === 0);

  return (
    <div className="flex flex-col gap-5">
      {/* Page heading */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-ink">
            {activeStage === "all" ? "Task board" : `${COLUMN_LABELS[activeStage]} tasks`}
          </h1>
          <p className="mt-0.5 text-sm text-ink-muted">
            {activeStage === "all"
              ? "Drag tasks across stages as work progresses."
              : `Viewing only the ${COLUMN_LABELS[activeStage]} stage.`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setAddStatus(activeStage === "all" ? "new" : activeStage);
            setAddOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2.5 text-sm font-medium text-white shadow-card hover:bg-primary-hover active:scale-[0.98] transition-[colors,transform]"
        >
          <Plus className="size-4" aria-hidden="true" />
          Add task
          <kbd className="ml-1 hidden rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold sm:block">
            N
          </kbd>
        </button>
      </div>

      {/* Stat strip (real data) */}
      {!loading && !loadError && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            icon={<ClipboardList className="size-4 text-primary" />}
            label="Total tasks"
            value={stats.total}
          />
          <StatCard
            icon={<CircleDot className="size-4 text-amber-600" />}
            label="In progress"
            value={stats.active}
          />
          <StatCard
            icon={<AlertTriangle className="size-4 text-rose-600" />}
            label="High priority"
            value={stats.highPriority}
          />
          <StatCard
            icon={<CheckCircle2 className="size-4 text-emerald-600" />}
            label="Completed"
            value={stats.completed}
          />
        </div>
      )}

      {/* Stage chips (mobile navigation for the board) */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hidden lg:hidden">
        <StageChip label="All stages" active={activeStage === "all"} onClick={() => setStage("all")} />
        {COLUMN_ORDER.map((c) => (
          <StageChip
            key={c}
            label={COLUMN_LABELS[c]}
            count={columns[c].length}
            active={activeStage === c}
            onClick={() => setStage(c)}
          />
        ))}
      </div>

      {/* Toolbar: search + priority filter */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-64">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks…"
            aria-label="Search tasks"
            className="w-full rounded-xl border border-line bg-surface py-2.5 pl-9 pr-9 text-sm text-ink placeholder:text-ink-muted/80 shadow-card focus:border-primary"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-ink-muted hover:text-ink"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div
          role="radiogroup"
          aria-label="Filter by priority"
          className="flex gap-1 rounded-xl border border-line bg-surface p-1 shadow-card"
        >
          {FILTERS.map((f) => {
            const active = priorityFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setPriorityFilter(f.id)}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "bg-primary-soft text-primary"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {isFiltering && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setPriorityFilter("all");
            }}
            className="text-xs font-medium text-primary hover:underline"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <BoardSkeleton stage={activeStage} />
      ) : loadError ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface p-12 text-center shadow-card">
          <span className="flex size-11 items-center justify-center rounded-full bg-danger-soft text-danger">
            <AlertTriangle className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-ink">
              Couldn't load your tasks
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Check your connection and try again.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadTasks()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
          >
            Retry
          </button>
        </div>
      ) : stats.total === 0 ? (
        <EmptyBoard onAdd={() => void setAddOpen(true)} />
      ) : filteredOut ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-line bg-surface p-12 text-center">
          <Search className="size-6 text-ink-muted" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-ink">No matching tasks</h2>
          <p className="text-sm text-ink-muted">
            Try a different search term or clear your filters.
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div
            className={`grid gap-4 ${
              activeStage === "all"
                ? "sm:grid-cols-2 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {COLUMN_ORDER.map((col) =>
              activeStage === "all" || activeStage === col ? (
                <TaskColumn
                  key={col}
                  columnId={col}
                  tasks={visibleColumns[col]}
                  icon={COLUMN_ICONS[col]}
                  iconColor={COLUMN_ICON_COLORS[col]}
                  onAddClick={() => {
                    setAddStatus(col);
                    setAddOpen(true);
                  }}
                  onEdit={handleOpenEdit}
                  onDelete={handleRequestDelete}
                />
              ) : null,
            )}
          </div>

          <DragOverlay dropAnimation={{ duration: 180, easing: "ease" }}>
            {activeTask ? (
              <div className="w-full max-w-xs rotate-1 scale-[1.03] cursor-grabbing opacity-95">
                <div className="rounded-xl border border-primary/30 bg-surface p-3.5 shadow-overlay">
                  <PriorityBadge priority={activeTask.priority} />
                  <h3 className="mt-1.5 text-sm font-medium text-ink">
                    {activeTask.title}
                  </h3>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Modals */}
      <AddTask
        open={addOpen}
        targetStatus={addStatus}
        loading={saving}
        onClose={() => setAddOpen(false)}
        onSubmit={handleSubmitTask}
      />

      <EditTask
        open={editOpen}
        task={editingTask}
        loading={saving}
        onClose={() => {
          setEditOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveEdit}
      />

      <ConfirmDialog
        open={deletingTask !== null}
        message={
          deletingTask
            ? `"${deletingTask.title}" will be permanently deleted. This can't be undone.`
            : ""
        }
        loading={deleteLoading}
        onCancel={() => setDeletingTask(null)}
        onConfirm={() => void handleDeleteTask()}
      />
    </div>
  );
};

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 shadow-card">
      <span className="flex size-9 items-center justify-center rounded-full bg-canvas">
        {icon}
      </span>
      <div>
        <p className="text-lg font-semibold leading-none text-ink">{value}</p>
        <p className="mt-1 text-xs text-ink-muted">{label}</p>
      </div>
    </div>
  );
}

function StageChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "border-primary/30 bg-primary-soft text-primary"
          : "border-line bg-surface text-ink-secondary hover:border-ink-muted/40"
      }`}
    >
      {label}
      {typeof count === "number" && (
        <span className="rounded-full bg-canvas px-1.5 text-[10px] text-ink-muted">
          {count}
        </span>
      )}
    </button>
  );
}

function BoardSkeleton({ stage }: { stage: TaskStatus | "all" }) {
  const cols = stage === "all" ? 4 : 1;
  return (
    <div
      aria-hidden="true"
      className={`grid gap-4 ${stage === "all" ? "sm:grid-cols-2 xl:grid-cols-4" : "grid-cols-1"}`}
    >
      {Array.from({ length: cols }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-2.5 rounded-2xl border border-line bg-canvas/60 p-4"
        >
          <div className="h-5 w-24 animate-pulse rounded-md bg-line" />
          {Array.from({ length: 3 }).map((_, j) => (
            <div key={j} className="h-24 animate-pulse rounded-xl bg-surface shadow-card" />
          ))}
        </div>
      ))}
    </div>
  );
}

function EmptyBoard({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line bg-surface p-14 text-center">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
        <Inbox className="size-5" aria-hidden="true" />
      </span>
      <div>
        <h2 className="text-base font-semibold text-ink">
          Your board is empty
        </h2>
        <p className="mt-1 max-w-sm text-sm text-ink-muted">
          Create your first task to start organizing work. You can drag it
          between stages as it moves forward.
        </p>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="mt-1 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
      >
        <Plus className="size-4" aria-hidden="true" />
        Create your first task
      </button>
    </div>
  );
}

export default Home;
