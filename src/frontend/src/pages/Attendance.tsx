import { useState } from "react";

const classStudents: Record<string, string[]> = {};

const staff: { id: number; name: string; status: string }[] = [];

type AttStatus = "Present" | "Absent" | "Late";

export function Attendance() {
  const [tab, setTab] = useState<"student" | "staff">("student");
  const [selectedClass, setSelectedClass] = useState("Class 5-A");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendance, setAttendance] = useState<Record<string, AttStatus>>({});
  const [saved, setSaved] = useState(false);

  const studentList = classStudents[selectedClass] || [];

  const setStatus = (name: string, status: AttStatus) => {
    setAttendance((prev) => ({ ...prev, [name]: status }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const presentCount = Object.values(attendance).filter(
    (s) => s === "Present",
  ).length;
  const absentCount = Object.values(attendance).filter(
    (s) => s === "Absent",
  ).length;

  return (
    <div>
      <h2 className="text-white text-lg font-semibold mb-4">Attendance</h2>
      <div className="flex gap-1 mb-4">
        {(["student", "staff"] as const).map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded text-xs font-medium capitalize transition ${tab === t ? "bg-green-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}
          >
            {t === "student" ? "Student Attendance" : "Staff Attendance"}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div>
          <label
            htmlFor="att-date"
            className="text-gray-400 text-xs block mb-1"
          >
            Date
          </label>
          <input
            id="att-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none"
          />
        </div>
        {tab === "student" && (
          <div>
            <label
              htmlFor="att-class"
              className="text-gray-400 text-xs block mb-1"
            >
              Class-Section
            </label>
            <select
              id="att-class"
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setAttendance({});
              }}
              className="bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none"
            >
              {Object.keys(classStudents).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        )}
        <div className="flex gap-3 ml-4">
          <span className="text-green-400 text-xs">
            Present: {presentCount}
          </span>
          <span className="text-red-400 text-xs">Absent: {absentCount}</span>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden border border-gray-700">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ background: "#1a1f2e" }}>
              <th className="text-left px-3 py-2 text-gray-400">#</th>
              <th className="text-left px-3 py-2 text-gray-400">Name</th>
              <th className="text-left px-3 py-2 text-gray-400">Present</th>
              <th className="text-left px-3 py-2 text-gray-400">Absent</th>
              <th className="text-left px-3 py-2 text-gray-400">Late</th>
            </tr>
          </thead>
          <tbody>
            {(tab === "student" ? studentList : staff).map((name, i) => (
              <tr
                key={name}
                style={{ background: i % 2 === 0 ? "#111827" : "#0f1117" }}
              >
                <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                <td className="px-3 py-2 text-white">{name}</td>
                {(["Present", "Absent", "Late"] as AttStatus[]).map(
                  (status) => (
                    <td key={status} className="px-3 py-2">
                      <input
                        type="radio"
                        name={name}
                        value={status}
                        checked={attendance[name] === status}
                        onChange={() => setStatus(name, status)}
                        className="accent-green-500"
                      />
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={handleSave}
        className="mt-3 bg-green-600 hover:bg-green-700 text-white text-xs px-6 py-2 rounded"
      >
        {saved ? "✓ Attendance Saved" : "Save Attendance"}
      </button>
    </div>
  );
}
