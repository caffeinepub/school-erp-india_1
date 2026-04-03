import { Plus, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

interface StaffMember {
  id: number;
  name: string;
  designation: string;
  department: string;
  salary: number;
  contact: string;
  joinDate: string;
  status: "Active" | "Inactive";
}

export function HumanResource() {
  const [tab, setTab] = useState<"directory" | "payroll" | "leave">(
    "directory",
  );
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [staffSearch, setStaffSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    designation: "",
    department: "",
    salary: "",
    contact: "",
    joinDate: "",
  });

  // Load staff from localStorage on mount
  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("erp_staff") || "[]");
      if (Array.isArray(raw) && raw.length > 0) {
        // Map erp_staff shape to StaffMember
        const mapped: StaffMember[] = raw.map((s: any, i: number) => ({
          id: s.id ?? i + 1,
          name: s.name || "",
          designation: s.designation || "",
          department: s.department || "",
          salary: s.salary || 0,
          contact: s.contact || "",
          joinDate: s.joiningDate || s.joinDate || "",
          status: s.status || "Active",
        }));
        setStaff(mapped);
      }
    } catch {
      setStaff([]);
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (staff.length > 0) {
      localStorage.setItem(
        "erp_staff",
        JSON.stringify(
          staff.map((s) => ({
            id: s.id,
            name: s.name,
            designation: s.designation,
            department: s.department,
            salary: s.salary,
            contact: s.contact,
            joiningDate: s.joinDate,
            status: s.status,
          })),
        ),
      );
    }
  }, [staff]);

  const handleAdd = () => {
    if (!form.name) return;
    setStaff((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        ...form,
        salary: Number(form.salary) || 0,
        status: "Active",
      },
    ]);
    setShowModal(false);
    setForm({
      name: "",
      designation: "",
      department: "",
      salary: "",
      contact: "",
      joinDate: "",
    });
  };

  const totalPayroll = staff
    .filter((s) => s.status === "Active")
    .reduce((sum, s) => sum + s.salary, 0);

  // Live filtered staff
  const filteredStaff = staffSearch.trim()
    ? staff.filter(
        (s) =>
          s.name.toLowerCase().includes(staffSearch.toLowerCase()) ||
          s.designation.toLowerCase().includes(staffSearch.toLowerCase()) ||
          s.department.toLowerCase().includes(staffSearch.toLowerCase()),
      )
    : staff;

  return (
    <div>
      <h2 className="text-white text-lg font-semibold mb-4">Human Resource</h2>
      <div className="flex gap-1 mb-4">
        {(["directory", "payroll", "leave"] as const).map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded text-xs font-medium capitalize transition ${
              tab === t
                ? "bg-green-600 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            {t === "directory"
              ? "Staff Directory"
              : t === "payroll"
                ? "Payroll"
                : "Leave Management"}
          </button>
        ))}
      </div>

      {tab === "directory" && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <p className="text-gray-400 text-xs">
                Total Active Staff:{" "}
                {filteredStaff.filter((s) => s.status === "Active").length}
              </p>
              <div className="flex items-center bg-gray-800 border border-gray-700 rounded px-2 py-1">
                <Search size={12} className="text-gray-400 mr-1" />
                <input
                  value={staffSearch}
                  onChange={(e) => setStaffSearch(e.target.value)}
                  placeholder="Search staff..."
                  className="bg-transparent text-gray-300 text-xs outline-none w-36"
                  data-ocid="hr.staff.search_input"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded"
              data-ocid="hr.staff.primary_button"
            >
              <Plus size={14} /> Add Staff
            </button>
          </div>
          <div className="rounded-lg overflow-hidden border border-gray-700">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: "#1a1f2e" }}>
                  {[
                    "Name",
                    "Designation",
                    "Department",
                    "Salary",
                    "Contact",
                    "Join Date",
                    "Status",
                  ].map((h) => (
                    <th key={h} className="text-left px-3 py-2 text-gray-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredStaff.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-3 py-8 text-center text-gray-500"
                      data-ocid="hr.staff.empty_state"
                    >
                      No staff found.
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map((s, i) => (
                    <tr
                      key={s.id}
                      style={{
                        background: i % 2 === 0 ? "#111827" : "#0f1117",
                      }}
                      data-ocid={`hr.staff.item.${i + 1}`}
                    >
                      <td className="px-3 py-2 text-white font-medium">
                        {s.name}
                      </td>
                      <td className="px-3 py-2 text-blue-400">
                        {s.designation}
                      </td>
                      <td className="px-3 py-2 text-gray-300">
                        {s.department}
                      </td>
                      <td className="px-3 py-2 text-green-400">
                        ₹{s.salary.toLocaleString("en-IN")}
                      </td>
                      <td className="px-3 py-2 text-gray-400">{s.contact}</td>
                      <td className="px-3 py-2 text-gray-400">{s.joinDate}</td>
                      <td className="px-3 py-2">
                        <span className="bg-green-900/50 text-green-400 px-1.5 py-0.5 rounded text-[10px]">
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "payroll" && (
        <div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div
              className="rounded-lg p-3"
              style={{ background: "#1a1f2e", border: "1px solid #374151" }}
            >
              <p className="text-gray-400 text-xs">Total Staff</p>
              <p className="text-white text-2xl font-bold">{staff.length}</p>
            </div>
            <div
              className="rounded-lg p-3"
              style={{ background: "#1a1f2e", border: "1px solid #374151" }}
            >
              <p className="text-gray-400 text-xs">Monthly Payroll</p>
              <p className="text-green-400 text-2xl font-bold">
                ₹{totalPayroll.toLocaleString("en-IN")}
              </p>
            </div>
            <div
              className="rounded-lg p-3"
              style={{ background: "#1a1f2e", border: "1px solid #374151" }}
            >
              <p className="text-gray-400 text-xs">Annual Payroll</p>
              <p className="text-yellow-400 text-2xl font-bold">
                ₹{(totalPayroll * 12).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden border border-gray-700">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: "#1a1f2e" }}>
                  {[
                    "Staff Name",
                    "Designation",
                    "Basic Salary",
                    "HRA",
                    "DA",
                    "Net Salary",
                    "Action",
                  ].map((h) => (
                    <th key={h} className="text-left px-3 py-2 text-gray-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {staff.map((s, i) => {
                  const hra = Math.round(s.salary * 0.2);
                  const da = Math.round(s.salary * 0.15);
                  return (
                    <tr
                      key={s.id}
                      style={{
                        background: i % 2 === 0 ? "#111827" : "#0f1117",
                      }}
                    >
                      <td className="px-3 py-2 text-white">{s.name}</td>
                      <td className="px-3 py-2 text-gray-300">
                        {s.designation}
                      </td>
                      <td className="px-3 py-2 text-gray-300">
                        ₹{s.salary.toLocaleString("en-IN")}
                      </td>
                      <td className="px-3 py-2 text-gray-300">
                        ₹{hra.toLocaleString("en-IN")}
                      </td>
                      <td className="px-3 py-2 text-gray-300">
                        ₹{da.toLocaleString("en-IN")}
                      </td>
                      <td className="px-3 py-2 text-green-400 font-medium">
                        ₹{(s.salary + hra + da).toLocaleString("en-IN")}
                      </td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          className="bg-blue-700 hover:bg-blue-600 text-white px-2 py-0.5 rounded text-[10px]"
                        >
                          Pay Slip
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "leave" && (
        <div
          className="rounded-lg p-4 max-w-lg"
          style={{ background: "#1a1f2e", border: "1px solid #374151" }}
        >
          <h3 className="text-white text-sm font-medium mb-3">
            Leave Applications
          </h3>
          <p className="text-gray-400 text-xs">No pending leave requests.</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div
            className="rounded-xl p-6 w-full max-w-md"
            style={{ background: "#1a1f2e", border: "1px solid #374151" }}
            data-ocid="hr.staff.modal"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Add Staff Member</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
                data-ocid="hr.staff.close_button"
              >
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  "name",
                  "designation",
                  "department",
                  "salary",
                  "contact",
                  "joinDate",
                ] as const
              ).map((key) => (
                <div key={key}>
                  <label
                    htmlFor={`hr-${key}`}
                    className="text-gray-400 text-xs block mb-1 capitalize"
                  >
                    {key.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    id={`hr-${key}`}
                    value={form[key]}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, [key]: e.target.value }))
                    }
                    className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none focus:border-green-500"
                    data-ocid="hr.staff.input"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-2 rounded"
                data-ocid="hr.staff.submit_button"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs py-2 rounded"
                data-ocid="hr.staff.cancel_button"
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
