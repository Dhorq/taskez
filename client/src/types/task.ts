export type TaskStatus = "new" | "review" | "delivery" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export type Priority = TaskPriority;
export type Status = TaskStatus;

export type Task = {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
};

export type Columns = Record<TaskStatus, Task[]>;

export const COLUMN_LABELS: Record<TaskStatus, string> = {
  new: "New",
  review: "Review",
  delivery: "Delivery",
  completed: "Completed",
};

export const COLUMN_ORDER: TaskStatus[] = [
  "new",
  "review",
  "delivery",
  "completed",
];
