import {
  ArrowRight,
  Calendar,
  ChevronRight,
  Download,
  FileText,
  GraduationCap,
  MessageSquare,
  Printer,
  Upload,
  UserPlus,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { StudentAdmissionForm } from "./StudentAdmissionForm";

interface Student {
  id: number;
  admNo: string;
  name: string;
  fatherName: string;
  motherName: string;
  className: string;
  section: string;
  rollNo: string;
  dob: string;
  contact: string;
  route: string;
  schNo: string;
  oldBalance: number;
  status: "Active" | "Inactive";
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const SORT_FIELDS = [
  { label: "Admission No.", key: "admNo" },
  { label: "Student Name", key: "name" },
  { label: "Father Name", key: "fatherName" },
  { label: "Class", key: "className" },
  { label: "Roll No.", key: "rollNo" },
  { label: "D.O.B", key: "dob" },
];

const FILTER_FIELDS = ["Admission No.", "Student Name", "Father Name"];

function getFieldValue(s: Student, field: string): string {
  const map: Record<string, string> = {
    "Admission No.": s.admNo,
    "Student Name": s.name,
    "Father Name": s.fatherName,
  };
  return (map[field] || "").toLowerCase();
}

export function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [showAdmissionForm, setShowAdmissionForm] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [highlightedRow, setHighlightedRow] = useState<number | null>(null);
  const [fastSearch, setFastSearch] = useState(false);
  const [showBirthdays, setShowBirthdays] = useState(false);

  // Filter state
  const [filterField1, setFilterField1] = useState("Admission No.");
  const [filterVal1, setFilterVal1] = useState("");
  const [filterField2, setFilterField2] = useState("Student Name");
  const [filterVal2, setFilterVal2] = useState("");
  const [filterField3, setFilterField3] = useState("Father Name");
  const [filterVal3, setFilterVal3] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    f1: "",
    v1: "",
    f2: "",
    v2: "",
    f3: "",
    v3: "",
    month: "",
    birthdays: false,
  });

  // Sort state
  const [sort1Field, setSort1Field] = useState("admNo");
  const [sort1Desc, setSort1Desc] = useState(false);
  const [sort2Field, setSort2Field] = useState("name");
  const [sort2Desc, setSort2Desc] = useState(false);
  const [sort3Field, setSort3Field] = useState("fatherName");
  const [sort3Desc, setSort3Desc] = useState(false);

  const nextId =
    students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 1;

  const applySearch = () => {
    setActiveFilters({
      f1: filterField1,
      v1: filterVal1.toLowerCase(),
      f2: filterField2,
      v2: filterVal2.toLowerCase(),
      f3: filterField3,
      v3: filterVal3.toLowerCase(),
      month: birthMonth,
      birthdays: showBirthdays,
    });
  };

  const filtered = useMemo(() => {
    let list = [...students];
    if (activeFilters.v1)
      list = list.filter((s) =>
        getFieldValue(s, activeFilters.f1).includes(activeFilters.v1),
      );
    if (activeFilters.v2)
      list = list.filter((s) =>
        getFieldValue(s, activeFilters.f2).includes(activeFilters.v2),
      );
    if (activeFilters.v3)
      list = list.filter((s) =>
        getFieldValue(s, activeFilters.f3).includes(activeFilters.v3),
      );
    if (activeFilters.month) {
      const mi = MONTHS.indexOf(activeFilters.month);
      list = list.filter((s) => {
        const parts = s.dob.split("-");
        return parts.length === 3 && Number(parts[1]) - 1 === mi;
      });
    }
    if (activeFilters.birthdays) {
      const curMonth = new Date().getMonth();
      list = list.filter((s) => {
        const parts = s.dob.split("-");
        return parts.length === 3 && Number(parts[1]) - 1 === curMonth;
      });
    }
    return list;
  }, [students, activeFilters]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const getVal = (s: Student, key: string): string =>
        String((s as any)[key] ?? "");
      let cmp = getVal(a, sort1Field).localeCompare(getVal(b, sort1Field));
      if (sort1Desc) cmp = -cmp;
      if (cmp !== 0) return cmp;
      let cmp2 = getVal(a, sort2Field).localeCompare(getVal(b, sort2Field));
      if (sort2Desc) cmp2 = -cmp2;
      if (cmp2 !== 0) return cmp2;
      let cmp3 = getVal(a, sort3Field).localeCompare(getVal(b, sort3Field));
      if (sort3Desc) cmp3 = -cmp3;
      return cmp3;
    });
  }, [
    filtered,
    sort1Field,
    sort1Desc,
    sort2Field,
    sort2Desc,
    sort3Field,
    sort3Desc,
  ]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedRows(new Set(sorted.map((s) => s.id)));
    else setSelectedRows(new Set());
  };

  const handleRowCheck = (id: number, checked: boolean) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleExport = () => {
    const headers = [
      "Adm No",
      "Name",
      "Father",
      "Mother",
      "Class",
      "Section",
      "Roll No",
      "DOB",
      "Contact",
      "Route",
      "Sch No",
      "Old Balance",
    ];
    const rows = sorted.map((s) =>
      [
        s.admNo,
        s.name,
        s.fatherName,
        s.motherName,
        s.className,
        s.section,
        s.rollNo,
        s.dob,
        s.contact,
        s.route,
        s.schNo,
        s.oldBalance,
      ].join(","),
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "students.csv";
    a.click();
    toast.success("Students exported to CSV");
  };

  const handleAdmissionSave = (data: any) => {
    const newStudent: Student = {
      id: nextId,
      admNo: data.admNo || `ADM${String(nextId).padStart(4, "0")}`,
      name: data.name || "",
      fatherName: data.fatherName || "",
      motherName: data.motherName || "",
      className: data.className || "",
      section: data.section || "",
      rollNo: data.rollNo || "",
      dob: data.dob || "",
      contact: data.contact || "",
      route: data.route || "N.A.",
      schNo: data.schNo || "",
      oldBalance: data.oldBalance || 0,
      status: "Active",
    };
    setStudents((prev) => [...prev, newStudent]);
    setShowAdmissionForm(false);
    toast.success("Student admitted successfully!");
  };

  if (showAdmissionForm) {
    return (
      <StudentAdmissionForm
        onCancel={() => setShowAdmissionForm(false)}
        onSave={handleAdmissionSave}
      />
    );
  }

  const allSelected =
    sorted.length > 0 && sorted.every((s) => selectedRows.has(s.id));

  return (
    <div className="text-xs" style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Title Bar */}
      <div
        style={{ background: "#1e3a5f" }}
        className="flex flex-wrap items-center gap-2 px-3 py-2"
      >
        <GraduationCap size={18} className="text-white flex-shrink-0" />
        <span className="text-white font-bold text-sm tracking-wide">
          LIST OF STUDENTS
        </span>
        <label className="flex items-center gap-1 text-white cursor-pointer ml-2">
          <input
            type="checkbox"
            checked={fastSearch}
            onChange={(e) => setFastSearch(e.target.checked)}
            className="w-3 h-3"
          />
          Enable Fast Search
        </label>
        <button
          type="button"
          className="text-red-300 underline hover:text-red-200 ml-2"
          onClick={() =>
            toast.info("Discontinued students feature coming soon")
          }
        >
          List of Discontinued Students
        </button>
        {/* Page nav */}
        <div className="flex items-center gap-1 text-white ml-2">
          <span>Page No:</span>
          {[1, 2, 3, 4, 5].map((p) => (
            <button
              key={p}
              type="button"
              className="px-1 hover:underline text-yellow-300"
            >
              {p}
            </button>
          ))}
          <ChevronRight size={14} />
          <ChevronRight size={14} className="-ml-2" />
        </div>
        {/* Action buttons row */}
        <div className="ml-auto flex flex-wrap gap-1">
          <div className="flex gap-1 flex-wrap">
            <Btn
              label="By Date"
              color="olive"
              onClick={() => toast.info("Coming soon")}
              ocid="students.button"
            />
            <Btn
              label="New"
              color="red"
              icon={<UserPlus size={11} />}
              onClick={() => setShowAdmissionForm(true)}
              ocid="students.primary_button"
            />
            <Btn
              label="Birthdays"
              color="green"
              icon={<Calendar size={11} />}
              onClick={() => {
                setShowBirthdays((prev) => !prev);
                setActiveFilters((prev) => ({
                  ...prev,
                  birthdays: !showBirthdays,
                }));
              }}
              ocid="students.toggle"
            />
            <Btn
              label="Adm. Form"
              color="green"
              icon={<FileText size={11} />}
              onClick={() => toast.info("Coming soon")}
              ocid="students.secondary_button"
            />
            <Btn
              label="ID Card"
              color="green"
              icon={<Printer size={11} />}
              onClick={() => toast.info("Coming soon")}
              ocid="students.button"
            />
            <Btn
              label="List"
              color="green"
              onClick={() => {
                setFilterVal1("");
                setFilterVal2("");
                setFilterVal3("");
                setBirthMonth("");
                setShowBirthdays(false);
                setActiveFilters({
                  f1: filterField1,
                  v1: "",
                  f2: filterField2,
                  v2: "",
                  f3: filterField3,
                  v3: "",
                  month: "",
                  birthdays: false,
                });
              }}
              ocid="students.button"
            />
            <Btn
              label="Close"
              color="grey"
              icon={<X size={11} />}
              onClick={() => {
                setFilterVal1("");
                setFilterVal2("");
                setFilterVal3("");
                setBirthMonth("");
                setShowBirthdays(false);
                setActiveFilters({
                  f1: "",
                  v1: "",
                  f2: "",
                  v2: "",
                  f3: "",
                  v3: "",
                  month: "",
                  birthdays: false,
                });
              }}
              ocid="students.cancel_button"
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            <Btn
              label="Admit Card"
              color="green"
              onClick={() => toast.info("Coming soon")}
              ocid="students.button"
            />
            <Btn
              label="Send SMS"
              color="green"
              icon={<MessageSquare size={11} />}
              onClick={() => toast.info("Coming soon")}
              ocid="students.button"
            />
            <Btn
              label="Export"
              color="green"
              icon={<Download size={11} />}
              onClick={handleExport}
              ocid="students.button"
            />
            <Btn
              label="Import"
              color="green"
              icon={<Upload size={11} />}
              onClick={() => toast.info("Coming soon")}
              ocid="students.upload_button"
            />
          </div>
        </div>
      </div>

      {/* Search / Filter Bar */}
      <div
        style={{ background: "#f0f2f5", borderBottom: "1px solid #d1d5db" }}
        className="flex flex-wrap items-center gap-2 px-3 py-2"
      >
        <select
          value={filterField1}
          onChange={(e) => setFilterField1(e.target.value)}
          className="border border-gray-300 rounded px-1.5 py-1 text-xs bg-white"
          data-ocid="students.select"
        >
          {FILTER_FIELDS.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
        <input
          value={filterVal1}
          onChange={(e) => setFilterVal1(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applySearch()}
          className="border border-gray-300 rounded px-2 py-1 text-xs bg-white w-28"
          placeholder="Search..."
          data-ocid="students.search_input"
        />
        <span className="text-gray-500">|</span>
        <select
          value={filterField2}
          onChange={(e) => setFilterField2(e.target.value)}
          className="border border-gray-300 rounded px-1.5 py-1 text-xs bg-white"
          data-ocid="students.select"
        >
          {FILTER_FIELDS.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
        <input
          value={filterVal2}
          onChange={(e) => setFilterVal2(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applySearch()}
          className="border border-gray-300 rounded px-2 py-1 text-xs bg-white w-28"
          placeholder="Search..."
          data-ocid="students.input"
        />
        <span className="text-gray-500">|</span>
        <select
          value={filterField3}
          onChange={(e) => setFilterField3(e.target.value)}
          className="border border-gray-300 rounded px-1.5 py-1 text-xs bg-white"
          data-ocid="students.select"
        >
          {FILTER_FIELDS.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
        <input
          value={filterVal3}
          onChange={(e) => setFilterVal3(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applySearch()}
          className="border border-gray-300 rounded px-2 py-1 text-xs bg-white w-28"
          placeholder="Search..."
          data-ocid="students.input"
        />
        <span className="text-gray-500">|</span>
        <select
          value={birthMonth}
          onChange={(e) => setBirthMonth(e.target.value)}
          className="border border-gray-300 rounded px-1.5 py-1 text-xs bg-white"
          data-ocid="students.select"
        >
          <option value="">-Birth Month-</option>
          {MONTHS.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={applySearch}
          style={{ background: "#dc2626" }}
          className="text-white px-3 py-1 rounded font-semibold hover:opacity-90"
          data-ocid="students.submit_button"
        >
          Search
        </button>
        <span className="text-gray-500 ml-auto">
          Results: {sorted.length} &nbsp;|&nbsp; Showing: 1 - {sorted.length}
        </span>
      </div>

      {/* Table */}
      <div style={{ background: "#ffffff" }} className="overflow-x-auto">
        <div
          className="flex items-center gap-2 px-3 py-1.5"
          style={{ background: "#f8f9fa", borderBottom: "1px solid #e5e7eb" }}
        >
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="w-3 h-3"
              data-ocid="students.checkbox"
            />
            <span className="text-gray-600">Select All</span>
          </label>
        </div>
        <table
          className="w-full"
          style={{ borderCollapse: "collapse", fontSize: "11px" }}
          data-ocid="students.table"
        >
          <thead>
            <tr
              style={{
                background: "#c6d9f1",
                borderBottom: "2px solid #a8c4e0",
              }}
            >
              {[
                "#",
                "",
                "Adm. No.",
                "Name",
                "Father",
                "Mother",
                "Class",
                "Sec.",
                "Roll No.",
                "D.O.B",
                "Contact No.",
                "Route",
                "Sch. No.",
                "Old Bal",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-2 py-1.5 font-semibold"
                  style={{ color: "#1e3a5f", whiteSpace: "nowrap" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td
                  colSpan={14}
                  className="text-center py-10 text-gray-400"
                  data-ocid="students.empty_state"
                >
                  No students found. Click{" "}
                  <strong style={{ color: "#dc2626" }}>New</strong> to add a
                  student.
                </td>
              </tr>
            ) : (
              sorted.map((s, i) => (
                <tr
                  key={s.id}
                  style={{
                    background:
                      highlightedRow === s.id
                        ? "#fff3cd"
                        : i % 2 === 0
                          ? "#ffffff"
                          : "#e8f0fe",
                    cursor: "pointer",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                  onClick={() =>
                    setHighlightedRow((prev) => (prev === s.id ? null : s.id))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      setHighlightedRow((prev) =>
                        prev === s.id ? null : s.id,
                      );
                  }}
                  tabIndex={0}
                  data-ocid={`students.item.${i + 1}`}
                >
                  <td className="px-2 py-1" style={{ color: "#6b7280" }}>
                    {i + 1}
                  </td>
                  <td
                    className="px-2 py-1"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      className="w-3 h-3"
                      checked={selectedRows.has(s.id)}
                      onChange={(e) => handleRowCheck(s.id, e.target.checked)}
                      data-ocid={`students.checkbox.${i + 1}`}
                    />
                  </td>
                  <td
                    className="px-2 py-1 font-medium"
                    style={{ color: "#1d4ed8" }}
                  >
                    {s.admNo}
                  </td>
                  <td
                    className="px-2 py-1 font-medium"
                    style={{ color: "#111827" }}
                  >
                    {s.name}
                  </td>
                  <td className="px-2 py-1" style={{ color: "#374151" }}>
                    {s.fatherName}
                  </td>
                  <td className="px-2 py-1" style={{ color: "#374151" }}>
                    {s.motherName}
                  </td>
                  <td className="px-2 py-1" style={{ color: "#374151" }}>
                    {s.className}
                  </td>
                  <td className="px-2 py-1" style={{ color: "#374151" }}>
                    {s.section}
                  </td>
                  <td className="px-2 py-1" style={{ color: "#374151" }}>
                    {s.rollNo}
                  </td>
                  <td
                    className="px-2 py-1"
                    style={{ color: "#6b7280", whiteSpace: "nowrap" }}
                  >
                    {s.dob}
                  </td>
                  <td className="px-2 py-1" style={{ color: "#6b7280" }}>
                    {s.contact}
                  </td>
                  <td className="px-2 py-1" style={{ color: "#6b7280" }}>
                    {s.route}
                  </td>
                  <td className="px-2 py-1" style={{ color: "#6b7280" }}>
                    {s.schNo}
                  </td>
                  <td
                    className="px-2 py-1 text-right"
                    style={{ color: s.oldBalance > 0 ? "#dc2626" : "#374151" }}
                  >
                    {s.oldBalance > 0
                      ? `₹${s.oldBalance.toLocaleString("en-IN")}`
                      : "0"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Sort Bar */}
      <div
        style={{
          background: "#f0f2f5",
          borderTop: "2px solid #c6d9f1",
        }}
        className="flex flex-wrap items-center gap-4 px-3 py-2"
      >
        <SortControl
          num={1}
          label="Sort On"
          value={sort1Field}
          desc={sort1Desc}
          onChange={setSort1Field}
          onDescChange={setSort1Desc}
        />
        <SortControl
          num={2}
          label="If 1st is same then Sort By"
          value={sort2Field}
          desc={sort2Desc}
          onChange={setSort2Field}
          onDescChange={setSort2Desc}
        />
        <SortControl
          num={3}
          label="If 2nd is Same, then Sort By"
          value={sort3Field}
          desc={sort3Desc}
          onChange={setSort3Field}
          onDescChange={setSort3Desc}
        />
        <div className="ml-auto">
          <span style={{ color: "#1e3a5f", fontWeight: "bold" }}>
            No. of Student: {students.length}
          </span>
        </div>
      </div>
    </div>
  );
}

// -- Helper Components --

interface BtnProps {
  label: string;
  color: "red" | "green" | "grey" | "olive";
  icon?: React.ReactNode;
  onClick: () => void;
  ocid: string;
}

function Btn({ label, color, icon, onClick, ocid }: BtnProps) {
  const bg =
    color === "red"
      ? "#dc2626"
      : color === "green"
        ? "#16a34a"
        : color === "grey"
          ? "#6b7280"
          : "#78716c";
  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid={ocid}
      style={{ background: bg, fontSize: "11px", whiteSpace: "nowrap" }}
      className="flex items-center gap-1 text-white px-2 py-1 rounded hover:opacity-90 font-medium"
    >
      {icon}
      {label}
    </button>
  );
}

interface SortControlProps {
  num: number;
  label: string;
  value: string;
  desc: boolean;
  onChange: (v: string) => void;
  onDescChange: (v: boolean) => void;
}

function SortControl({
  num,
  label,
  value,
  desc,
  onChange,
  onDescChange,
}: SortControlProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        style={{
          background: "#1e3a5f",
          color: "white",
          borderRadius: "50%",
          width: "18px",
          height: "18px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "10px",
          fontWeight: "bold",
          flexShrink: 0,
        }}
      >
        {num}
      </span>
      <span className="text-gray-600 hidden sm:inline">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded px-1.5 py-0.5 text-xs bg-white"
      >
        {SORT_FIELDS.map((f) => (
          <option key={f.key} value={f.key}>
            {f.label}
          </option>
        ))}
      </select>
      <label className="flex items-center gap-1 cursor-pointer text-gray-600">
        <input
          type="checkbox"
          checked={desc}
          onChange={(e) => onDescChange(e.target.checked)}
          className="w-3 h-3"
        />
        <ArrowRight size={10} className="rotate-180" />
        Z→A
      </label>
    </div>
  );
}
