import { useEffect, useState } from "react";

type Task = {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
};

type Props = {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onSave: (id: string, title: string, description: string, priority: "low" | "medium" | "high") => void;
};

const EditTask = ({ open, task, onClose, onSave }: Props) => {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [priority, setPriority] = useState<"low" | "medium" | "high">(
    task?.priority ?? "low",
  );

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
    }
  }, [task]);

  if (!open || !task) return null;

  const handleSave = () => {
    if (!title.trim()) return;
    onSave(task.id, title, description, priority);
    onClose();
  };

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      />

      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          onClick={(e) => e.stopPropagation()}
          className="
            bg-white w-96 rounded-2xl shadow-2xl p-6
            flex flex-col gap-4
            animate-in fade-in zoom-in-95 text-black
          "
        >
          <h2 className="text-xl font-bold">Edit Task</h2>

          <div className="flex gap-6 items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="edit-priority"
                value="low"
                checked={priority === "low"}
                onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
              />
              Low
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="edit-priority"
                value="medium"
                checked={priority === "medium"}
                onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
              />
              Medium
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="edit-priority"
                value="high"
                checked={priority === "high"}
                onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
              />
              High
            </label>
          </div>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="border rounded-lg p-2 outline-none focus:ring-2 focus:ring-black"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="border rounded-lg p-2 outline-none focus:ring-2 focus:ring-black h-32 resize-none"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 cursor-pointer hover:bg-red-500"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-black text-white cursor-pointer hover:bg-blue-500"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditTask;
