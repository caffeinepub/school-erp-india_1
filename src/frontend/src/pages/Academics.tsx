import { useState } from "react";

const classData = [
  {
    class: "Class 1",
    sections: ["A", "B"],
    students: 82,
    teacher: "Mrs. Rekha Sharma",
    subjects: ["English", "Hindi", "Mathematics", "EVS", "Drawing"],
  },
  {
    class: "Class 5",
    sections: ["A", "B", "C"],
    students: 95,
    teacher: "Mr. Rajiv Kumar",
    subjects: [
      "English",
      "Hindi",
      "Mathematics",
      "Science",
      "Social Science",
      "Computer",
    ],
  },
  {
    class: "Class 8",
    sections: ["A", "B"],
    students: 78,
    teacher: "Mrs. Anita Desai",
    subjects: [
      "English",
      "Hindi",
      "Mathematics",
      "Science",
      "Social Science",
      "Sanskrit",
      "Computer",
    ],
  },
  {
    class: "Class 10",
    sections: ["A", "B"],
    students: 68,
    teacher: "Mr. Vinod Mishra",
    subjects: ["English", "Hindi", "Mathematics", "Science", "Social Science"],
  },
  {
    class: "Class 12",
    sections: ["A (Science)", "B (Commerce)"],
    students: 55,
    teacher: "Dr. Priya Singh",
    subjects: [
      "English",
      "Physics",
      "Chemistry",
      "Mathematics",
      "Biology",
      "Accountancy",
    ],
  },
];

const timetable: Record<string, string[]> = {
  Monday: [
    "Mathematics",
    "English",
    "Science",
    "Hindi",
    "Social Science",
    "Computer",
  ],
  Tuesday: [
    "Hindi",
    "Mathematics",
    "English",
    "Science",
    "Drawing",
    "Social Science",
  ],
  Wednesday: [
    "Science",
    "Hindi",
    "Mathematics",
    "English",
    "Social Science",
    "Sanskrit",
  ],
  Thursday: [
    "English",
    "Science",
    "Hindi",
    "Mathematics",
    "Computer",
    "Physical Education",
  ],
  Friday: [
    "Social Science",
    "English",
    "Science",
    "Hindi",
    "Mathematics",
    "Value Education",
  ],
  Saturday: [
    "Mathematics",
    "Hindi",
    "English",
    "Science",
    "Drawing",
    "Activity",
  ],
};

const periods = [
  "8:00-8:45",
  "8:45-9:30",
  "9:45-10:30",
  "10:30-11:15",
  "11:30-12:15",
  "12:15-1:00",
];

export function Academics() {
  const [tab, setTab] = useState<"classes" | "timetable">("classes");
  const [selectedClass, setSelectedClass] = useState("Class 10");

  return (
    <div>
      <h2 className="text-white text-lg font-semibold mb-4">Academics</h2>
      <div className="flex gap-1 mb-4">
        {(["classes", "timetable"] as const).map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded text-xs font-medium capitalize transition ${tab === t ? "bg-green-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}
          >
            {t === "classes" ? "Classes & Subjects" : "Class Timetable"}
          </button>
        ))}
      </div>

      {tab === "classes" && (
        <div className="space-y-3">
          {classData.map((c) => (
            <div
              key={c.class}
              className="rounded-lg p-4"
              style={{ background: "#1a1f2e", border: "1px solid #374151" }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-white text-sm font-medium">{c.class}</h3>
                  <p className="text-gray-400 text-xs">
                    Class Teacher: {c.teacher}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-blue-400 text-xs">{c.students} students</p>
                  <p className="text-gray-500 text-xs">
                    Sections: {c.sections.join(", ")}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {c.subjects.map((s) => (
                  <span
                    key={s}
                    className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "timetable" && (
        <div>
          <div className="flex items-center gap-3 mb-3">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none"
            >
              {classData.map((c) => (
                <option key={c.class}>{c.class}</option>
              ))}
            </select>
          </div>
          <div className="rounded-lg overflow-hidden border border-gray-700">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: "#1a1f2e" }}>
                  <th className="text-left px-3 py-2 text-gray-400">Day</th>
                  {periods.map((p) => (
                    <th key={p} className="text-left px-2 py-2 text-gray-400">
                      {p}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(timetable).map(([day, subjects], i) => (
                  <tr
                    key={day}
                    style={{ background: i % 2 === 0 ? "#111827" : "#0f1117" }}
                  >
                    <td className="px-3 py-2 text-white font-medium">{day}</td>
                    {subjects.map((s) => (
                      <td key={`${day}-${s}`} className="px-2 py-2">
                        <span className="bg-gray-700/50 text-gray-300 text-[10px] px-1.5 py-0.5 rounded">
                          {s}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
