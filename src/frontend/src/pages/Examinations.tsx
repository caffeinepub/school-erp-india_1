import { useState } from "react";

const scheduleData: {
  id: number;
  group: string;
  subject: string;
  className: string;
  date: string;
  maxMarks: number;
}[] = [];

const resultsData: {
  student: string;
  math: number;
  science: number;
  english: number;
  hindi: number;
  social: number;
}[] = [];

function getGrade(pct: number) {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B+";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C";
  return "F";
}

export function Examinations() {
  const [tab, setTab] = useState<"schedule" | "results" | "marksheet">(
    "schedule",
  );

  return (
    <div>
      <h2 className="text-white text-lg font-semibold mb-4">Examinations</h2>
      <div className="flex gap-1 mb-4">
        {(["schedule", "results", "marksheet"] as const).map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded text-xs font-medium capitalize transition ${tab === t ? "bg-green-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}
          >
            {t === "schedule"
              ? "Exam Schedule"
              : t === "results"
                ? "Results"
                : "Print Marksheet"}
          </button>
        ))}
      </div>

      {tab === "schedule" && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <p className="text-gray-400 text-xs">Mid-Term 2026 - Class 10-A</p>
          </div>
          <div className="rounded-lg overflow-hidden border border-gray-700">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: "#1a1f2e" }}>
                  {["Exam Group", "Subject", "Class", "Date", "Max Marks"].map(
                    (h) => (
                      <th key={h} className="text-left px-3 py-2 text-gray-400">
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {scheduleData.map((e, i) => (
                  <tr
                    key={e.id}
                    style={{ background: i % 2 === 0 ? "#111827" : "#0f1117" }}
                  >
                    <td className="px-3 py-2 text-blue-400">{e.group}</td>
                    <td className="px-3 py-2 text-white">{e.subject}</td>
                    <td className="px-3 py-2 text-gray-300">{e.className}</td>
                    <td className="px-3 py-2 text-gray-300">{e.date}</td>
                    <td className="px-3 py-2 text-gray-300">{e.maxMarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "results" && (
        <div className="rounded-lg overflow-hidden border border-gray-700">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: "#1a1f2e" }}>
                {[
                  "Student",
                  "Math",
                  "Science",
                  "English",
                  "Hindi",
                  "Social",
                  "Total",
                  "%",
                  "Grade",
                ].map((h) => (
                  <th key={h} className="text-left px-3 py-2 text-gray-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {resultsData.map((r, i) => {
                const total =
                  r.math + r.science + r.english + r.hindi + r.social;
                const pct = (total / 500) * 100;
                return (
                  <tr
                    key={r.student}
                    style={{ background: i % 2 === 0 ? "#111827" : "#0f1117" }}
                  >
                    <td className="px-3 py-2 text-white">{r.student}</td>
                    <td className="px-3 py-2 text-gray-300">{r.math}</td>
                    <td className="px-3 py-2 text-gray-300">{r.science}</td>
                    <td className="px-3 py-2 text-gray-300">{r.english}</td>
                    <td className="px-3 py-2 text-gray-300">{r.hindi}</td>
                    <td className="px-3 py-2 text-gray-300">{r.social}</td>
                    <td className="px-3 py-2 text-white font-medium">
                      {total}/500
                    </td>
                    <td className="px-3 py-2 text-yellow-400">
                      {pct.toFixed(1)}%
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${pct >= 60 ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"}`}
                      >
                        {getGrade(pct)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === "marksheet" && (
        <div className="max-w-2xl">
          <div
            className="rounded-lg p-6 border border-gray-700"
            style={{ background: "#1a1f2e" }}
          >
            <div className="text-center border-b border-gray-600 pb-4 mb-4">
              <h3 className="text-yellow-400 text-xl font-bold">PSM SCHOOL</h3>
              <p className="text-gray-300 text-sm">
                Progress Report Card - Session 2025-26
              </p>
              <p className="text-gray-400 text-xs">Mid-Term Examination</p>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
              <div>
                <span className="text-gray-400">Student Name: </span>
                <span className="text-white">Rohit Kumar</span>
              </div>
              <div>
                <span className="text-gray-400">Class: </span>
                <span className="text-white">10 - A</span>
              </div>
              <div>
                <span className="text-gray-400">Roll No: </span>
                <span className="text-white">03</span>
              </div>
              <div>
                <span className="text-gray-400">Admission No: </span>
                <span className="text-white">ADM-1003</span>
              </div>
            </div>
            <table className="w-full text-xs mb-4">
              <thead>
                <tr className="border-b border-gray-600">
                  {["Subject", "Max Marks", "Marks Obtained", "Grade"].map(
                    (h) => (
                      <th key={h} className="text-left py-1 text-gray-400">
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Mathematics", 100, 78],
                  ["Science", 100, 82],
                  ["English", 100, 74],
                  ["Hindi", 100, 85],
                  ["Social Science", 100, 79],
                ].map(([s, m, o]) => (
                  <tr key={String(s)} className="border-b border-gray-800">
                    <td className="py-1.5 text-white">{s}</td>
                    <td className="py-1.5 text-gray-300">{m}</td>
                    <td className="py-1.5 text-green-400 font-medium">{o}</td>
                    <td className="py-1.5">
                      <span className="text-blue-400">
                        {getGrade(Number(o))}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-gray-400 text-xs">Total: </span>
                <span className="text-white font-bold">398/500</span>
              </div>
              <div>
                <span className="text-gray-400 text-xs">Percentage: </span>
                <span className="text-yellow-400 font-bold">79.6%</span>
              </div>
              <div>
                <span className="text-gray-400 text-xs">Grade: </span>
                <span className="text-green-400 font-bold text-lg">B+</span>
              </div>
              <div>
                <span className="text-gray-400 text-xs">Result: </span>
                <span className="text-green-400 font-bold">PASS</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 rounded"
            >
              Print Marksheet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
