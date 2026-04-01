import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const monthlyFinance = [
  { month: "Oct", income: 760000, expense: 120000 },
  { month: "Nov", income: 820000, expense: 130000 },
  { month: "Dec", income: 690000, expense: 115000 },
  { month: "Jan", income: 800000, expense: 125000 },
  { month: "Feb", income: 750000, expense: 118000 },
  { month: "Mar", income: 920000, expense: 140000 },
];

const reportCards = [
  {
    title: "Student Report",
    count: "1184 Students",
    color: "#3b82f6",
    desc: "Class-wise student listing",
  },
  {
    title: "Finance Report",
    count: "₹45,50,000",
    color: "#22c55e",
    desc: "Income & expense summary",
  },
  {
    title: "Attendance Report",
    count: "89% Avg",
    color: "#f97316",
    desc: "Monthly attendance summary",
  },
  {
    title: "Exam Report",
    count: "Pass: 94%",
    color: "#8b5cf6",
    desc: "Exam results overview",
  },
  {
    title: "HR Report",
    count: "29 Staff",
    color: "#14b8a6",
    desc: "Staff information",
  },
  {
    title: "Transport Report",
    count: "135 Students",
    color: "#eab308",
    desc: "Transport assignment report",
  },
  {
    title: "Inventory Report",
    count: "48 Items",
    color: "#ef4444",
    desc: "Stock & issue summary",
  },
  {
    title: "Alumni Report",
    count: "320 Alumni",
    color: "#ec4899",
    desc: "Alumni directory",
  },
];

export function Reports() {
  return (
    <div>
      <h2 className="text-white text-lg font-semibold mb-4">Reports</h2>
      <div className="grid grid-cols-4 gap-3 mb-6">
        {reportCards.map((card) => (
          <div
            key={card.title}
            className="rounded-lg p-3 cursor-pointer hover:opacity-80 transition"
            style={{
              background: "#1a1f2e",
              border: `1px solid ${card.color}33`,
            }}
          >
            <p
              className="text-xs font-medium mb-1"
              style={{ color: card.color }}
            >
              {card.title}
            </p>
            <p className="text-white text-base font-bold">{card.count}</p>
            <p className="text-gray-500 text-[10px] mt-0.5">{card.desc}</p>
          </div>
        ))}
      </div>
      <div
        className="rounded-lg p-4"
        style={{ background: "#1a1f2e", border: "1px solid #374151" }}
      >
        <h3 className="text-gray-200 text-sm font-medium mb-3">
          Finance Overview (Last 6 Months)
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={monthlyFinance}
            margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 10 }} />
            <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                background: "#1f2937",
                border: "none",
                color: "#fff",
              }}
            />
            <Legend wrapperStyle={{ color: "#9ca3af", fontSize: 10 }} />
            <Bar
              dataKey="income"
              fill="#22c55e"
              name="Income"
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="expense"
              fill="#ef4444"
              name="Expense"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
