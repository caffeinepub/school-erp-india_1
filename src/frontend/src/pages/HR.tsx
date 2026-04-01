import { Plus, X } from "lucide-react";
import { useState } from "react";

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

const initialStaff: StaffMember[] = [];

export function HumanResource() {
  const [tab, setTab] = useState<"directory" | "payroll" | "leave">(
    "directory",
  );
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    designation: "",
    department: "",
    salary: "",
    contact: "",
    joinDate: "",
  });

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

  return (
    <div>
      <h2 className="text-white text-lg font-semibold mb-4">Human Resource</h2>
      <div className="flex gap-1 mb-4">
        {(["directory", "payroll", "leave"] as const).map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded text-xs font-medium capitalize transition ${tab === t ? "bg-green-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}
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
            <p className="text-gray-400 text-xs">
              Total Active Staff:{" "}
              {staff.filter((s) => s.status === "Active").length}
            </p>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded"
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
                {staff.map((s, i) => (
                  <tr
                    key={s.id}
                    style={{ background: i % 2 === 0 ? "#111827" : "#0f1117" }}
                  >
                    <td className="px-3 py-2 text-white font-medium">
                      {s.name}
                    </td>
                    <td className="px-3 py-2 text-blue-400">{s.designation}</td>
                    <td className="px-3 py-2 text-gray-300">{s.department}</td>
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
                ))}
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
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Add Staff Member</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
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
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-2 rounded"
              >
                Save
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
