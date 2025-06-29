import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  getChecklist,
  addChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
} from "../lib/firestore";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

export default function Checklist() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (!user) return;
    getChecklist(user.uid)
      .then(setItems)
      .catch(() => toast.error("Failed to load checklist"));
  }, [user]);

  // Add new checklist items
  const handleAdd = async () => {
    const trimmed = newItem.trim();
    if (!trimmed) return;

    const item = {
      text: trimmed,
      dueDate: dueDate || null,
    };

    try {
      const savedItem = await addChecklistItem(user.uid, item);
      setItems((prev) => [...prev, savedItem]);
      toast.success("Item added");
      setNewItem("");
      setDueDate("");
    } catch {
      toast.error("Failed to save");
    }
  };

  // Toggle done
  const handleToggleDone = async (item) => {
    const updated = { ...item, done: !item.done };
    try {
      await updateChecklistItem(user.uid, item.id, { done: updated.done });
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, done: updated.done } : i))
      );
      toast.success("Checklist updated");
    } catch {
      toast.error("Failed to update");
    }
  };

  // Delete items
  const handleDelete = async (itemId) => {
    try {
      await deleteChecklistItem(user.uid, itemId);
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      toast.success("Item deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const completedCount = items.filter((i) => i.done).length;
  const progress =
    items.length > 0
      ? Math.round((completedCount / items.length) * 100)
      : 0;

  return (
    <div className="max-w-md mx-auto space-y-6 bg-white dark:bg-gray-900 p-4 w-full overflow-y-auto">
      <h2 className="text-xl font-heading font-bold text-center">
        📝 PR Checklist
      </h2>

      {/* Progress Bar */}
      <div className="font-body">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
          <span>
            {completedCount} of {items.length} completed
          </span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-500 h-2 rounded">
          <div
            className="bg-[#26374a] h-2 rounded transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Add New Item */}
      <div className="space-y-2">
        <input
          className="w-full border p-2 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add new task"
        />

        <input
          type="date"
          className="w-full border p-2 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <button
          onClick={handleAdd}
          className="bg-[#26374a] hover:opacity-90 text-white px-4 py-2 w-fit"
        >
          Add
        </button>
      </div>

      {/* Checklist Items */}
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex justify-between items-start border p-3 bg-white dark:bg-gray-800"
          >
            <div className="flex gap-3 items-start">
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => handleToggleDone(item)}
                className="mt-1"
              />
              <div>
                <p
                  className={`text-sm ${
                    item.done ? "line-through text-gray-400" : ""
                  }`}
                >
                  {item.text}
                </p>
                {item.dueDate && (
                  <p className="text-xs text-gray-500">
                    Due: {new Date(item.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => handleDelete(item.id)}
              className="p-1 hover:bg-[#a62a1e]/10 text-[#a62a1e]"
              aria-label="Delete"
            >
              <Trash2 size={18} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
