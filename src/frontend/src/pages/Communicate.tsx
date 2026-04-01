import { Plus, X } from "lucide-react";
import { useState } from "react";

interface Notice {
  id: number;
  title: string;
  message: string;
  target: string;
  date: string;
}

const initialNotices: Notice[] = [];

export function Communicate() {
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", message: "", target: "All" });

  const handleAdd = () => {
    if (!form.title || !form.message) return;
    const today = new Date().toLocaleDateString("en-IN");
    setNotices((prev) => [
      { id: prev.length + 1, ...form, date: today },
      ...prev,
    ]);
    setShowModal(false);
    setForm({ title: "", message: "", target: "All" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-lg font-semibold">Notice Board</h2>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded"
        >
          <Plus size={14} /> Add Notice
        </button>
      </div>
      <div className="space-y-3">
        {notices.map((n) => (
          <div
            key={n.id}
            className="rounded-lg p-4"
            style={{ background: "#1a1f2e", border: "1px solid #374151" }}
          >
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-white text-sm font-medium">{n.title}</h3>
              <div className="flex items-center gap-2">
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] ${n.target === "All" ? "bg-blue-900/50 text-blue-400" : n.target === "Students" ? "bg-green-900/50 text-green-400" : "bg-purple-900/50 text-purple-400"}`}
                >
                  {n.target}
                </span>
                <span className="text-gray-500 text-xs">{n.date}</span>
              </div>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">{n.message}</p>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div
            className="rounded-xl p-6 w-full max-w-md"
            style={{ background: "#1a1f2e", border: "1px solid #374151" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Add Notice</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="comm-title"
                  className="text-gray-400 text-xs block mb-1"
                >
                  Title
                </label>
                <input
                  id="comm-title"
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label
                  htmlFor="comm-target"
                  className="text-gray-400 text-xs block mb-1"
                >
                  Target Audience
                </label>
                <select
                  id="comm-target"
                  value={form.target}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, target: e.target.value }))
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none"
                >
                  {["All", "Students", "Staff", "Parents"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="comm-message"
                  className="text-gray-400 text-xs block mb-1"
                >
                  Message
                </label>
                <textarea
                  id="comm-message"
                  value={form.message}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, message: e.target.value }))
                  }
                  rows={4}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none focus:border-green-500 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-2 rounded"
              >
                Publish
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
