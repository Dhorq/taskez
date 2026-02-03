import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onAdd: (title: string) => void;
};

const AddTask = ({ open, onClose, onAdd }: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");

  if (!open) return null;

  const handleSubmit = () => {
    if (!title.trim()) return;

    onAdd(title);
    setTitle("");
    onClose();
  };

  if (!open) return null;

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
          <h2 className="text-xl font-bold">Add New Task</h2>

          <div className="flex gap-6 items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="priority"
                value="low"
                checked={priority === "low"}
                onChange={(e) => setPriority(e.target.value)}
              />
              Low
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="priority"
                value="medium"
                checked={priority === "medium"}
                onChange={(e) => setPriority(e.target.value)}
              />
              Medium
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="priority"
                value="high"
                checked={priority === "high"}
                onChange={(e) => setPriority(e.target.value)}
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
            className="border rounded-lg p-2 outline-none focus:ring-2 focus:ring-black  h-32 resize-none"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 cursor-pointer hover:bg-red-500"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-lg bg-black text-white cursor-pointer hover:bg-green-400"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddTask;
