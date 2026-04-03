import { Download, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type AttStatus = "Present" | "Absent" | "Late";

interface StudentRow {
  id: number;
  name: string;
  admNo: string;
  className: string;
  section: string;
  rollNo: string;
}

interface StaffRow {
  id: number;
  name: string;
  designation: string;
  status: string;
}

interface BiometricEntry {
  id: string;
  personId: string;
  name: string;
  type: "Student" | "Staff";
  className?: string;
  designation?: string;
  date: string;
  inTime: string;
  outTime: string;
  deviceType: "RFID" | "ESSL Biometric" | "Manual";
}

function calcDuration(inT: string, outT: string): string {
  const [ih, im] = inT.split(":").map(Number);
  const [oh, om] = outT.split(":").map(Number);
  const mins = oh * 60 + om - (ih * 60 + im);
  if (mins < 0) return "-";
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

function nowTime(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}

function todayDate(): string {
  return new Date().toISOString().split("T")[0];
}

function loadBioLog(): BiometricEntry[] {
  try {
    return JSON.parse(localStorage.getItem("erp_biometric_log") || "[]");
  } catch {
    return [];
  }
}

function saveBioLog(log: BiometricEntry[]) {
  localStorage.setItem("erp_biometric_log", JSON.stringify(log));
}

// ─── RFID/Biometric Tab ───────────────────────────────────────────────────────
function RFIDTab() {
  const [log, setLog] = useState<BiometricEntry[]>(loadBioLog);
  const [filterDate, setFilterDate] = useState(todayDate());
  const [filterType, setFilterType] = useState<"All" | "Student" | "Staff">(
    "All",
  );
  const [filterClass, setFilterClass] = useState("");
  const [filterDevice, setFilterDevice] = useState<
    "All" | "RFID" | "ESSL Biometric" | "Manual"
  >("All");
  const [showManual, setShowManual] = useState(false);

  // Manual entry form state
  const [manualPersonType, setManualPersonType] = useState<"Student" | "Staff">(
    "Student",
  );
  const [manualSearch, setManualSearch] = useState("");
  const [manualDate, setManualDate] = useState(todayDate());
  const [manualInTime, setManualInTime] = useState("");
  const [manualOutTime, setManualOutTime] = useState("");
  const [manualDevice, setManualDevice] = useState<
    "RFID" | "ESSL Biometric" | "Manual"
  >("Manual");
  const [manualSearchResults, setManualSearchResults] = useState<
    Array<{
      id: string;
      name: string;
      className?: string;
      designation?: string;
    }>
  >([]);
  const [selectedPerson, setSelectedPerson] = useState<{
    id: string;
    name: string;
    className?: string;
    designation?: string;
  } | null>(null);

  const allStudents: StudentRow[] = useMemo(() => {
    try {
      const data = JSON.parse(localStorage.getItem("erp_students") || "[]");
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }, []);

  const allStaff: StaffRow[] = useMemo(() => {
    try {
      const data = JSON.parse(localStorage.getItem("erp_staff") || "[]");
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }, []);

  const classOptions = useMemo(() => {
    const seen = new Set<string>();
    const opts: string[] = [];
    for (const s of allStudents) {
      const cls = s.className || "";
      if (cls && !seen.has(cls)) {
        seen.add(cls);
        opts.push(cls);
      }
    }
    return opts.sort();
  }, [allStudents]);

  // Search persons for manual entry
  useEffect(() => {
    if (!manualSearch.trim()) {
      setManualSearchResults([]);
      return;
    }
    const q = manualSearch.toLowerCase();
    if (manualPersonType === "Student") {
      setManualSearchResults(
        allStudents
          .filter(
            (s) =>
              s.name.toLowerCase().includes(q) ||
              s.admNo.toLowerCase().includes(q),
          )
          .slice(0, 8)
          .map((s) => ({ id: s.admNo, name: s.name, className: s.className })),
      );
    } else {
      setManualSearchResults(
        allStaff
          .filter((s) => s.name.toLowerCase().includes(q))
          .slice(0, 8)
          .map((s) => ({
            id: String(s.id),
            name: s.name,
            designation: s.designation,
          })),
      );
    }
  }, [manualSearch, manualPersonType, allStudents, allStaff]);

  const filteredLog = useMemo(() => {
    return log.filter((e) => {
      if (e.date !== filterDate) return false;
      if (filterType !== "All" && e.type !== filterType) return false;
      if (filterClass && e.type === "Student" && e.className !== filterClass)
        return false;
      if (filterDevice !== "All" && e.deviceType !== filterDevice) return false;
      return true;
    });
  }, [log, filterDate, filterType, filterClass, filterDevice]);

  // Today summary
  const todayEntries = log.filter((e) => e.date === todayDate());
  const todayStudents = todayEntries.filter((e) => e.type === "Student").length;
  const todayStaff = todayEntries.filter((e) => e.type === "Staff").length;
  const totalPersons = allStudents.length + allStaff.length;
  const todayPresent = todayEntries.length;
  const todayAbsent = Math.max(0, totalPersons - todayPresent);

  const simulateScan = () => {
    const allPersons: Array<{
      id: string;
      name: string;
      type: "Student" | "Staff";
      className?: string;
      designation?: string;
    }> = [
      ...allStudents.map((s) => ({
        id: s.admNo,
        name: s.name,
        type: "Student" as const,
        className: s.className,
      })),
      ...allStaff.map((s) => ({
        id: String(s.id),
        name: s.name,
        type: "Staff" as const,
        designation: s.designation,
      })),
    ];
    if (allPersons.length === 0) {
      toast.error("No students or staff found. Add some data first.");
      return;
    }
    const person = allPersons[Math.floor(Math.random() * allPersons.length)];
    const today = todayDate();
    const currentLog = loadBioLog();
    const existingEntry = currentLog.find(
      (e) => e.personId === person.id && e.date === today,
    );
    let updatedLog: BiometricEntry[];
    let action: string;
    if (!existingEntry) {
      const newEntry: BiometricEntry = {
        id: `${person.id}_${today}_${Date.now()}`,
        personId: person.id,
        name: person.name,
        type: person.type,
        className: person.className,
        designation: person.designation,
        date: today,
        inTime: nowTime(),
        outTime: "",
        deviceType: "RFID",
      };
      updatedLog = [...currentLog, newEntry];
      action = "IN";
    } else if (!existingEntry.outTime) {
      updatedLog = currentLog.map((e) =>
        e.id === existingEntry.id ? { ...e, outTime: nowTime() } : e,
      );
      action = "OUT";
    } else {
      toast.info(`${person.name} already has full attendance today.`);
      return;
    }
    saveBioLog(updatedLog);
    setLog(updatedLog);
    toast.success(`✓ ${person.name} punched ${action} at ${nowTime()}`, {
      duration: 3000,
    });
  };

  const handleManualSave = () => {
    if (!selectedPerson) {
      toast.error("Please select a person first");
      return;
    }
    if (!manualInTime) {
      toast.error("In-Time is required");
      return;
    }
    const currentLog = loadBioLog();
    const newEntry: BiometricEntry = {
      id: `${selectedPerson.id}_${manualDate}_${Date.now()}`,
      personId: selectedPerson.id,
      name: selectedPerson.name,
      type: manualPersonType,
      className: selectedPerson.className,
      designation: selectedPerson.designation,
      date: manualDate,
      inTime: manualInTime,
      outTime: manualOutTime,
      deviceType: manualDevice,
    };
    const updatedLog = [...currentLog, newEntry];
    saveBioLog(updatedLog);
    setLog(updatedLog);
    toast.success("Attendance entry saved!");
    setManualSearch("");
    setSelectedPerson(null);
    setManualInTime("");
    setManualOutTime("");
    setShowManual(false);
  };

  const exportCSV = () => {
    const headers = [
      "Sr",
      "Name",
      "ID/Adm No",
      "Type",
      "Class/Designation",
      "Date",
      "In Time",
      "Out Time",
      "Duration",
      "Device",
      "Status",
    ];
    const rows = filteredLog.map((e, i) => {
      const duration =
        e.inTime && e.outTime ? calcDuration(e.inTime, e.outTime) : "-";
      const status = !e.inTime
        ? "Absent"
        : !e.outTime
          ? "In School"
          : "Present";
      return [
        i + 1,
        e.name,
        e.personId,
        e.type,
        e.className || e.designation || "-",
        e.date,
        e.inTime || "-",
        e.outTime || "-",
        duration,
        e.deviceType,
        status,
      ];
    });
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `biometric_attendance_${filterDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Summary Bar */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Today", value: todayPresent, color: "text-blue-400" },
          { label: "Students", value: todayStudents, color: "text-green-400" },
          { label: "Staff", value: todayStaff, color: "text-yellow-400" },
          { label: "Absent", value: todayAbsent, color: "text-red-400" },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3"
          >
            <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
            <div className="text-gray-400 text-xs mt-1">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={simulateScan}
          className="bg-green-600 hover:bg-green-700 text-white text-xs px-4 py-2 rounded font-medium transition"
          data-ocid="rfid.simulate.button"
        >
          📡 Simulate RFID Scan
        </button>
        <button
          type="button"
          onClick={() => setShowManual((v) => !v)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded font-medium transition"
          data-ocid="rfid.manual.toggle"
        >
          ✏️ Manual Entry {showManual ? "▲" : "▼"}
        </button>
        <button
          type="button"
          onClick={exportCSV}
          className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-4 py-2 rounded font-medium transition flex items-center gap-1.5"
          data-ocid="rfid.export.button"
        >
          <Download size={12} /> Export CSV
        </button>
      </div>

      {/* Manual Entry Form */}
      {showManual && (
        <div
          className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 space-y-3"
          data-ocid="rfid.manual.panel"
        >
          <h4 className="text-white text-sm font-semibold">
            Manual Attendance Entry
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label
                htmlFor="manual-person-type"
                className="text-gray-400 text-xs block mb-1"
              >
                Person Type
              </label>
              <select
                id="manual-person-type"
                value={manualPersonType}
                onChange={(e) => {
                  setManualPersonType(e.target.value as "Student" | "Staff");
                  setManualSearch("");
                  setSelectedPerson(null);
                }}
                className="w-full bg-gray-900 border border-gray-600 text-white text-xs rounded px-2 py-1.5 outline-none"
                data-ocid="rfid.manual.select"
              >
                <option value="Student">Student</option>
                <option value="Staff">Staff</option>
              </select>
            </div>
            <div className="relative">
              <label
                htmlFor="manual-person-search"
                className="text-gray-400 text-xs block mb-1"
              >
                Search Person
              </label>
              <input
                id="manual-person-search"
                type="text"
                value={selectedPerson ? selectedPerson.name : manualSearch}
                onChange={(e) => {
                  setManualSearch(e.target.value);
                  setSelectedPerson(null);
                }}
                placeholder="Search by name or ID..."
                className="w-full bg-gray-900 border border-gray-600 text-white text-xs rounded px-2 py-1.5 outline-none focus:border-blue-400"
                data-ocid="rfid.manual.search_input"
              />
              {manualSearchResults.length > 0 && !selectedPerson && (
                <div className="absolute top-full left-0 right-0 bg-gray-900 border border-gray-600 rounded-b z-10 max-h-40 overflow-y-auto">
                  {manualSearchResults.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedPerson(p);
                        setManualSearch(p.name);
                        setManualSearchResults([]);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-white hover:bg-gray-700 cursor-pointer"
                    >
                      {p.name} <span className="text-gray-400">({p.id})</span>
                      {p.className && (
                        <span className="text-blue-400 ml-1">
                          Cls: {p.className}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="manual-date"
                className="text-gray-400 text-xs block mb-1"
              >
                Date
              </label>
              <input
                id="manual-date"
                type="date"
                value={manualDate}
                onChange={(e) => setManualDate(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 text-white text-xs rounded px-2 py-1.5 outline-none"
                data-ocid="rfid.manual.date.input"
              />
            </div>
            <div>
              <label
                htmlFor="manual-intime"
                className="text-gray-400 text-xs block mb-1"
              >
                In-Time
              </label>
              <input
                id="manual-intime"
                type="time"
                value={manualInTime}
                onChange={(e) => setManualInTime(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 text-white text-xs rounded px-2 py-1.5 outline-none"
                data-ocid="rfid.manual.intime.input"
              />
            </div>
            <div>
              <label
                htmlFor="manual-outtime"
                className="text-gray-400 text-xs block mb-1"
              >
                Out-Time
              </label>
              <input
                id="manual-outtime"
                type="time"
                value={manualOutTime}
                onChange={(e) => setManualOutTime(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 text-white text-xs rounded px-2 py-1.5 outline-none"
                data-ocid="rfid.manual.outtime.input"
              />
            </div>
            <div>
              <label
                htmlFor="manual-device"
                className="text-gray-400 text-xs block mb-1"
              >
                Device Type
              </label>
              <select
                id="manual-device"
                value={manualDevice}
                onChange={(e) =>
                  setManualDevice(
                    e.target.value as BiometricEntry["deviceType"],
                  )
                }
                className="w-full bg-gray-900 border border-gray-600 text-white text-xs rounded px-2 py-1.5 outline-none"
              >
                <option>RFID</option>
                <option>ESSL Biometric</option>
                <option>Manual</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleManualSave}
              className="bg-green-600 hover:bg-green-700 text-white text-xs px-4 py-1.5 rounded font-medium transition"
              data-ocid="rfid.manual.submit_button"
            >
              Save Entry
            </button>
            <button
              type="button"
              onClick={() => setShowManual(false)}
              className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-4 py-1.5 rounded transition"
              data-ocid="rfid.manual.cancel_button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex gap-3 flex-wrap items-end bg-gray-800/40 border border-gray-700 rounded-lg p-3">
        <div>
          <label
            htmlFor="rfid-filter-date"
            className="text-gray-400 text-xs block mb-1"
          >
            Date
          </label>
          <input
            id="rfid-filter-date"
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="bg-gray-900 border border-gray-600 text-white text-xs rounded px-2 py-1.5 outline-none"
            data-ocid="rfid.filter.date.input"
          />
        </div>
        <div>
          <label
            htmlFor="rfid-filter-type"
            className="text-gray-400 text-xs block mb-1"
          >
            Type
          </label>
          <select
            id="rfid-filter-type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as typeof filterType)}
            className="bg-gray-900 border border-gray-600 text-white text-xs rounded px-2 py-1.5 outline-none"
            data-ocid="rfid.filter.type.select"
          >
            <option>All</option>
            <option>Student</option>
            <option>Staff</option>
          </select>
        </div>
        {filterType !== "Staff" && (
          <div>
            <label
              htmlFor="rfid-filter-class"
              className="text-gray-400 text-xs block mb-1"
            >
              Class
            </label>
            <select
              id="rfid-filter-class"
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="bg-gray-900 border border-gray-600 text-white text-xs rounded px-2 py-1.5 outline-none"
            >
              <option value="">All Classes</option>
              {classOptions.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label
            htmlFor="rfid-filter-device"
            className="text-gray-400 text-xs block mb-1"
          >
            Device
          </label>
          <select
            id="rfid-filter-device"
            value={filterDevice}
            onChange={(e) =>
              setFilterDevice(e.target.value as typeof filterDevice)
            }
            className="bg-gray-900 border border-gray-600 text-white text-xs rounded px-2 py-1.5 outline-none"
          >
            <option>All</option>
            <option>RFID</option>
            <option>ESSL Biometric</option>
            <option>Manual</option>
          </select>
        </div>
        <span className="text-gray-400 text-xs ml-auto">
          {filteredLog.length} records
        </span>
      </div>

      {/* Excel-Style Table */}
      <div className="rounded-lg overflow-hidden border border-gray-700 overflow-x-auto">
        <table
          className="w-full text-xs"
          style={{ minWidth: 800 }}
          data-ocid="rfid.table"
        >
          <thead>
            <tr style={{ background: "#1a1f2e" }}>
              {[
                "Sr",
                "Name",
                "ID/Adm No",
                "Type",
                "Class/Desig.",
                "Date",
                "In Time",
                "Out Time",
                "Duration",
                "Device",
                "Status",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-3 py-2 text-gray-400 font-semibold border-b border-gray-700 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredLog.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
                  className="px-3 py-10 text-center text-gray-500"
                  data-ocid="rfid.empty_state"
                >
                  No attendance records found for selected filters
                </td>
              </tr>
            ) : (
              filteredLog.map((e, i) => {
                const duration =
                  e.inTime && e.outTime
                    ? calcDuration(e.inTime, e.outTime)
                    : "-";
                const status = !e.inTime
                  ? "Absent"
                  : !e.outTime
                    ? "In School"
                    : "Present";
                const statusColor =
                  status === "Present"
                    ? "#16a34a"
                    : status === "In School"
                      ? "#2563eb"
                      : "#dc2626";
                const statusBg =
                  status === "Present"
                    ? "#14532d"
                    : status === "In School"
                      ? "#1e3a8a"
                      : "#7f1d1d";
                return (
                  <tr
                    key={e.id}
                    style={{
                      background: i % 2 === 0 ? "#111827" : "#0f1117",
                      borderBottom: "1px solid #1f2937",
                    }}
                    data-ocid={`rfid.item.${i + 1}`}
                  >
                    <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                    <td className="px-3 py-2 text-white font-medium whitespace-nowrap">
                      {e.name}
                    </td>
                    <td className="px-3 py-2 text-blue-400">{e.personId}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${e.type === "Student" ? "bg-blue-900/50 text-blue-300" : "bg-purple-900/50 text-purple-300"}`}
                      >
                        {e.type}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-gray-300">
                      {e.className || e.designation || "-"}
                    </td>
                    <td className="px-3 py-2 text-gray-300">{e.date}</td>
                    <td className="px-3 py-2 text-green-400 font-mono">
                      {e.inTime || "-"}
                    </td>
                    <td className="px-3 py-2 text-orange-400 font-mono">
                      {e.outTime || "-"}
                    </td>
                    <td className="px-3 py-2 text-gray-300">{duration}</td>
                    <td className="px-3 py-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-gray-800 text-gray-300">
                        {e.deviceType}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-semibold"
                        style={{ background: statusBg, color: statusColor }}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main Attendance Component ────────────────────────────────────────────────

export function Attendance() {
  const [tab, setTab] = useState<"student" | "staff" | "rfid">("student");
  const [selectedClass, setSelectedClass] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendance, setAttendance] = useState<Record<string, AttStatus>>({});
  const [saved, setSaved] = useState(false);
  const [studentSearch, setStudentSearch] = useState("");
  const [staffSearch, setStaffSearch] = useState("");

  const [allStudents, setAllStudents] = useState<StudentRow[]>([]);
  const [allStaff, setAllStaff] = useState<StaffRow[]>([]);

  // Load from localStorage
  useEffect(() => {
    try {
      const studs = JSON.parse(localStorage.getItem("erp_students") || "[]");
      if (Array.isArray(studs)) {
        setAllStudents(
          studs.map((s: any) => ({
            id: s.id,
            name: s.name,
            admNo: s.admNo,
            className: s.className,
            section: s.section,
            rollNo: s.rollNo,
          })),
        );
        // Set default class on first load (functional update - no stale closure)
        if (studs.length > 0) {
          setSelectedClass(
            (prev: string) =>
              prev || `${studs[0].className}-${studs[0].section}`,
          );
        }
      }
    } catch {
      /* ignore */
    }

    try {
      const staffData = JSON.parse(localStorage.getItem("erp_staff") || "[]");
      if (Array.isArray(staffData)) {
        setAllStaff(
          staffData.map((s: any, i: number) => ({
            id: s.id ?? i + 1,
            name: s.name,
            designation: s.designation,
            status: s.status || "Active",
          })),
        );
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Unique class-section combinations
  const classOptions = useMemo(() => {
    const seen = new Set<string>();
    const opts: string[] = [];
    for (const s of allStudents) {
      const key = `${s.className}-${s.section}`;
      if (!seen.has(key)) {
        seen.add(key);
        opts.push(key);
      }
    }
    return opts.sort();
  }, [allStudents]);

  // Students for selected class, filtered by live search
  const classStudents = useMemo(() => {
    const base = allStudents.filter(
      (s) => `${s.className}-${s.section}` === selectedClass,
    );
    if (!studentSearch.trim()) return base;
    const q = studentSearch.toLowerCase();
    return base.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.admNo.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q),
    );
  }, [allStudents, selectedClass, studentSearch]);

  // Staff filtered by live search
  const filteredStaff = useMemo(() => {
    if (!staffSearch.trim()) return allStaff;
    const q = staffSearch.toLowerCase();
    return allStaff.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.designation.toLowerCase().includes(q),
    );
  }, [allStaff, staffSearch]);

  const setStatus = (name: string, status: AttStatus) => {
    setAttendance((prev) => ({ ...prev, [name]: status }));
  };

  const handleMarkAll = (status: AttStatus) => {
    const list =
      tab === "student"
        ? classStudents.map((s) => s.name)
        : filteredStaff.map((s) => s.name);
    const newAtt: Record<string, AttStatus> = { ...attendance };
    for (const name of list) newAtt[name] = status;
    setAttendance(newAtt);
  };

  const handleSave = () => {
    setSaved(true);
    // Persist attendance
    const key = `att_${tab}_${date}_${selectedClass}`;
    localStorage.setItem(key, JSON.stringify(attendance));
    toast.success("Attendance saved!");
    setTimeout(() => setSaved(false), 2000);
  };

  const presentCount = Object.values(attendance).filter(
    (s) => s === "Present",
  ).length;
  const absentCount = Object.values(attendance).filter(
    (s) => s === "Absent",
  ).length;
  const lateCount = Object.values(attendance).filter(
    (s) => s === "Late",
  ).length;

  return (
    <div>
      <h2 className="text-white text-lg font-semibold mb-4">Attendance</h2>
      <div className="flex gap-1 mb-4 flex-wrap">
        {(["student", "staff", "rfid"] as const).map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => {
              setTab(t);
              setAttendance({});
            }}
            className={`px-4 py-1.5 rounded text-xs font-medium capitalize transition ${
              tab === t
                ? "bg-green-600 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
            data-ocid={`attendance.${t}.tab`}
          >
            {t === "student"
              ? "Student Attendance"
              : t === "staff"
                ? "Staff Attendance"
                : "RFID/Biometric"}
          </button>
        ))}
      </div>

      {tab === "rfid" ? (
        <RFIDTab />
      ) : (
        <>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
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
                data-ocid="attendance.date.input"
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
                  data-ocid="attendance.class.select"
                >
                  <option value="">-- Select Class --</option>
                  {classOptions.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            )}
            {/* Live search */}
            <div className="flex items-center bg-gray-800 border border-gray-700 rounded px-2 py-1.5">
              <Search size={12} className="text-gray-400 mr-1" />
              <input
                value={tab === "student" ? studentSearch : staffSearch}
                onChange={(e) =>
                  tab === "student"
                    ? setStudentSearch(e.target.value)
                    : setStaffSearch(e.target.value)
                }
                placeholder={
                  tab === "student" ? "Search students..." : "Search staff..."
                }
                className="bg-transparent text-gray-300 text-xs outline-none w-32"
                data-ocid="attendance.search_input"
              />
            </div>
            <div className="flex gap-3">
              <span className="text-green-400 text-xs">
                Present: {presentCount}
              </span>
              <span className="text-red-400 text-xs">
                Absent: {absentCount}
              </span>
              <span className="text-yellow-400 text-xs">Late: {lateCount}</span>
            </div>
            <div className="flex gap-1 ml-auto">
              {(["Present", "Absent", "Late"] as AttStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleMarkAll(s)}
                  className={`px-2 py-1 rounded text-[10px] font-medium ${
                    s === "Present"
                      ? "bg-green-700 text-white"
                      : s === "Absent"
                        ? "bg-red-700 text-white"
                        : "bg-yellow-700 text-white"
                  }`}
                >
                  All {s}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg overflow-hidden border border-gray-700">
            <table className="w-full text-xs" data-ocid="attendance.table">
              <thead>
                <tr style={{ background: "#1a1f2e" }}>
                  <th className="text-left px-3 py-2 text-gray-400">#</th>
                  {tab === "student" && (
                    <th className="text-left px-3 py-2 text-gray-400">
                      Adm. No.
                    </th>
                  )}
                  <th className="text-left px-3 py-2 text-gray-400">Name</th>
                  {tab === "student" && (
                    <th className="text-left px-3 py-2 text-gray-400">Roll</th>
                  )}
                  {tab === "staff" && (
                    <th className="text-left px-3 py-2 text-gray-400">
                      Designation
                    </th>
                  )}
                  <th className="text-left px-3 py-2 text-gray-400">Present</th>
                  <th className="text-left px-3 py-2 text-gray-400">Absent</th>
                  <th className="text-left px-3 py-2 text-gray-400">Late</th>
                </tr>
              </thead>
              <tbody>
                {(tab === "student" ? classStudents : filteredStaff).length ===
                0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-3 py-8 text-center text-gray-500"
                      data-ocid="attendance.empty_state"
                    >
                      {tab === "student" && !selectedClass
                        ? "Select a class to take attendance"
                        : "No records found"}
                    </td>
                  </tr>
                ) : (
                  (tab === "student" ? classStudents : filteredStaff).map(
                    (row, i) => (
                      <tr
                        key={row.id}
                        style={{
                          background: i % 2 === 0 ? "#111827" : "#0f1117",
                        }}
                        data-ocid={`attendance.item.${i + 1}`}
                      >
                        <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                        {tab === "student" && (
                          <td className="px-3 py-2 text-blue-400">
                            {(row as StudentRow).admNo}
                          </td>
                        )}
                        <td className="px-3 py-2 text-white">{row.name}</td>
                        {tab === "student" && (
                          <td className="px-3 py-2 text-gray-400">
                            {(row as StudentRow).rollNo}
                          </td>
                        )}
                        {tab === "staff" && (
                          <td className="px-3 py-2 text-gray-400">
                            {(row as StaffRow).designation}
                          </td>
                        )}
                        {(["Present", "Absent", "Late"] as AttStatus[]).map(
                          (status) => (
                            <td key={status} className="px-3 py-2">
                              <input
                                type="radio"
                                name={`att-${row.id}`}
                                value={status}
                                checked={attendance[row.name] === status}
                                onChange={() => setStatus(row.name, status)}
                                className="accent-green-500"
                                data-ocid={`attendance.radio.${i + 1}`}
                              />
                            </td>
                          ),
                        )}
                      </tr>
                    ),
                  )
                )}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="mt-3 bg-green-600 hover:bg-green-700 text-white text-xs px-6 py-2 rounded"
            data-ocid="attendance.submit_button"
          >
            {saved ? "✓ Attendance Saved" : "Save Attendance"}
          </button>
        </>
      )}
    </div>
  );
}
