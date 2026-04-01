import {
  Calendar,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Plus,
  Printer,
  ScrollText,
  Search,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

interface FeeRecord {
  id: number;
  receiptNo: string;
  studentName: string;
  className: string;
  feeType: string;
  amount: number;
  paymentMode: string;
  date: string;
  status: "Paid" | "Pending" | "Due";
}

const initialFees: FeeRecord[] = [];

const _feeTypes = [
  "Tuition Fee",
  "Exam Fee",
  "Transport Fee",
  "Library Fee",
  "Sports Fee",
  "Laboratory Fee",
  "Annual Fee",
];
const _paymentModes = ["Cash", "Online", "Cheque", "DD"];
const _students = [
  "Aarav Sharma",
  "Priya Patel",
  "Rohit Kumar",
  "Ananya Singh",
  "Vikram Joshi",
  "Neha Gupta",
  "Arjun Verma",
  "Kavya Nair",
  "Ravi Mehta",
  "Shreya Agarwal",
];

const ALL_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const SCHOOL_MONTHS = [
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "Jan",
  "Feb",
  "Mar",
];

const RECEIPT_STUDENTS = [
  {
    admNo: "ADM-001",
    name: "Aarav Sharma",
    fatherName: "Ramesh Sharma",
    motherName: "Sunita Sharma",
    className: "Class 10-A",
    rollNo: "05",
    contact: "9876543210",
    city: "Delhi",
    category: "General",
    route: "Route 1",
    oldBalance: 0,
  },
  {
    admNo: "ADM-002",
    name: "Priya Patel",
    fatherName: "Suresh Patel",
    motherName: "Kavita Patel",
    className: "Class 7-B",
    rollNo: "12",
    contact: "9812345678",
    city: "Mumbai",
    category: "OBC",
    route: "Route 2",
    oldBalance: 500,
  },
  {
    admNo: "ADM-003",
    name: "Rohit Kumar",
    fatherName: "Mohan Kumar",
    motherName: "Geeta Kumar",
    className: "Class 5-C",
    rollNo: "03",
    contact: "9887654321",
    city: "Jaipur",
    category: "SC",
    route: "Route 3",
    oldBalance: 0,
  },
];

const SAMPLE_FEE_TYPES = [
  { type: "Tuition Fee", amount: 1500 },
  { type: "Exam Fee", amount: 200 },
  { type: "Library Fee", amount: 100 },
  { type: "Sports Fee", amount: 150 },
  { type: "Laboratory Fee", amount: 300 },
];

interface FeeHeading {
  id: number;
  heading: string;
  group: string;
  account: string;
  frequency: string;
  months: string[];
}

const initialHeadings: FeeHeading[] = [
  {
    id: 1,
    heading: "Admission Fee",
    group: "General",
    account: "Admission Fees",
    frequency: "Annual",
    months: [],
  },
  {
    id: 2,
    heading: "Computer Fee/P.C.",
    group: "General",
    account: "Computer",
    frequency: "Annual",
    months: [],
  },
  {
    id: 3,
    heading: "Development Charge",
    group: "General",
    account: "Vikas Shulk",
    frequency: "Annual",
    months: ["Aug", "Sep"],
  },
  {
    id: 4,
    heading: "Exam Fee",
    group: "General",
    account: "Examination",
    frequency: "Four Monthly",
    months: ["Mar", "Jul", "Oct"],
  },
  {
    id: 5,
    heading: "Mar",
    group: "General",
    account: "old year",
    frequency: "Annual",
    months: [],
  },
  {
    id: 6,
    heading: "Monthly Fee",
    group: "General",
    account: "Tuition Fees",
    frequency: "Monthly",
    months: [...ALL_MONTHS],
  },
  {
    id: 7,
    heading: "Progress card",
    group: "General",
    account: "TDS",
    frequency: "Annual",
    months: ["Apr"],
  },
];

interface FeePlan {
  id: number;
  className: string;
  category: string;
  feesHead: string;
  value: number;
}

const initialPlans: FeePlan[] = [
  {
    id: 1,
    className: "10th",
    category: "English New Student",
    feesHead: "Admission Fee",
    value: 600,
  },
  {
    id: 2,
    className: "10th",
    category: "English New Student",
    feesHead: "Computer Fee/P.C.",
    value: 600,
  },
  {
    id: 3,
    className: "10th",
    category: "English New Student",
    feesHead: "Development Charge",
    value: 300,
  },
  {
    id: 4,
    className: "10th",
    category: "English New Student",
    feesHead: "Exam Fee",
    value: 200,
  },
  {
    id: 5,
    className: "10th",
    category: "English Old Student",
    feesHead: "Development Charge",
    value: 300,
  },
  {
    id: 6,
    className: "10th",
    category: "English Old Student",
    feesHead: "Exam Fee",
    value: 200,
  },
  {
    id: 7,
    className: "10th",
    category: "New Student",
    feesHead: "Admission Fee",
    value: 200,
  },
  {
    id: 8,
    className: "10th",
    category: "New Student",
    feesHead: "Development Charge",
    value: 300,
  },
  {
    id: 9,
    className: "10th",
    category: "New Student",
    feesHead: "Exam Fee",
    value: 200,
  },
  {
    id: 10,
    className: "10th",
    category: "New Student",
    feesHead: "Monthly Fee",
    value: 400,
  },
  {
    id: 11,
    className: "10th",
    category: "Old Student",
    feesHead: "Development Charge",
    value: 300,
  },
  {
    id: 12,
    className: "10th",
    category: "Old Student",
    feesHead: "Exam Fee",
    value: 200,
  },
  {
    id: 13,
    className: "9th",
    category: "New Student",
    feesHead: "Admission Fee",
    value: 200,
  },
  {
    id: 14,
    className: "9th",
    category: "New Student",
    feesHead: "Monthly Fee",
    value: 380,
  },
  {
    id: 15,
    className: "9th",
    category: "Old Student",
    feesHead: "Monthly Fee",
    value: 350,
  },
];

const CLASS_LIST = [
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "6th",
  "7th",
  "8th",
  "9th",
  "10th",
  "11th",
  "12th",
];
const CATEGORIES = [
  "English New Student",
  "English Old Student",
  "New Student",
  "Old Student",
];
const GROUPS = ["General", "Transport", "Sports", "Lab"];
const ACCOUNTS = [
  "Admission Fees",
  "Tuition Fees",
  "Computer",
  "Vikas Shulk",
  "Examination",
  "TDS",
  "old year",
];
const FREQUENCIES = [
  "Annual",
  "Monthly",
  "Quarterly",
  "Four Monthly",
  "Half Yearly",
];

function fmt(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function today() {
  return new Date().toISOString().split("T")[0];
}

export function Fees() {
  const [tab, setTab] = useState<
    "collect" | "search" | "due" | "master" | "plan"
  >("collect");
  const [fees, setFees] = useState<FeeRecord[]>(initialFees);
  const [search, setSearch] = useState("");

  // ── COLLECT (Fees Receipt) state ──
  const [rcpDate, setRcpDate] = useState(today());
  const [rcpNo] = useState("RCP-007");
  const [admNo, setAdmNo] = useState("");
  const [studentIdx, setStudentIdx] = useState(0);
  const student = RECEIPT_STUDENTS[studentIdx];
  const [_selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [pendingMonths, setPendingMonths] = useState<string[]>([]);
  const [selectAllMonths, setSelectAllMonths] = useState(false);
  interface FeeRow {
    id: number;
    feeType: string;
    amount: number;
    dueMonth: string;
    remarks: string;
  }
  const [feeRows, setFeeRows] = useState<FeeRow[]>([]);
  const [concessionPct, setConcessionPct] = useState(0);
  const [receiptAmt, setReceiptAmt] = useState("");
  const [remarks, setRemarks] = useState("");
  const [saved, setSaved] = useState(false);

  const totalFees = feeRows.reduce((s, r) => s + r.amount, 0);
  const lateFees = 0;
  const concessionAmt = Math.round((totalFees * concessionPct) / 100);
  const netFees = totalFees - concessionAmt + lateFees;
  const rcptAmt = Number(receiptAmt) || 0;
  const balanceAmt = netFees - rcptAmt;

  const togglePendingMonth = (m: string) => {
    setPendingMonths((p) => {
      const next = p.includes(m) ? p.filter((x) => x !== m) : [...p, m];
      setSelectAllMonths(next.length === SCHOOL_MONTHS.length);
      return next;
    });
  };

  const handleSelectAllMonths = () => {
    if (selectAllMonths) {
      setPendingMonths([]);
      setSelectAllMonths(false);
    } else {
      setPendingMonths([...SCHOOL_MONTHS]);
      setSelectAllMonths(true);
    }
  };

  const handleMonthsOk = () => {
    setSelectedMonths(pendingMonths);
    const rows: FeeRow[] = [];
    let id = 1;
    for (const month of pendingMonths) {
      for (const ft of SAMPLE_FEE_TYPES) {
        rows.push({
          id: id++,
          feeType: ft.type,
          amount: ft.amount,
          dueMonth: month,
          remarks: "",
        });
      }
    }
    setFeeRows(rows);
  };

  const handleNew = () => {
    setAdmNo("");
    setPendingMonths([]);
    setSelectedMonths([]);
    setSelectAllMonths(false);
    setFeeRows([]);
    setConcessionPct(0);
    setReceiptAmt("");
    setRemarks("");
  };

  const handleSave = () => {
    if (feeRows.length === 0) return;
    const id = fees.length + 1;
    fees.push({
      id,
      receiptNo: `RCP-${String(id).padStart(3, "0")}`,
      studentName: student.name,
      className: student.className,
      feeType: feeRows[0].feeType,
      amount: rcptAmt || netFees,
      paymentMode: "Cash",
      date: rcpDate,
      status: "Paid",
    });
    setFees([...fees]);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Master tab state
  const [headings, setHeadings] = useState<FeeHeading[]>(initialHeadings);
  const [selectedHeading, setSelectedHeading] = useState<FeeHeading | null>(
    null,
  );
  const [masterForm, setMasterForm] = useState({
    heading: "",
    group: "General",
    account: "Admission Fees",
    frequency: "Annual",
    months: [] as string[],
  });

  // Plan tab state
  const [plans, setPlans] = useState<FeePlan[]>(initialPlans);
  const [selectedPlan, setSelectedPlan] = useState<FeePlan | null>(null);
  const [planForm, setPlanForm] = useState({
    feesHead: "Admission Fee",
    value: "",
    classes: [] as string[],
    categories: [] as string[],
    selectAll: false,
  });

  const filtered = fees.filter(
    (f) =>
      f.studentName.toLowerCase().includes(search.toLowerCase()) ||
      f.receiptNo.toLowerCase().includes(search.toLowerCase()),
  );
  const due = fees.filter((f) => f.status !== "Paid");

  const toggleMonth = (month: string) => {
    setMasterForm((p) => ({
      ...p,
      months: p.months.includes(month)
        ? p.months.filter((m) => m !== month)
        : [...p.months, month],
    }));
  };

  const addHeading = () => {
    if (!masterForm.heading.trim()) return;
    setHeadings((p) => [
      ...p,
      {
        id: headings.length + 1,
        heading: masterForm.heading,
        group: masterForm.group,
        account: masterForm.account,
        frequency: masterForm.frequency,
        months: masterForm.months,
      },
    ]);
    setMasterForm({
      heading: "",
      group: "General",
      account: "Admission Fees",
      frequency: "Annual",
      months: [],
    });
  };

  const deleteHeading = () => {
    if (!selectedHeading) return;
    setHeadings((p) => p.filter((h) => h.id !== selectedHeading.id));
    setSelectedHeading(null);
  };

  const savePlan = () => {
    if (
      !planForm.feesHead ||
      !planForm.value ||
      planForm.classes.length === 0 ||
      planForm.categories.length === 0
    )
      return;
    let nextId = plans.length + 1;
    const newRows: FeePlan[] = [];
    for (const cls of planForm.classes) {
      for (const cat of planForm.categories) {
        newRows.push({
          id: nextId++,
          className: cls,
          category: cat,
          feesHead: planForm.feesHead,
          value: Number(planForm.value),
        });
      }
    }
    setPlans((p) => [...p, ...newRows]);
    setPlanForm((p) => ({
      ...p,
      value: "",
      classes: [],
      categories: [],
      selectAll: false,
    }));
  };

  const deletePlan = () => {
    if (!selectedPlan) return;
    setPlans((p) => p.filter((r) => r.id !== selectedPlan.id));
    setSelectedPlan(null);
  };

  const toggleClass = (cls: string) => {
    setPlanForm((p) => {
      const next = p.classes.includes(cls)
        ? p.classes.filter((c) => c !== cls)
        : [...p.classes, cls];
      return {
        ...p,
        classes: next,
        selectAll: next.length === CLASS_LIST.length,
      };
    });
  };

  const toggleCategory = (cat: string) => {
    setPlanForm((p) => ({
      ...p,
      categories: p.categories.includes(cat)
        ? p.categories.filter((c) => c !== cat)
        : [...p.categories, cat],
    }));
  };

  const toggleSelectAll = () => {
    setPlanForm((p) => ({
      ...p,
      selectAll: !p.selectAll,
      classes: !p.selectAll ? [...CLASS_LIST] : [],
    }));
  };

  const tabLabel = (t: string) => {
    if (t === "collect") return "Collect Fees";
    if (t === "search") return "Search Fees";
    if (t === "due") return "Due Fees";
    if (t === "master") return "Fees Master";
    if (t === "plan") return "Fees Plan";
    return t;
  };

  const inputCls =
    "bg-gray-900 border border-gray-600 rounded px-2 py-1 text-white text-xs outline-none focus:border-blue-500 w-full";
  const labelCls = "text-gray-400 text-[10px] block mb-0.5";

  return (
    <div>
      <h2 className="text-white text-lg font-semibold mb-4">Fees Collection</h2>
      <div className="flex flex-wrap gap-1 mb-4">
        {(["collect", "search", "due", "master", "plan"] as const).map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setTab(t)}
            data-ocid={`fees.${t}.tab`}
            className={`px-4 py-1.5 rounded text-xs font-medium capitalize transition ${
              tab === t
                ? "bg-green-600 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            {tabLabel(t)}
          </button>
        ))}
      </div>

      {/* ── COLLECT TAB (Fees Receipt) ── */}
      {tab === "collect" && (
        <div
          style={{
            background: "#0f1117",
            border: "1px solid #374151",
            borderRadius: 8,
          }}
        >
          {/* Header bar */}
          <div
            style={{
              background: "#1a1f2e",
              borderBottom: "1px solid #374151",
              borderRadius: "8px 8px 0 0",
            }}
            className="px-4 py-2"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-bold text-sm tracking-wider">
                FEES RECEIPT
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleNew}
                  data-ocid="collect.new.button"
                  className="border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 text-xs px-3 py-1 rounded transition"
                >
                  New
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  data-ocid="collect.print.button"
                  className="border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 text-xs px-3 py-1 rounded transition flex items-center gap-1"
                >
                  <Printer size={11} /> Print
                </button>
                <button
                  type="button"
                  data-ocid="collect.delete.button"
                  className="border border-red-800 text-red-400 hover:text-red-300 text-xs px-3 py-1 rounded transition flex items-center gap-1"
                >
                  <Trash2 size={11} /> Delete
                </button>
                <button
                  type="button"
                  data-ocid="collect.close.button"
                  className="border border-gray-600 text-gray-300 hover:text-white text-xs px-3 py-1 rounded transition flex items-center gap-1"
                >
                  <X size={11} /> Close
                </button>
              </div>
            </div>
            {/* Sub-header row */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5">
                <label htmlFor="rcp-date" className="text-gray-400 text-xs">
                  Date
                </label>
                <input
                  id="rcp-date"
                  type="date"
                  value={rcpDate}
                  onChange={(e) => setRcpDate(e.target.value)}
                  className="bg-gray-800 border border-gray-600 rounded px-2 py-0.5 text-white text-xs outline-none"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <label htmlFor="rcp-no" className="text-gray-400 text-xs">
                  Receipt No
                </label>
                <input
                  id="rcp-no"
                  type="text"
                  value={rcpNo}
                  readOnly
                  className="bg-gray-800 border border-gray-600 rounded px-2 py-0.5 text-white text-xs outline-none w-24"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <label htmlFor="adm-no" className="text-gray-400 text-xs">
                  Admission No
                </label>
                <input
                  id="adm-no"
                  type="text"
                  value={admNo}
                  onChange={(e) => setAdmNo(e.target.value)}
                  placeholder="{F4 - Search}"
                  data-ocid="collect.admno.input"
                  className="bg-gray-800 border border-gray-600 rounded px-2 py-0.5 text-white text-xs outline-none w-36 placeholder-gray-600"
                />
              </div>
              <div className="ml-auto flex items-center gap-3">
                <button
                  type="button"
                  className="text-blue-400 hover:text-blue-300 text-xs underline"
                >
                  Fees Card
                </button>
                <button
                  type="button"
                  className="text-blue-400 hover:text-blue-300 text-xs underline"
                >
                  Ledger
                </button>
              </div>
            </div>
          </div>

          {/* Main body */}
          <div className="flex gap-0" style={{ minHeight: 320 }}>
            {/* Left: photo + student info */}
            <div
              className="flex gap-3 p-3 flex-1"
              style={{ borderRight: "1px solid #374151" }}
            >
              {/* Photo */}
              <div className="flex-shrink-0">
                <div
                  style={{
                    width: 72,
                    height: 80,
                    background: "#374151",
                    border: "1px solid #4B5563",
                    borderRadius: 4,
                  }}
                  className="flex flex-col items-center justify-center gap-1"
                >
                  <User size={28} className="text-gray-500" />
                  <span className="text-gray-600 text-[9px]">Photo</span>
                </div>
              </div>
              {/* Student info grid */}
              <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-1.5">
                <div>
                  <label htmlFor="s-name" className={labelCls}>
                    Student Name
                  </label>
                  <input
                    id="s-name"
                    type="text"
                    value={student.name}
                    readOnly
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="s-class" className={labelCls}>
                    Class Name
                  </label>
                  <input
                    id="s-class"
                    type="text"
                    value={student.className}
                    readOnly
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="s-father" className={labelCls}>
                    Father&apos;s Name
                  </label>
                  <input
                    id="s-father"
                    type="text"
                    value={student.fatherName}
                    readOnly
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="s-roll" className={labelCls}>
                    Roll No.
                  </label>
                  <input
                    id="s-roll"
                    type="text"
                    value={student.rollNo}
                    readOnly
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="s-mother" className={labelCls}>
                    Mother Name
                  </label>
                  <input
                    id="s-mother"
                    type="text"
                    value={student.motherName}
                    readOnly
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="s-contact" className={labelCls}>
                    Contact No.
                  </label>
                  <input
                    id="s-contact"
                    type="text"
                    value={student.contact}
                    readOnly
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="s-category" className={labelCls}>
                    Category
                  </label>
                  <input
                    id="s-category"
                    type="text"
                    value={student.category}
                    readOnly
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="s-city" className={labelCls}>
                    Village/City
                  </label>
                  <input
                    id="s-city"
                    type="text"
                    value={student.city}
                    readOnly
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="s-route" className={labelCls}>
                    Route
                  </label>
                  <input
                    id="s-route"
                    type="text"
                    value={student.route}
                    readOnly
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="s-oldbal" className={labelCls}>
                    Old Balance (₹)
                  </label>
                  <input
                    id="s-oldbal"
                    type="text"
                    value={fmt(student.oldBalance)}
                    readOnly
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            {/* Right: Month selector */}
            <div
              className="flex-shrink-0 p-3"
              style={{ width: 140, borderLeft: "1px solid #374151" }}
            >
              <p className="text-gray-400 text-[10px] font-medium mb-2">
                Month
              </p>
              <label className="flex items-center gap-1.5 mb-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectAllMonths}
                  onChange={handleSelectAllMonths}
                  className="accent-blue-500 w-3 h-3"
                />
                <span className="text-gray-300 text-[11px]">Select All</span>
              </label>
              <div className="space-y-0.5 mb-2">
                {SCHOOL_MONTHS.map((m) => (
                  <label
                    key={m}
                    className="flex items-center gap-1.5 px-1 py-0.5 cursor-pointer hover:bg-gray-800 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={pendingMonths.includes(m)}
                      onChange={() => togglePendingMonth(m)}
                      className="accent-blue-500 w-3 h-3"
                    />
                    <span className="text-gray-300 text-[11px]">{m}</span>
                  </label>
                ))}
              </div>
              <button
                type="button"
                onClick={handleMonthsOk}
                data-ocid="collect.months.primary_button"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 rounded font-medium"
              >
                OK
              </button>
            </div>
          </div>

          {/* Fee rows table */}
          <div
            style={{
              borderTop: "1px solid #374151",
              borderBottom: "1px solid #374151",
            }}
          >
            <div
              className="overflow-x-auto"
              style={{ maxHeight: 220, overflowY: "auto" }}
            >
              <table className="w-full text-xs">
                <thead
                  style={{ background: "#1a1f2e", position: "sticky", top: 0 }}
                >
                  <tr>
                    <th className="text-left px-3 py-1.5 text-gray-400 font-medium w-8">
                      #
                    </th>
                    <th className="text-left px-3 py-1.5 text-gray-400 font-medium">
                      Fee Type
                    </th>
                    <th className="text-left px-3 py-1.5 text-gray-400 font-medium">
                      Amount
                    </th>
                    <th className="text-left px-3 py-1.5 text-gray-400 font-medium">
                      Due Month
                    </th>
                    <th className="text-left px-3 py-1.5 text-gray-400 font-medium">
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {feeRows.length === 0
                    ? Array.from({ length: 8 }, (_, i) => i).map((i) => (
                        <tr
                          key={`empty-${i}`}
                          style={{
                            background: i % 2 === 0 ? "#111827" : "#0f1117",
                          }}
                        >
                          <td className="px-3 py-1.5 text-gray-700">{i + 1}</td>
                          <td className="px-3 py-1.5 text-gray-700">—</td>
                          <td className="px-3 py-1.5 text-gray-700">—</td>
                          <td className="px-3 py-1.5 text-gray-700">—</td>
                          <td className="px-3 py-1.5 text-gray-700">—</td>
                        </tr>
                      ))
                    : feeRows.map((row, i) => (
                        <tr
                          key={row.id}
                          data-ocid={`collect.fee.item.${i + 1}`}
                          style={{
                            background: i % 2 === 0 ? "#111827" : "#0f1117",
                          }}
                        >
                          <td className="px-3 py-1.5 text-gray-400">{i + 1}</td>
                          <td className="px-3 py-1.5 text-white">
                            {row.feeType}
                          </td>
                          <td className="px-3 py-1.5 text-green-400">
                            {fmt(row.amount)}
                          </td>
                          <td className="px-3 py-1.5 text-gray-300">
                            {row.dueMonth}
                          </td>
                          <td className="px-3 py-1.5 text-gray-500">
                            {row.remarks || "—"}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary bar */}
          <div
            style={{ background: "#1a1f2e", borderBottom: "1px solid #374151" }}
            className="px-3 py-2"
          >
            <div className="flex items-center gap-3 flex-wrap">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" className="accent-blue-500 w-3 h-3" />
                <span className="text-gray-400 text-[10px]">Select All</span>
              </label>
              <div className="flex items-center gap-1">
                <span className="text-gray-500 text-[10px]">Total Fees</span>
                <input
                  type="text"
                  readOnly
                  value={fmt(totalFees)}
                  className="bg-gray-900 border border-gray-700 rounded px-1.5 py-0.5 text-white text-xs w-24 text-right"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-500 text-[10px]">Late Fees</span>
                <input
                  type="text"
                  readOnly
                  value={fmt(lateFees)}
                  className="bg-gray-900 border border-gray-700 rounded px-1.5 py-0.5 text-white text-xs w-16 text-right"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-500 text-[10px]">Concession %</span>
                <input
                  type="number"
                  value={concessionPct}
                  min={0}
                  max={100}
                  onChange={(e) => setConcessionPct(Number(e.target.value))}
                  data-ocid="collect.concession.input"
                  className="bg-gray-900 border border-blue-700 rounded px-1.5 py-0.5 text-white text-xs w-14 text-right outline-none"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-500 text-[10px]">
                  Concession Amt
                </span>
                <input
                  type="text"
                  readOnly
                  value={fmt(concessionAmt)}
                  className="bg-gray-900 border border-gray-700 rounded px-1.5 py-0.5 text-white text-xs w-20 text-right"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-500 text-[10px]">Net Fees</span>
                <input
                  type="text"
                  readOnly
                  value={fmt(netFees)}
                  className="bg-gray-900 border border-gray-700 rounded px-1.5 py-0.5 text-green-400 text-xs w-24 text-right font-medium"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-500 text-[10px]">Receipt Amt</span>
                <input
                  type="number"
                  value={receiptAmt}
                  onChange={(e) => setReceiptAmt(e.target.value)}
                  placeholder="0"
                  data-ocid="collect.receiptamt.input"
                  className="bg-gray-900 border border-green-700 rounded px-1.5 py-0.5 text-white text-xs w-24 outline-none"
                />
                <button
                  type="button"
                  className="bg-green-700 hover:bg-green-600 text-white rounded w-5 h-5 flex items-center justify-center flex-shrink-0"
                >
                  <Plus size={10} />
                </button>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-500 text-[10px]">Balance Amt</span>
                <input
                  type="text"
                  readOnly
                  value={fmt(balanceAmt)}
                  className={`bg-gray-900 border border-gray-700 rounded px-1.5 py-0.5 text-xs w-24 text-right ${balanceAmt > 0 ? "text-red-400" : "text-green-400"}`}
                />
              </div>
            </div>
          </div>

          {/* Bottom action bar */}
          <div className="px-3 py-2">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Navigation */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setStudentIdx(0)}
                  disabled={studentIdx === 0}
                  data-ocid="collect.nav.pagination_prev"
                  className="border border-gray-700 text-gray-400 hover:text-white disabled:opacity-30 rounded p-1 transition"
                >
                  <ChevronFirst size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => setStudentIdx((p) => Math.max(0, p - 1))}
                  disabled={studentIdx === 0}
                  className="border border-gray-700 text-gray-400 hover:text-white disabled:opacity-30 rounded p-1 transition"
                >
                  <ChevronLeft size={12} />
                </button>
                <span className="text-gray-500 text-[10px] px-1">
                  {studentIdx + 1}/{RECEIPT_STUDENTS.length}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setStudentIdx((p) =>
                      Math.min(RECEIPT_STUDENTS.length - 1, p + 1),
                    )
                  }
                  disabled={studentIdx === RECEIPT_STUDENTS.length - 1}
                  className="border border-gray-700 text-gray-400 hover:text-white disabled:opacity-30 rounded p-1 transition"
                >
                  <ChevronRight size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => setStudentIdx(RECEIPT_STUDENTS.length - 1)}
                  disabled={studentIdx === RECEIPT_STUDENTS.length - 1}
                  data-ocid="collect.nav.pagination_next"
                  className="border border-gray-700 text-gray-400 hover:text-white disabled:opacity-30 rounded p-1 transition"
                >
                  <ChevronLast size={12} />
                </button>
              </div>
              {/* Remarks */}
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g. Reason for concession"
                data-ocid="collect.remarks.input"
                className="flex-1 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-white text-xs outline-none focus:border-blue-500 min-w-40"
              />
              {/* Save */}
              <button
                type="button"
                onClick={handleSave}
                data-ocid="collect.save.primary_button"
                className="bg-green-600 hover:bg-green-700 text-white text-xs px-5 py-1.5 rounded font-medium transition"
              >
                {saved ? "✓ Saved" : "Save / Collect"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SEARCH TAB ── */}
      {tab === "search" && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center bg-gray-800 border border-gray-700 rounded px-2 py-1.5 flex-1 max-w-xs">
              <Search size={14} className="text-gray-400 mr-1" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or receipt..."
                className="bg-transparent text-gray-300 text-xs outline-none w-full"
              />
            </div>
          </div>
          <div className="rounded-lg overflow-hidden border border-gray-700">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: "#1a1f2e" }}>
                  {[
                    "Receipt No",
                    "Student",
                    "Class",
                    "Fee Type",
                    "Amount",
                    "Mode",
                    "Date",
                    "Status",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-3 py-2 text-gray-400 font-medium"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((f, i) => (
                  <tr
                    key={f.id}
                    style={{ background: i % 2 === 0 ? "#111827" : "#0f1117" }}
                  >
                    <td className="px-3 py-2 text-blue-400">{f.receiptNo}</td>
                    <td className="px-3 py-2 text-white">{f.studentName}</td>
                    <td className="px-3 py-2 text-gray-300">{f.className}</td>
                    <td className="px-3 py-2 text-gray-300">{f.feeType}</td>
                    <td className="px-3 py-2 text-green-400">
                      ₹{f.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-3 py-2 text-gray-400">
                      {f.paymentMode || "-"}
                    </td>
                    <td className="px-3 py-2 text-gray-400">{f.date || "-"}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] ${f.status === "Paid" ? "bg-green-900/50 text-green-400" : f.status === "Pending" ? "bg-yellow-900/50 text-yellow-400" : "bg-red-900/50 text-red-400"}`}
                      >
                        {f.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── DUE TAB ── */}
      {tab === "due" && (
        <div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div
              className="rounded-lg p-3"
              style={{ background: "#1a1f2e", border: "1px solid #374151" }}
            >
              <p className="text-gray-400 text-xs">Due/Pending Students</p>
              <p className="text-red-400 text-2xl font-bold">{due.length}</p>
            </div>
            <div
              className="rounded-lg p-3"
              style={{ background: "#1a1f2e", border: "1px solid #374151" }}
            >
              <p className="text-gray-400 text-xs">Due Amount</p>
              <p className="text-yellow-400 text-2xl font-bold">
                ₹{due.reduce((s, f) => s + f.amount, 0).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden border border-gray-700">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: "#1a1f2e" }}>
                  {[
                    "Student",
                    "Class",
                    "Fee Type",
                    "Amount",
                    "Status",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-3 py-2 text-gray-400 font-medium"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {due.map((f, i) => (
                  <tr
                    key={f.id}
                    style={{ background: i % 2 === 0 ? "#111827" : "#0f1117" }}
                  >
                    <td className="px-3 py-2 text-white">{f.studentName}</td>
                    <td className="px-3 py-2 text-gray-300">{f.className}</td>
                    <td className="px-3 py-2 text-gray-300">{f.feeType}</td>
                    <td className="px-3 py-2 text-red-400">
                      ₹{f.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] ${f.status === "Pending" ? "bg-yellow-900/50 text-yellow-400" : "bg-red-900/50 text-red-400"}`}
                      >
                        {f.status}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => setTab("collect")}
                        className="bg-green-700 hover:bg-green-600 text-white px-2 py-0.5 rounded text-[10px]"
                      >
                        Collect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── FEES MASTER TAB ── */}
      {tab === "master" && (
        <div>
          <div
            className="rounded-lg p-4 mb-4"
            style={{ background: "#1a1f2e", border: "1px solid #374151" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={15} className="text-blue-400" />
              <h3 className="text-white text-xs font-bold tracking-widest uppercase">
                Create Fees Heading
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="master-heading"
                  className="text-gray-400 text-xs w-28 shrink-0"
                >
                  Fees Heading
                </label>
                <input
                  id="master-heading"
                  type="text"
                  value={masterForm.heading}
                  onChange={(e) =>
                    setMasterForm((p) => ({ ...p, heading: e.target.value }))
                  }
                  placeholder="Enter fees heading"
                  data-ocid="master.heading.input"
                  className="flex-1 bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="master-group"
                  className="text-gray-400 text-xs w-28 shrink-0"
                >
                  Group Name
                </label>
                <select
                  id="master-group"
                  value={masterForm.group}
                  onChange={(e) =>
                    setMasterForm((p) => ({ ...p, group: e.target.value }))
                  }
                  data-ocid="master.group.select"
                  className="w-36 bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none"
                >
                  {GROUPS.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
                <label
                  htmlFor="master-account"
                  className="text-gray-400 text-xs ml-2 shrink-0"
                >
                  Account Name
                </label>
                <select
                  id="master-account"
                  value={masterForm.account}
                  onChange={(e) =>
                    setMasterForm((p) => ({ ...p, account: e.target.value }))
                  }
                  data-ocid="master.account.select"
                  className="w-36 bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none"
                >
                  {ACCOUNTS.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="master-frequency"
                  className="text-gray-400 text-xs w-28 shrink-0"
                >
                  Frequency
                </label>
                <select
                  id="master-frequency"
                  value={masterForm.frequency}
                  onChange={(e) =>
                    setMasterForm((p) => ({ ...p, frequency: e.target.value }))
                  }
                  data-ocid="master.frequency.select"
                  className="w-44 bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none"
                >
                  {FREQUENCIES.map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </select>
              </div>
              <div className="mt-2">
                <p className="text-orange-400 text-[11px] italic mb-2">
                  Select Months in which this fees becomes due towards student
                </p>
                <div className="grid grid-cols-4 gap-0 rounded overflow-hidden border border-gray-700">
                  {ALL_MONTHS.map((month, idx) => (
                    <label
                      key={month}
                      className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer text-xs ${Math.floor(idx / 4) % 2 === 0 ? "bg-gray-800/60" : "bg-gray-700/30"}`}
                    >
                      <input
                        type="checkbox"
                        checked={masterForm.months.includes(month)}
                        onChange={() => toggleMonth(month)}
                        className="accent-blue-500 w-3 h-3"
                      />
                      <span className="text-gray-300">{month}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={addHeading}
                  data-ocid="master.heading.primary_button"
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-1.5 rounded font-medium"
                >
                  <Plus size={13} /> New
                </button>
              </div>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden border border-gray-700 mb-1">
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-max">
                <thead>
                  <tr style={{ background: "#1a1f2e" }}>
                    <th className="text-left px-2 py-2 text-gray-400 font-medium w-8">
                      #
                    </th>
                    <th className="text-left px-2 py-2 text-gray-400 font-medium">
                      Fees Heading
                    </th>
                    <th className="text-left px-2 py-2 text-gray-400 font-medium">
                      Group
                    </th>
                    <th className="text-left px-2 py-2 text-gray-400 font-medium">
                      Account
                    </th>
                    <th className="text-left px-2 py-2 text-gray-400 font-medium">
                      Frequency
                    </th>
                    {ALL_MONTHS.map((m) => (
                      <th
                        key={m}
                        className="text-center px-1 py-2 text-gray-400 font-medium w-8"
                      >
                        {m}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {headings.map((h, i) => (
                    <tr
                      key={h.id}
                      onClick={() =>
                        setSelectedHeading(
                          selectedHeading?.id === h.id ? null : h,
                        )
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          setSelectedHeading(
                            selectedHeading?.id === h.id ? null : h,
                          );
                      }}
                      tabIndex={0}
                      className="cursor-pointer"
                      style={{
                        background:
                          selectedHeading?.id === h.id
                            ? "#1e3a5f"
                            : i % 2 === 0
                              ? "#111827"
                              : "#0f1117",
                      }}
                    >
                      <td className="px-2 py-1.5 text-gray-400">{i + 1}</td>
                      <td className="px-2 py-1.5 text-white">{h.heading}</td>
                      <td className="px-2 py-1.5 text-gray-300">{h.group}</td>
                      <td className="px-2 py-1.5 text-gray-300">{h.account}</td>
                      <td className="px-2 py-1.5 text-gray-300">
                        {h.frequency}
                      </td>
                      {ALL_MONTHS.map((m) => (
                        <td key={m} className="text-center px-1 py-1.5">
                          {h.months.includes(m) ? (
                            <span className="text-green-400 font-bold">✓</span>
                          ) : (
                            <span className="text-gray-700">-</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div
            className="flex items-center gap-3 mt-2 p-2 rounded"
            style={{ background: "#1a1f2e", border: "1px solid #374151" }}
          >
            <button
              type="button"
              onClick={deleteHeading}
              disabled={!selectedHeading}
              data-ocid="master.heading.delete_button"
              className="flex items-center gap-1 bg-red-700 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs px-3 py-1.5 rounded"
            >
              <Trash2 size={12} /> Delete
            </button>
            <div className="flex items-center gap-4 text-xs flex-1">
              <span className="text-gray-500">
                Fees Name:{" "}
                <span className="text-gray-200">
                  {selectedHeading?.heading || "—"}
                </span>
              </span>
              <span className="text-gray-500">
                Group:{" "}
                <span className="text-gray-200">
                  {selectedHeading?.group || "—"}
                </span>
              </span>
              <span className="text-gray-500">
                Account Name:{" "}
                <span className="text-gray-200">
                  {selectedHeading?.account || "—"}
                </span>
              </span>
              <span className="text-gray-500">
                Frequency:{" "}
                <span className="text-gray-200">
                  {selectedHeading?.frequency || "—"}
                </span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── FEES PLAN TAB ── */}
      {tab === "plan" && (
        <div>
          <div
            className="rounded-lg p-4 mb-4"
            style={{ background: "#1a1f2e", border: "1px solid #374151" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <ScrollText size={15} className="text-blue-400" />
              <h3 className="text-white text-xs font-bold tracking-widest uppercase">
                Configure Fees Plan
              </h3>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div>
                <label
                  htmlFor="plan-feeshead"
                  className="text-gray-400 text-xs block mb-1"
                >
                  Select Fees Heading
                </label>
                <select
                  id="plan-feeshead"
                  value={planForm.feesHead}
                  onChange={(e) =>
                    setPlanForm((p) => ({ ...p, feesHead: e.target.value }))
                  }
                  data-ocid="plan.feeshead.select"
                  className="w-48 bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none"
                >
                  {headings.map((h) => (
                    <option key={h.id}>{h.heading}</option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="plan-value"
                  className="text-gray-400 text-xs block mb-1"
                >
                  Fees Value
                </label>
                <input
                  id="plan-value"
                  type="number"
                  value={planForm.value}
                  onChange={(e) =>
                    setPlanForm((p) => ({ ...p, value: e.target.value }))
                  }
                  placeholder="0"
                  data-ocid="plan.value.input"
                  className="w-28 bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <p className="text-red-400 text-[11px] italic mb-3">
              Enter Value for selected fees heading and select classes and
              categories to which this fees value is applicable
            </p>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="selectAllClasses"
                checked={planForm.selectAll}
                onChange={toggleSelectAll}
                className="accent-blue-500 w-3 h-3"
              />
              <label
                htmlFor="selectAllClasses"
                className="text-gray-300 text-xs cursor-pointer"
              >
                Select All
              </label>
              <span className="text-gray-400 text-xs ml-2">Choose Classes</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-gray-700 rounded overflow-hidden">
                <div className="bg-gray-700/40 px-3 py-1.5">
                  <span className="text-gray-300 text-xs font-medium">
                    Classes
                  </span>
                </div>
                <div className="max-h-40 overflow-y-auto">
                  {CLASS_LIST.map((cls, idx) => (
                    <label
                      key={cls}
                      className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer text-xs ${idx % 2 === 0 ? "bg-gray-800/60" : "bg-gray-700/20"}`}
                    >
                      <input
                        type="checkbox"
                        checked={planForm.classes.includes(cls)}
                        onChange={() => toggleClass(cls)}
                        className="accent-blue-500 w-3 h-3"
                      />
                      <span className="text-gray-300">{cls}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="border border-gray-700 rounded overflow-hidden">
                <div className="bg-gray-700/40 px-3 py-1.5">
                  <span className="text-gray-300 text-xs font-medium">
                    Choose Category
                  </span>
                </div>
                <div>
                  {CATEGORIES.map((cat, idx) => (
                    <label
                      key={cat}
                      className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer text-xs ${idx % 2 === 0 ? "bg-gray-800/60" : "bg-gray-700/20"}`}
                    >
                      <input
                        type="checkbox"
                        checked={planForm.categories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                        className="accent-blue-500 w-3 h-3"
                      />
                      <span className="text-gray-300">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-3">
              <button
                type="button"
                onClick={savePlan}
                data-ocid="plan.save.primary_button"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-5 py-1.5 rounded font-medium"
              >
                Save
              </button>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden border border-gray-700 mb-1">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: "#1a1f2e" }}>
                  {["Class", "Category", "Fees Head", "Value"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-3 py-2 text-gray-400 font-medium"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {plans.map((row, i) => (
                  <tr
                    key={row.id}
                    onClick={() =>
                      setSelectedPlan(selectedPlan?.id === row.id ? null : row)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        setSelectedPlan(
                          selectedPlan?.id === row.id ? null : row,
                        );
                    }}
                    tabIndex={0}
                    className="cursor-pointer"
                    style={{
                      background:
                        selectedPlan?.id === row.id
                          ? "#1e3a5f"
                          : i % 2 === 0
                            ? "#111827"
                            : "#0f1117",
                    }}
                  >
                    <td className="px-3 py-1.5 text-white">{row.className}</td>
                    <td className="px-3 py-1.5 text-gray-300">
                      {row.category}
                    </td>
                    <td className="px-3 py-1.5 text-gray-300">
                      {row.feesHead}
                    </td>
                    <td className="px-3 py-1.5 text-green-400">
                      ₹{row.value.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            className="flex items-center gap-3 mt-2 p-2 rounded"
            style={{ background: "#1a1f2e", border: "1px solid #374151" }}
          >
            <button
              type="button"
              onClick={deletePlan}
              disabled={!selectedPlan}
              data-ocid="plan.row.delete_button"
              className="flex items-center gap-1 bg-red-700 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs px-3 py-1.5 rounded"
            >
              <Trash2 size={12} /> Delete
            </button>
            <div className="flex items-center gap-4 text-xs flex-1">
              <span className="text-gray-500">
                Fees Head:{" "}
                <span className="text-gray-200">
                  {selectedPlan?.feesHead || "—"}
                </span>
              </span>
              <span className="text-gray-500">
                Class:{" "}
                <span className="text-gray-200">
                  {selectedPlan?.className || "—"}
                </span>
              </span>
              <span className="text-gray-500">
                Category:{" "}
                <span className="text-gray-200">
                  {selectedPlan?.category || "—"}
                </span>
              </span>
              <span className="text-gray-500">
                Fees Value:{" "}
                <span className="text-green-300">
                  {selectedPlan
                    ? `₹${selectedPlan.value.toLocaleString("en-IN")}`
                    : "—"}
                </span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
