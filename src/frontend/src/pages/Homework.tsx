import { Plus, X } from "lucide-react";
import { useState } from "react";

interface HW {
  id: number;
  class: string;
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  assignedDate: string;
}

const initialHW: HW[] = [
  {
    id: 1,
    class: "Class 10-A",
    subject: "Mathematics",
    title: "Trigonometry Practice",
    description: "Complete exercises 5.1 to 5.5 from NCERT textbook",
    dueDate: "20/03/2026",
    assignedDate: "15/03/2026",
  },
  {
    id: 2,
    class: "Class 7-B",
    subject: "Science",
    title: "Photosynthesis Notes",
    description:
      "Make notes on the process of photosynthesis and draw a diagram",
    dueDate: "18/03/2026",
    assignedDate: "15/03/2026",
  },
  {
    id: 3,
    class: "Class 5-A",
    subject: "English",
    title: "Essay Writing",
    description: "Write a 200-word essay on 'My Favourite Festival'",
    dueDate: "17/03/2026",
    assignedDate: "14/03/2026",
  },
  {
    id: 4,
    class: "Class 8-A",
    subject: "Social Science",
    title: "Map Work",
    description: "Mark all Indian states and capitals on the outline map",
    dueDate: "22/03/2026",
    assignedDate: "16/03/2026",
  },
];

export function Homework() {
  const [homework, setHomework] = useState<HW[]>(initialHW);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    class: "Class 10-A",
    subject: "",
    title: "",
    description: "",
    dueDate: "",
  });

  const handleAdd = () => {
    if (!form.title) return;
    const today = new Date().toLocaleDateString("en-IN");
    setHomework((prev) => [
      ...prev,
      { id: prev.length + 1, ...form, assignedDate: today },
    ]);
    setShowModal(false);
    setForm({
      class: "Class 10-A",
      subject: "",
      title: "",
      description: "",
      dueDate: "",
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-lg font-semibold">Homework</h2>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded"
        >
          <Plus size={14} /> Add Homework
        </button>
      </div>
      <div className="space-y-3">
        {homework.map((hw) => (
          <div
            key={hw.id}
            className="rounded-lg p-4"
            style={{ background: "#1a1f2e", border: "1px solid #374151" }}
          >
            <div className="flex items-start justify-between mb-1">
              <div>
                <h3 className="text-white text-sm font-medium">{hw.title}</h3>
                <p className="text-xs mt-0.5">
                  <span className="text-blue-400">{hw.class}</span>{" "}
                  <span className="text-gray-500">|</span>{" "}
                  <span className="text-purple-400">{hw.subject}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-xs">
                  Assigned: {hw.assignedDate}
                </p>
                <p className="text-yellow-400 text-xs">Due: {hw.dueDate}</p>
              </div>
            </div>
            <p className="text-gray-400 text-xs mt-2">{hw.description}</p>
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
              <h3 className="text-white font-semibold">Add Homework</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="hw-class"
                    className="text-gray-400 text-xs block mb-1"
                  >
                    Class
                  </label>
                  <select
                    id="hw-class"
                    value={form.class}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, class: e.target.value }))
                    }
                    className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none"
                  >
                    {[
                      "Class 1-A",
                      "Class 3-B",
                      "Class 5-A",
                      "Class 7-B",
                      "Class 8-A",
                      "Class 10-A",
                      "Class 12-A",
                    ].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="hw-subject"
                    className="text-gray-400 text-xs block mb-1"
                  >
                    Subject
                  </label>
                  <input
                    id="hw-subject"
                    value={form.subject}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, subject: e.target.value }))
                    }
                    className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none focus:border-green-500"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="hw-title"
                  className="text-gray-400 text-xs block mb-1"
                >
                  Title
                </label>
                <input
                  id="hw-title"
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label
                  htmlFor="hw-dueDate"
                  className="text-gray-400 text-xs block mb-1"
                >
                  Due Date
                </label>
                <input
                  id="hw-dueDate"
                  type="date"
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, dueDate: e.target.value }))
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label
                  htmlFor="hw-description"
                  className="text-gray-400 text-xs block mb-1"
                >
                  Description
                </label>
                <textarea
                  id="hw-description"
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  rows={3}
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
                Assign
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
