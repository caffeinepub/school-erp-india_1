import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BookOpen,
  GripVertical,
  Plus,
  Printer,
  RefreshCcw,
  Save,
  Shuffle,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TeacherAssignment {
  id: string;
  teacherName: string;
  className: string;
  subject: string;
}

interface SavedTimetable {
  id: string;
  className: string;
  days: string[];
  periods: number;
  periodStart: string;
  periodDuration: number;
  cells: Record<string, { teacher: string; subject: string }>;
  savedAt: string;
}

interface DragData {
  source: "panel" | "cell";
  teacher: string;
  subject: string;
  cellKey?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ALL_CLASSES = [
  "Nursery",
  "LKG",
  "UKG",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
];

const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const SUBJECT_COLORS: Record<number, string> = {
  0: "bg-indigo-600/30 border-indigo-500/50 text-indigo-200",
  1: "bg-violet-600/30 border-violet-500/50 text-violet-200",
  2: "bg-cyan-600/30 border-cyan-500/50 text-cyan-200",
  3: "bg-emerald-600/30 border-emerald-500/50 text-emerald-200",
  4: "bg-amber-600/30 border-amber-500/50 text-amber-200",
  5: "bg-rose-600/30 border-rose-500/50 text-rose-200",
  6: "bg-sky-600/30 border-sky-500/50 text-sky-200",
  7: "bg-teal-600/30 border-teal-500/50 text-teal-200",
};

// ─── Helper: period timings ───────────────────────────────────────────────────

function calcPeriodTimes(
  startTime: string,
  durationMins: number,
  count: number,
): { from: string; to: string }[] {
  const result: { from: string; to: string }[] = [];
  const [h, m] = startTime.split(":").map(Number);
  let total = h * 60 + m;
  for (let i = 0; i < count; i++) {
    const from = `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
    total += durationMins;
    const to = `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
    result.push({ from, to });
  }
  return result;
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// ─── Sub-component: Assignment Row ───────────────────────────────────────────

interface AssignmentRowProps {
  row: TeacherAssignment;
  teacherSuggestions: string[];
  subjectSuggestions: string[];
  onChange: (id: string, field: keyof TeacherAssignment, value: string) => void;
  onRemove: (id: string) => void;
}

function AssignmentRow({
  row,
  teacherSuggestions,
  subjectSuggestions,
  onChange,
  onRemove,
}: AssignmentRowProps) {
  const [teacherInput, setTeacherInput] = useState(row.teacherName);
  const [subjectInput, setSubjectInput] = useState(row.subject);
  const [teacherSugOpen, setTeacherSugOpen] = useState(false);
  const [subjectSugOpen, setSubjectSugOpen] = useState(false);

  const teacherId = `teacher-input-${row.id}`;
  const subjectId = `subject-input-${row.id}`;

  const filteredTeachers = teacherSuggestions.filter(
    (t) =>
      teacherInput.length > 0 &&
      t.toLowerCase().includes(teacherInput.toLowerCase()),
  );
  const filteredSubjects = subjectSuggestions.filter(
    (s) =>
      subjectInput.length > 0 &&
      s.toLowerCase().includes(subjectInput.toLowerCase()),
  );

  return (
    <div className="flex items-start gap-2 p-3 bg-gray-800/60 rounded-lg border border-gray-700/50 hover:border-gray-600/70 transition-colors">
      {/* Teacher input */}
      <div className="relative flex-1 min-w-0">
        <Label
          htmlFor={teacherId}
          className="text-[10px] text-gray-400 mb-1 block"
        >
          Teacher
        </Label>
        <Input
          id={teacherId}
          value={teacherInput}
          onChange={(e) => {
            setTeacherInput(e.target.value);
            onChange(row.id, "teacherName", e.target.value);
            setTeacherSugOpen(true);
          }}
          onFocus={() => setTeacherSugOpen(true)}
          onBlur={() => setTimeout(() => setTeacherSugOpen(false), 150)}
          placeholder="Teacher name"
          className="bg-gray-900 border-gray-600 text-white text-xs h-8 placeholder:text-gray-500"
          data-ocid="teacher.timetable.input"
        />
        {teacherSugOpen && filteredTeachers.length > 0 && (
          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-xl max-h-36 overflow-y-auto">
            {filteredTeachers.map((t) => (
              <button
                key={t}
                type="button"
                className="w-full text-left px-3 py-1.5 text-xs text-gray-200 hover:bg-indigo-600/40 transition-colors"
                onMouseDown={() => {
                  setTeacherInput(t);
                  onChange(row.id, "teacherName", t);
                  setTeacherSugOpen(false);
                }}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Class selector */}
      <div className="w-28 shrink-0">
        <Label className="text-[10px] text-gray-400 mb-1 block">Class</Label>
        <Select
          value={row.className || ""}
          onValueChange={(v) => onChange(row.id, "className", v)}
        >
          <SelectTrigger
            className="bg-gray-900 border-gray-600 text-white text-xs h-8"
            data-ocid="teacher.timetable.select"
          >
            <SelectValue placeholder="Class" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            {ALL_CLASSES.map((c) => (
              <SelectItem
                key={c}
                value={c}
                className="text-gray-200 text-xs focus:bg-indigo-600/40"
              >
                Class {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Subject input */}
      <div className="relative flex-1 min-w-0">
        <Label
          htmlFor={subjectId}
          className="text-[10px] text-gray-400 mb-1 block"
        >
          Subject
        </Label>
        <Input
          id={subjectId}
          value={subjectInput}
          onChange={(e) => {
            setSubjectInput(e.target.value);
            onChange(row.id, "subject", e.target.value);
            setSubjectSugOpen(true);
          }}
          onFocus={() => setSubjectSugOpen(true)}
          onBlur={() => setTimeout(() => setSubjectSugOpen(false), 150)}
          placeholder="Subject"
          className="bg-gray-900 border-gray-600 text-white text-xs h-8 placeholder:text-gray-500"
          data-ocid="teacher.timetable.input"
        />
        {subjectSugOpen && filteredSubjects.length > 0 && (
          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-xl max-h-36 overflow-y-auto">
            {filteredSubjects.map((s) => (
              <button
                key={s}
                type="button"
                className="w-full text-left px-3 py-1.5 text-xs text-gray-200 hover:bg-indigo-600/40 transition-colors"
                onMouseDown={() => {
                  setSubjectInput(s);
                  onChange(row.id, "subject", s);
                  setSubjectSugOpen(false);
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Remove */}
      <div className="pt-5">
        <button
          type="button"
          onClick={() => onRemove(row.id)}
          className="text-gray-500 hover:text-red-400 transition-colors p-1"
          data-ocid="teacher.timetable.delete_button"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function TeacherTimetable() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: assignments
  const [assignments, setAssignments] = useState<TeacherAssignment[]>([
    { id: uid(), teacherName: "", className: "", subject: "" },
  ]);

  // Step 2: schedule config
  const [selectedDays, setSelectedDays] = useState<string[]>([
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
  ]);
  const [periodsPerDay, setPeriodsPerDay] = useState(8);
  const [periodStart, setPeriodStart] = useState("08:00");
  const [periodDuration, setPeriodDuration] = useState(45);
  const [gridClass, setGridClass] = useState("");

  // Step 3: timetable grid
  const [cells, setCells] = useState<
    Record<string, { teacher: string; subject: string }>
  >({});
  const [dragData, setDragData] = useState<DragData | null>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);

  // Saved timetables
  const [savedTimetables, setSavedTimetables] = useState<SavedTimetable[]>([]);

  // Available teachers & subjects from localStorage
  const [staffList, setStaffList] = useState<string[]>([]);
  const [subjectList, setSubjectList] = useState<string[]>([]);

  // Load from localStorage
  useEffect(() => {
    try {
      const staff = JSON.parse(
        localStorage.getItem("erp_staff") || "[]",
      ) as Array<{ name: string; designation?: string }>;
      setStaffList(staff.map((s) => s.name).filter(Boolean));
    } catch {
      /* ignore */
    }
    try {
      const subjects = JSON.parse(
        localStorage.getItem("erp_subjects") || "[]",
      ) as Array<{ name: string }>;
      setSubjectList(subjects.map((s) => s.name).filter(Boolean));
    } catch {
      /* ignore */
    }
    try {
      const saved = JSON.parse(
        localStorage.getItem("erp_teacher_timetable") || "[]",
      ) as SavedTimetable[];
      setSavedTimetables(saved);
    } catch {
      /* ignore */
    }
  }, []);

  // Period timings
  const periodTimes = useMemo(
    () => calcPeriodTimes(periodStart, periodDuration, periodsPerDay),
    [periodStart, periodDuration, periodsPerDay],
  );

  // Assignments for selected class (used in panel)
  const classAssignments = useMemo(
    () =>
      assignments.filter(
        (a) =>
          a.teacherName.trim() &&
          a.subject.trim() &&
          (gridClass === "" || a.className === gridClass || a.className === ""),
      ),
    [assignments, gridClass],
  );

  // Subject color map
  const subjectColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    let idx = 0;
    for (const a of classAssignments) {
      if (!map[a.subject]) {
        map[a.subject] = SUBJECT_COLORS[idx % 8];
        idx++;
      }
    }
    return map;
  }, [classAssignments]);

  // ── Assignment handlers ──────────────────────────────────────────────────────
  function addAssignmentRow() {
    setAssignments((prev) => [
      ...prev,
      { id: uid(), teacherName: "", className: gridClass, subject: "" },
    ]);
  }

  function updateAssignment(
    id: string,
    field: keyof TeacherAssignment,
    value: string,
  ) {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)),
    );
  }

  function removeAssignment(id: string) {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  }

  // ── Day toggle ───────────────────────────────────────────────────────────────
  function toggleDay(day: string) {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  }

  // ── Generate timetable ───────────────────────────────────────────────────────
  function generateTimetable(reshuffle = false) {
    if (classAssignments.length === 0) {
      toast.error("Add at least one teacher-subject assignment first.");
      return;
    }
    if (selectedDays.length === 0) {
      toast.error("Select at least one working day.");
      return;
    }

    if (reshuffle || !generated) {
      const totalSlots = selectedDays.length * periodsPerDay;
      const pool: { teacher: string; subject: string }[] = [];
      while (pool.length < totalSlots) {
        pool.push(
          ...classAssignments.map((a) => ({
            teacher: a.teacherName,
            subject: a.subject,
          })),
        );
      }
      // Fisher-Yates shuffle
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }

      const newCells: Record<string, { teacher: string; subject: string }> = {};
      const teacherPerPeriod: Record<number, Set<string>> = {};
      const orderedDays = ALL_DAYS.filter((d) => selectedDays.includes(d));

      let poolIdx = 0;
      let safety = 0;
      for (let p = 0; p < periodsPerDay; p++) {
        teacherPerPeriod[p] = new Set();
        for (const day of orderedDays) {
          const key = `${day}_${p}`;
          let placed = false;
          let attempts = 0;
          while (!placed && attempts < pool.length) {
            const candidate = pool[(poolIdx + safety) % pool.length];
            if (!teacherPerPeriod[p].has(candidate.teacher)) {
              newCells[key] = candidate;
              teacherPerPeriod[p].add(candidate.teacher);
              placed = true;
            }
            safety++;
            attempts++;
          }
          if (!placed) {
            newCells[key] = pool[poolIdx % pool.length];
          }
          poolIdx++;
        }
      }

      setCells(newCells);
      setGenerated(true);
      setStep(3);
    } else {
      setStep(3);
    }
  }

  // ── Drag handlers (panel → cell) ─────────────────────────────────────────────
  function handlePanelDragStart(teacher: string, subject: string) {
    setDragData({ source: "panel", teacher, subject });
  }

  function handleCellDragStart(day: string, periodIdx: number) {
    const key = `${day}_${periodIdx}`;
    const cell = cells[key];
    if (cell) {
      setDragData({
        source: "cell",
        teacher: cell.teacher,
        subject: cell.subject,
        cellKey: key,
      });
    }
  }

  function handleCellDragOver(e: React.DragEvent, key: string) {
    e.preventDefault();
    setDragOverKey(key);
  }

  function handleCellDrop(e: React.DragEvent, day: string, periodIdx: number) {
    e.preventDefault();
    const targetKey = `${day}_${periodIdx}`;
    if (!dragData) return;

    setCells((prev) => {
      const next = { ...prev };
      if (dragData.source === "cell" && dragData.cellKey) {
        const srcVal = prev[dragData.cellKey];
        const tgtVal = prev[targetKey];
        if (srcVal) next[targetKey] = srcVal;
        else delete next[targetKey];
        if (tgtVal) next[dragData.cellKey] = tgtVal;
        else delete next[dragData.cellKey];
      } else {
        next[targetKey] = {
          teacher: dragData.teacher,
          subject: dragData.subject,
        };
      }
      return next;
    });
    setDragData(null);
    setDragOverKey(null);
  }

  function handleDragEnd() {
    setDragData(null);
    setDragOverKey(null);
  }

  function clearCell(day: string, periodIdx: number) {
    const key = `${day}_${periodIdx}`;
    setCells((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  // ── Save ─────────────────────────────────────────────────────────────────────
  const saveRef = useRef<HTMLButtonElement>(null);

  // Use a ref to hold the latest save function so Ctrl+S always has current state
  const saveTimetable = useCallback(() => {
    if (!gridClass) {
      toast.error("Please select a class for this timetable.");
      return;
    }
    if (Object.keys(cells).length === 0) {
      toast.error("Generate or fill the timetable first.");
      return;
    }
    const entry: SavedTimetable = {
      id: uid(),
      className: gridClass,
      days: ALL_DAYS.filter((d) => selectedDays.includes(d)),
      periods: periodsPerDay,
      periodStart,
      periodDuration,
      cells,
      savedAt: new Date().toLocaleString("en-IN"),
    };
    setSavedTimetables((prev) => {
      const updated = [...prev, entry];
      try {
        localStorage.setItem("erp_teacher_timetable", JSON.stringify(updated));
      } catch {
        /* ignore */
      }
      return updated;
    });
    toast.success(`Timetable for Class ${gridClass} saved successfully!`);
  }, [
    gridClass,
    cells,
    selectedDays,
    periodsPerDay,
    periodStart,
    periodDuration,
  ]);

  const saveTimetableRef = useRef(saveTimetable);
  saveTimetableRef.current = saveTimetable;

  // Save on Ctrl+S / Cmd+S
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveTimetableRef.current();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ── Delete saved ─────────────────────────────────────────────────────────────
  function deleteSaved(id: string) {
    setSavedTimetables((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      try {
        localStorage.setItem("erp_teacher_timetable", JSON.stringify(updated));
      } catch {
        /* ignore */
      }
      return updated;
    });
    toast.success("Timetable deleted.");
  }

  // ── Print ─────────────────────────────────────────────────────────────────────
  function printTimetable(t: SavedTimetable) {
    try {
      const schoolProfile = JSON.parse(
        localStorage.getItem("erp_school_profile") || "{}",
      ) as { name?: string; address?: string };
      const schoolName = schoolProfile.name || "School";

      const times = calcPeriodTimes(t.periodStart, t.periodDuration, t.periods);

      const rows = Array.from({ length: t.periods }, (_, pi) => {
        const cols = t.days
          .map((day) => {
            const cell = t.cells[`${day}_${pi}`];
            return `<td style="border:1px solid #ddd;padding:6px 10px;text-align:center;min-width:90px;">
              ${cell ? `<strong>${cell.teacher}</strong><br/><span style="font-size:11px;color:#555">${cell.subject}</span>` : "\u2014"}
            </td>`;
          })
          .join("");
        return `<tr>
          <td style="border:1px solid #ddd;padding:6px 10px;background:#f5f5f5;font-weight:600;white-space:nowrap;">
            P${pi + 1}<br/><span style="font-size:10px;font-weight:400;color:#666">${times[pi].from}\u2013${times[pi].to}</span>
          </td>
          ${cols}
        </tr>`;
      }).join("");

      const win = window.open("", "_blank");
      if (!win) return;
      win.document.write(`<!DOCTYPE html>
<html>
<head><title>Teacher Timetable \u2013 Class ${t.className}</title>
<style>
  body { font-family: Arial, sans-serif; padding: 20px; }
  h2 { text-align: center; margin-bottom: 4px; }
  h3 { text-align: center; color: #444; margin-top: 0; }
  table { border-collapse: collapse; width: 100%; margin-top: 16px; }
  th { border: 1px solid #ddd; padding: 8px 10px; background: #e8eaf6; text-align: center; }
  @media print { button { display: none; } }
</style>
</head>
<body>
<h2>${schoolName}</h2>
<h3>Teacher Timetable \u2014 Class ${t.className} &nbsp;|&nbsp; Saved: ${t.savedAt}</h3>
<table>
  <thead>
    <tr>
      <th>Period / Time</th>
      ${t.days.map((d) => `<th>${d}</th>`).join("")}
    </tr>
  </thead>
  <tbody>${rows}</tbody>
</table>
<br/>
<button onclick="window.print()">${"\uD83D\uDDA8"} Print</button>
</body></html>`);
      win.document.close();
    } catch {
      toast.error("Print failed.");
    }
  }

  // ── Derived ───────────────────────────────────────────────────────────────────
  const orderedSelectedDays = ALL_DAYS.filter((d) => selectedDays.includes(d));
  const filledCount = Object.keys(cells).length;
  const totalCells = selectedDays.length * periodsPerDay;

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-6">
      {/* Page header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/20 rounded-lg border border-indigo-500/30">
            <BookOpen size={20} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Teacher Class Timetable
            </h1>
            <p className="text-xs text-gray-400">
              Wizard-based timetable builder with drag &amp; drop scheduling
            </p>
          </div>
        </div>
        {step === 3 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {filledCount}/{totalCells} slots filled
            </span>
            <Badge
              variant="outline"
              className="border-emerald-500/40 text-emerald-400 text-[10px]"
            >
              Class {gridClass || "\u2014"}
            </Badge>
          </div>
        )}
      </div>

      {/* Step indicators */}
      <div
        className="flex items-center gap-0 mb-6"
        data-ocid="teacher.timetable.panel"
      >
        {([1, 2, 3] as const).map((s) => {
          const labels = [
            "",
            "Teacher & Subjects",
            "Period Setup",
            "Timetable Grid",
          ];
          const active = step === s;
          const done = step > s;
          return (
            <div key={s} className="flex items-center">
              <button
                type="button"
                onClick={() => setStep(s)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  active
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40"
                    : done
                      ? "bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30"
                      : "bg-gray-800/80 text-gray-500 hover:bg-gray-800"
                }`}
                data-ocid="teacher.timetable.tab"
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    active
                      ? "bg-white text-indigo-700"
                      : done
                        ? "bg-indigo-400 text-white"
                        : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {done ? "\u2713" : s}
                </span>
                {labels[s]}
              </button>
              {s < 3 && (
                <div
                  className={`h-px w-6 ${
                    step > s ? "bg-indigo-500" : "bg-gray-700"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ── STEP 1: Teacher & Subject Assignment ─────────────────────────────── */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left: available teachers panel */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                <User size={14} className="text-indigo-400" />
                Available Teachers
              </h3>
              <p className="text-[10px] text-gray-500 mb-3">
                Drag a teacher chip into the assignment form.
              </p>
              {staffList.length === 0 ? (
                <p className="text-xs text-gray-600 italic">
                  No staff in HR module yet.
                </p>
              ) : (
                <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto">
                  {staffList.map((name) => (
                    <div
                      key={name}
                      draggable
                      onDragStart={() =>
                        setDragData({
                          source: "panel",
                          teacher: name,
                          subject: "",
                        })
                      }
                      onDragEnd={handleDragEnd}
                      className="flex items-center gap-2 px-2.5 py-1.5 bg-indigo-600/20 border border-indigo-500/30 rounded-md text-indigo-200 text-xs cursor-grab active:cursor-grabbing hover:bg-indigo-600/30 transition-colors select-none"
                      data-ocid="teacher.timetable.drag_handle"
                    >
                      <GripVertical size={11} className="text-indigo-400/60" />
                      {name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: assignment rows */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-200">
                  Teacher\u2013Class\u2013Subject Assignments
                </h3>
                <Badge
                  variant="outline"
                  className="border-indigo-500/40 text-indigo-300 text-[10px]"
                >
                  {assignments.filter((a) => a.teacherName && a.subject).length}{" "}
                  assigned
                </Badge>
              </div>

              <div className="flex flex-col gap-2 max-h-[480px] overflow-y-auto pr-1">
                {assignments.map((row) => (
                  <AssignmentRow
                    key={row.id}
                    row={row}
                    teacherSuggestions={staffList}
                    subjectSuggestions={subjectList}
                    onChange={updateAssignment}
                    onRemove={removeAssignment}
                  />
                ))}
              </div>

              <div className="mt-4 flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addAssignmentRow}
                  className="border-dashed border-indigo-500/50 text-indigo-300 hover:bg-indigo-600/20 text-xs"
                  data-ocid="teacher.timetable.button"
                >
                  <Plus size={13} className="mr-1.5" />
                  Add Row
                </Button>
                <Button
                  size="sm"
                  onClick={() => setStep(2)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs ml-auto"
                  data-ocid="teacher.timetable.primary_button"
                >
                  Continue to Period Setup
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 2: Period & Schedule Setup ───────────────────────────────────── */}
      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-5 space-y-5">
            <h3 className="text-sm font-semibold text-gray-200">
              Schedule Configuration
            </h3>

            {/* Days */}
            <div>
              <p className="text-xs text-gray-400 mb-2">Working Days</p>
              <div className="flex flex-wrap gap-3">
                {ALL_DAYS.map((day) => {
                  const checkId = `day-check-${day}`;
                  return (
                    <div
                      key={day}
                      className="flex items-center gap-1.5"
                      data-ocid="teacher.timetable.checkbox"
                    >
                      <Checkbox
                        id={checkId}
                        checked={selectedDays.includes(day)}
                        onCheckedChange={() => toggleDay(day)}
                        className="border-gray-600 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                      />
                      <Label
                        htmlFor={checkId}
                        className="text-sm text-gray-300 cursor-pointer"
                      >
                        {day}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Periods per day */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="periods-per-day"
                  className="text-xs text-gray-400 mb-1.5 block"
                >
                  Periods per Day
                </Label>
                <Input
                  id="periods-per-day"
                  type="number"
                  min={1}
                  max={12}
                  value={periodsPerDay}
                  onChange={(e) =>
                    setPeriodsPerDay(
                      Math.max(1, Number.parseInt(e.target.value) || 1),
                    )
                  }
                  className="bg-gray-900 border-gray-600 text-white text-sm"
                  data-ocid="teacher.timetable.input"
                />
              </div>
              <div>
                <Label
                  htmlFor="period-duration"
                  className="text-xs text-gray-400 mb-1.5 block"
                >
                  Period Duration (min)
                </Label>
                <Input
                  id="period-duration"
                  type="number"
                  min={10}
                  max={120}
                  value={periodDuration}
                  onChange={(e) =>
                    setPeriodDuration(
                      Math.max(10, Number.parseInt(e.target.value) || 45),
                    )
                  }
                  className="bg-gray-900 border-gray-600 text-white text-sm"
                  data-ocid="teacher.timetable.input"
                />
              </div>
            </div>

            {/* Start time */}
            <div>
              <Label
                htmlFor="period-start"
                className="text-xs text-gray-400 mb-1.5 block"
              >
                Period Start Time
              </Label>
              <Input
                id="period-start"
                type="time"
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
                className="bg-gray-900 border-gray-600 text-white text-sm"
                data-ocid="teacher.timetable.input"
              />
            </div>

            {/* Class selector */}
            <div>
              <Label className="text-xs text-gray-400 mb-1.5 block">
                Build Timetable for Class
              </Label>
              <Select value={gridClass} onValueChange={setGridClass}>
                <SelectTrigger
                  className="bg-gray-900 border-gray-600 text-white"
                  data-ocid="teacher.timetable.select"
                >
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {ALL_CLASSES.map((c) => (
                    <SelectItem
                      key={c}
                      value={c}
                      className="text-gray-200 focus:bg-indigo-600/40"
                    >
                      Class {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep(1)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 text-xs"
                data-ocid="teacher.timetable.button"
              >
                Back
              </Button>
              <Button
                size="sm"
                onClick={() => generateTimetable(false)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs flex-1"
                data-ocid="teacher.timetable.primary_button"
              >
                <Shuffle size={13} className="mr-1.5" />
                Generate Timetable
              </Button>
            </div>
          </div>

          {/* Period preview */}
          <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-200 mb-4">
              Period Timings Preview
            </h3>
            <div className="space-y-1.5 max-h-96 overflow-y-auto">
              {periodTimes.map((pt, i) => (
                <div
                  key={pt.from}
                  className="flex items-center justify-between px-3 py-2 bg-gray-900/60 rounded-md border border-gray-700/40"
                >
                  <span className="text-xs font-semibold text-indigo-300">
                    Period {i + 1}
                  </span>
                  <span className="text-xs text-gray-300">
                    {pt.from} \u2013 {pt.to}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 3: Timetable Grid ─────────────────────────────────────────────── */}
      {step === 3 && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep(2)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 text-xs"
              data-ocid="teacher.timetable.button"
            >
              Setup
            </Button>
            <Button
              size="sm"
              onClick={() => generateTimetable(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs"
              data-ocid="teacher.timetable.primary_button"
            >
              <RefreshCcw size={12} className="mr-1.5" />
              Re-Generate
            </Button>
            <Button
              ref={saveRef}
              size="sm"
              onClick={saveTimetable}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs"
              data-ocid="teacher.timetable.save_button"
            >
              <Save size={12} className="mr-1.5" />
              Save (Ctrl+S)
            </Button>
            <span className="ml-auto text-[11px] text-gray-500">
              Right-click a cell to clear it
            </span>
          </div>

          <div className="flex gap-4">
            {/* ── Left Panel: Teacher+Subject Chips ─────────────────────────────── */}
            <div
              className="w-52 shrink-0 bg-gray-800/50 border border-gray-700/50 rounded-xl p-3"
              data-ocid="teacher.timetable.panel"
            >
              <h3 className="text-xs font-semibold text-gray-300 mb-1">
                Teachers &amp; Subjects
              </h3>
              <p className="text-[10px] text-gray-600 mb-3">
                Drag chips onto the grid
              </p>
              <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
                {classAssignments.length === 0 ? (
                  <p className="text-[10px] text-gray-600 italic">
                    No assignments for this class.
                  </p>
                ) : (
                  classAssignments.map((a, i) => {
                    const colorCls =
                      subjectColorMap[a.subject] || SUBJECT_COLORS[i % 8];
                    return (
                      <div
                        key={a.id}
                        draggable
                        onDragStart={() =>
                          handlePanelDragStart(a.teacherName, a.subject)
                        }
                        onDragEnd={handleDragEnd}
                        className={`flex items-start gap-1.5 px-2.5 py-2 rounded-md border text-xs cursor-grab active:cursor-grabbing hover:opacity-90 transition-opacity select-none ${colorCls}`}
                        data-ocid="teacher.timetable.drag_handle"
                      >
                        <GripVertical
                          size={11}
                          className="mt-0.5 shrink-0 opacity-60"
                        />
                        <div className="min-w-0">
                          <div className="font-semibold truncate">
                            {a.teacherName}
                          </div>
                          <div className="text-[10px] opacity-80 truncate">
                            {a.subject}
                          </div>
                          {a.className && (
                            <Badge
                              variant="outline"
                              className="text-[8px] px-1 py-0 h-3.5 mt-0.5 border-current opacity-60"
                            >
                              Cl {a.className}
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* ── Timetable Grid ────────────────────────────────────────────────── */}
            <div className="flex-1 overflow-x-auto">
              <div className="min-w-max">
                <table
                  className="border-collapse w-full"
                  data-ocid="teacher.timetable.table"
                >
                  <thead>
                    <tr>
                      <th className="w-28 px-3 py-2.5 bg-gray-800/80 border border-gray-700/60 text-xs font-semibold text-gray-400 text-left">
                        Period / Time
                      </th>
                      {orderedSelectedDays.map((day) => (
                        <th
                          key={day}
                          className="px-3 py-2.5 bg-gray-800/80 border border-gray-700/60 text-xs font-semibold text-indigo-300 text-center min-w-[110px]"
                        >
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {periodTimes.map((pt, pi) => (
                      <tr key={pt.from}>
                        <td className="px-3 py-2 bg-gray-800/50 border border-gray-700/60">
                          <div className="text-xs font-semibold text-indigo-400">
                            P{pi + 1}
                          </div>
                          <div className="text-[10px] text-gray-500 whitespace-nowrap">
                            {pt.from}\u2013{pt.to}
                          </div>
                        </td>
                        {orderedSelectedDays.map((day) => {
                          const key = `${day}_${pi}`;
                          const cell = cells[key];
                          const isDragOver = dragOverKey === key;
                          const colorCls = cell
                            ? subjectColorMap[cell.subject] || SUBJECT_COLORS[0]
                            : "";
                          return (
                            <td
                              key={key}
                              onDragOver={(e) => handleCellDragOver(e, key)}
                              onDrop={(e) => handleCellDrop(e, day, pi)}
                              onDragLeave={() => setDragOverKey(null)}
                              onContextMenu={(e) => {
                                e.preventDefault();
                                clearCell(day, pi);
                              }}
                              className={`border border-gray-700/60 p-1 align-top transition-all ${
                                isDragOver
                                  ? "bg-indigo-600/20 outline outline-2 outline-indigo-400/60"
                                  : cell
                                    ? ""
                                    : "bg-gray-900/30"
                              }`}
                              data-ocid={`teacher.timetable.item.${pi + 1}`}
                            >
                              {cell ? (
                                <div
                                  draggable
                                  onDragStart={() =>
                                    handleCellDragStart(day, pi)
                                  }
                                  onDragEnd={handleDragEnd}
                                  className={`group relative rounded px-2 py-1.5 border text-xs cursor-grab active:cursor-grabbing select-none ${colorCls}`}
                                  data-ocid="teacher.timetable.drag_handle"
                                >
                                  <button
                                    type="button"
                                    onClick={() => clearCell(day, pi)}
                                    className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 text-current hover:text-red-300 transition-opacity"
                                    data-ocid="teacher.timetable.delete_button"
                                  >
                                    <X size={9} />
                                  </button>
                                  <div className="font-semibold leading-tight truncate pr-2">
                                    {cell.teacher}
                                  </div>
                                  <div className="text-[10px] opacity-80 truncate">
                                    {cell.subject}
                                  </div>
                                </div>
                              ) : (
                                <div className="h-12 flex items-center justify-center border border-dashed border-gray-700/40 rounded text-[10px] text-gray-700">
                                  {isDragOver ? (
                                    <span className="text-indigo-400">
                                      Drop here
                                    </span>
                                  ) : (
                                    "\u2014"
                                  )}
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Saved Timetables ─────────────────────────────────────────────────── */}
      {savedTimetables.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
            <Save size={14} className="text-emerald-400" />
            Saved Timetables
          </h2>
          <div className="overflow-x-auto rounded-xl border border-gray-700/50">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700/50 hover:bg-transparent">
                  <TableHead className="text-gray-400 text-xs">Class</TableHead>
                  <TableHead className="text-gray-400 text-xs">Days</TableHead>
                  <TableHead className="text-gray-400 text-xs">
                    Periods
                  </TableHead>
                  <TableHead className="text-gray-400 text-xs">
                    Filled
                  </TableHead>
                  <TableHead className="text-gray-400 text-xs">
                    Saved At
                  </TableHead>
                  <TableHead className="text-gray-400 text-xs">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {savedTimetables.map((t, i) => (
                  <TableRow
                    key={t.id}
                    className="border-gray-700/40 hover:bg-gray-800/40"
                    data-ocid={`teacher.saved.row.${i + 1}`}
                  >
                    <TableCell className="text-sm text-gray-200 font-medium">
                      Class {t.className}
                    </TableCell>
                    <TableCell className="text-xs text-gray-400">
                      {t.days.join(", ")}
                    </TableCell>
                    <TableCell className="text-xs text-gray-400">
                      {t.periods}
                    </TableCell>
                    <TableCell className="text-xs text-gray-400">
                      {Object.keys(t.cells).length}/{t.days.length * t.periods}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">
                      {t.savedAt}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => printTimetable(t)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded text-xs transition-colors"
                          data-ocid="teacher.saved.button"
                        >
                          <Printer size={11} />
                          Print
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteSaved(t.id)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-red-900/30 hover:bg-red-800/40 text-red-400 rounded text-xs transition-colors"
                          data-ocid="teacher.saved.delete_button"
                        >
                          <Trash2 size={11} />
                          Delete
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
