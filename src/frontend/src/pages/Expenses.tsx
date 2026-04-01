import { Plus } from "lucide-react";
import { useState } from "react";

interface ExpRecord {
  id: number;
  head: string;
  amount: number;
  date: string;
  description: string;
  mode: string;
  type: "income" | "expense";
}

const initialRecords: ExpRecord[] = [
  {
    id: 1,
    head: "Salary",
    amount: 283000,
    date: "01/03/2026",
    description: "Monthly staff salary March 2026",
    mode: "Bank Transfer",
    type: "expense",
  },
  {
    id: 2,
    head: "Tuition Fees",
    amount: 450000,
    date: "05/03/2026",
    description: "Tuition fee collection March batch 1",
    mode: "Cash",
    type: "income",
  },
  {
    id: 3,
    head: "Electricity",
    amount: 28000,
    date: "08/03/2026",
    description: "Electricity bill March 2026",
    mode: "Online",
    type: "expense",
  },
  {
    id: 4,
    head: "Transport Fees",
    amount: 85000,
    date: "10/03/2026",
    description: "Transport fee collection",
    mode: "Cash",
    type: "income",
  },
  {
    id: 5,
    head: "Maintenance",
    amount: 15000,
    date: "12/03/2026",
    description: "Building maintenance & repair",
    mode: "Cash",
    type: "expense",
  },
  {
    id: 6,
    head: "Exam Fees",
    amount: 42000,
    date: "15/03/2026",
    description: "Examination fee collection",
    mode: "Online",
    type: "income",
  },
];

export function Expenses() {
  const [tab, setTab] = useState<"income" | "expense" | "add">("income");
  const [records, setRecords] = useState<ExpRecord[]>(initialRecords);
  const [form, setForm] = useState({
    head: "",
    amount: "",
    description: "",
    mode: "Cash",
    type: "income" as "income" | "expense",
    date: "",
  });

  const income = records.filter((r) => r.type === "income");
  const expense = records.filter((r) => r.type === "expense");
  const totalIncome = income.reduce((s, r) => s + r.amount, 0);
  const totalExpense = expense.reduce((s, r) => s + r.amount, 0);

  const handleAdd = () => {
    if (!form.head || !form.amount) return;
    setRecords((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        ...form,
        amount: Number(form.amount),
        date: form.date || new Date().toLocaleDateString("en-IN"),
      },
    ]);
    setForm({
      head: "",
      amount: "",
      description: "",
      mode: "Cash",
      type: "income",
      date: "",
    });
  };

  const renderTable = (data: ExpRecord[]) => (
    <div className="rounded-lg overflow-hidden border border-gray-700">
      <table className="w-full text-xs">
        <thead>
          <tr style={{ background: "#1a1f2e" }}>
            {["Head", "Amount", "Date", "Description", "Mode"].map((h) => (
              <th key={h} className="text-left px-3 py-2 text-gray-400">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((r, i) => (
            <tr
              key={r.id}
              style={{ background: i % 2 === 0 ? "#111827" : "#0f1117" }}
            >
              <td className="px-3 py-2 text-white">{r.head}</td>
              <td
                className={`px-3 py-2 font-medium ${r.type === "income" ? "text-green-400" : "text-red-400"}`}
              >
                ₹{r.amount.toLocaleString("en-IN")}
              </td>
              <td className="px-3 py-2 text-gray-400">{r.date}</td>
              <td className="px-3 py-2 text-gray-300">{r.description}</td>
              <td className="px-3 py-2 text-gray-400">{r.mode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <h2 className="text-white text-lg font-semibold mb-4">
        Income &amp; Expenses
      </h2>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div
          className="rounded-lg p-3"
          style={{ background: "#1a1f2e", border: "1px solid #374151" }}
        >
          <p className="text-gray-400 text-xs">Total Income</p>
          <p className="text-green-400 text-2xl font-bold">
            ₹{totalIncome.toLocaleString("en-IN")}
          </p>
        </div>
        <div
          className="rounded-lg p-3"
          style={{ background: "#1a1f2e", border: "1px solid #374151" }}
        >
          <p className="text-gray-400 text-xs">Total Expenses</p>
          <p className="text-red-400 text-2xl font-bold">
            ₹{totalExpense.toLocaleString("en-IN")}
          </p>
        </div>
        <div
          className="rounded-lg p-3"
          style={{ background: "#1a1f2e", border: "1px solid #374151" }}
        >
          <p className="text-gray-400 text-xs">Net Balance</p>
          <p
            className={`text-2xl font-bold ${totalIncome - totalExpense >= 0 ? "text-green-400" : "text-red-400"}`}
          >
            ₹{(totalIncome - totalExpense).toLocaleString("en-IN")}
          </p>
        </div>
      </div>
      <div className="flex gap-1 mb-4">
        {(["income", "expense", "add"] as const).map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded text-xs font-medium transition ${tab === t ? "bg-green-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}
          >
            {t === "income"
              ? "Income"
              : t === "expense"
                ? "Expenses"
                : "Add Entry"}
          </button>
        ))}
      </div>
      {tab === "income" && renderTable(income)}
      {tab === "expense" && renderTable(expense)}
      {tab === "add" && (
        <div
          className="rounded-lg p-5 max-w-lg"
          style={{ background: "#1a1f2e", border: "1px solid #374151" }}
        >
          <h3 className="text-white text-sm font-medium mb-3">
            Add Income/Expense Entry
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="exp-type"
                className="text-gray-400 text-xs block mb-1"
              >
                Type
              </label>
              <select
                id="exp-type"
                value={form.type}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    type: e.target.value as "income" | "expense",
                  }))
                }
                className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="exp-head"
                className="text-gray-400 text-xs block mb-1"
              >
                Head
              </label>
              <input
                id="exp-head"
                value={form.head}
                onChange={(e) =>
                  setForm((p) => ({ ...p, head: e.target.value }))
                }
                className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label
                htmlFor="exp-amount"
                className="text-gray-400 text-xs block mb-1"
              >
                Amount (₹)
              </label>
              <input
                id="exp-amount"
                type="number"
                value={form.amount}
                onChange={(e) =>
                  setForm((p) => ({ ...p, amount: e.target.value }))
                }
                className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label
                htmlFor="exp-date"
                className="text-gray-400 text-xs block mb-1"
              >
                Date
              </label>
              <input
                id="exp-date"
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((p) => ({ ...p, date: e.target.value }))
                }
                className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label
                htmlFor="exp-mode"
                className="text-gray-400 text-xs block mb-1"
              >
                Payment Mode
              </label>
              <select
                id="exp-mode"
                value={form.mode}
                onChange={(e) =>
                  setForm((p) => ({ ...p, mode: e.target.value }))
                }
                className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none"
              >
                {["Cash", "Online", "Cheque", "Bank Transfer", "DD"].map(
                  (m) => (
                    <option key={m}>{m}</option>
                  ),
                )}
              </select>
            </div>
            <div className="col-span-2">
              <label
                htmlFor="exp-desc"
                className="text-gray-400 text-xs block mb-1"
              >
                Description
              </label>
              <input
                id="exp-desc"
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none focus:border-green-500"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white text-xs py-2 rounded"
          >
            Add Entry
          </button>
        </div>
      )}
    </div>
  );
}
