import {
  ClipboardList,
  CreditCard,
  GraduationCap,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
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

const monthlyData = [
  { day: "01", collection: 45000, expenses: 8000 },
  { day: "03", collection: 78000, expenses: 12000 },
  { day: "05", collection: 92000, expenses: 15000 },
  { day: "07", collection: 65000, expenses: 10000 },
  { day: "09", collection: 110000, expenses: 18000 },
  { day: "11", collection: 88000, expenses: 14000 },
  { day: "13", collection: 95000, expenses: 16000 },
  { day: "15", collection: 142000, expenses: 22000 },
  { day: "17", collection: 76000, expenses: 11000 },
  { day: "19", collection: 83000, expenses: 13000 },
  { day: "21", collection: 55000, expenses: 9000 },
  { day: "23", collection: 99000, expenses: 17000 },
  { day: "25", collection: 72000, expenses: 12000 },
  { day: "27", collection: 88000, expenses: 15000 },
  { day: "31", collection: 62000, expenses: 10000 },
];

const sessionData = [
  { month: "Apr", fees: 450000, expenses: 80000 },
  { month: "May", fees: 620000, expenses: 90000 },
  { month: "Jun", fees: 580000, expenses: 85000 },
  { month: "Jul", fees: 890000, expenses: 110000 },
  { month: "Aug", fees: 1200000, expenses: 130000 },
  { month: "Sep", fees: 980000, expenses: 120000 },
  { month: "Oct", fees: 760000, expenses: 100000 },
  { month: "Nov", fees: 820000, expenses: 105000 },
  { month: "Dec", fees: 690000, expenses: 95000 },
  { month: "Jan", fees: 800000, expenses: 100000 },
  { month: "Feb", fees: 750000, expenses: 98000 },
  { month: "Mar", fees: 920000, expenses: 115000 },
];

const statCards = [
  {
    icon: <CreditCard size={18} />,
    label: "Fees Awaiting Payment",
    value: "558",
    total: "2864",
    pct: 80,
    color: "#3b82f6",
  },
  {
    icon: <UserCheck size={18} />,
    label: "Staff Approved Leave",
    value: "0",
    total: "0",
    pct: 0,
    color: "#8b5cf6",
  },
  {
    icon: <GraduationCap size={18} />,
    label: "Student Approved Leave",
    value: "0",
    total: "0",
    pct: 0,
    color: "#eab308",
  },
  {
    icon: <TrendingUp size={18} />,
    label: "Converted Leads",
    value: "0",
    total: "0",
    pct: 0,
    color: "#22c55e",
  },
  {
    icon: <ClipboardList size={18} />,
    label: "Staff Present Today",
    value: "0",
    total: "29",
    pct: 0,
    color: "#f97316",
  },
  {
    icon: <Users size={18} />,
    label: "Student Present Today",
    value: "0",
    total: "1184",
    pct: 0,
    color: "#14b8a6",
  },
];

const chartStyle = {
  background: "#1a1f2e",
  border: "1px solid #374151",
  borderRadius: 8,
  padding: 16,
  marginBottom: 16,
};

interface DashboardProps {
  navigate: (path: string) => void;
}

export function Dashboard({ navigate }: DashboardProps) {
  return (
    <div>
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-lg p-3"
            style={{ background: "#1a1f2e", border: "1px solid #374151" }}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span style={{ color: card.color }}>{card.icon}</span>
                <span className="text-gray-300 text-xs">{card.label}</span>
              </div>
              <span className="text-white text-sm font-bold">
                {card.value}/{card.total}
              </span>
            </div>
            <div className="h-1 bg-gray-700 rounded-full">
              <div
                className="h-1 rounded-full"
                style={{ width: `${card.pct}%`, background: card.color }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Fees Collection & Expenses Chart */}
      <div style={chartStyle}>
        <h3 className="text-gray-200 text-sm font-medium mb-3">
          Fees Collection &amp; Expenses For March 2026
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart
            data={monthlyData}
            margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="day" tick={{ fill: "#9ca3af", fontSize: 10 }} />
            <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                background: "#1f2937",
                border: "none",
                color: "#fff",
              }}
            />
            <Bar
              dataKey="collection"
              fill="#22c55e"
              name="Collection"
              radius={[2, 2, 0, 0]}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              strokeDasharray="4 4"
              dot={false}
              name="Expenses"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Session Chart */}
      <div style={chartStyle}>
        <h3 className="text-gray-200 text-sm font-medium mb-3">
          Fees Collection &amp; Expenses For Session 2025-26
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart
            data={sessionData}
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
            <Line
              type="monotone"
              dataKey="fees"
              stroke="#22c55e"
              dot={false}
              name="Fees Collection"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              dot={false}
              name="Expenses"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom overview cards */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-lg p-4"
          style={{ background: "#1a1f2e", border: "1px solid #374151" }}
        >
          <h4 className="text-gray-300 text-sm font-medium mb-2">
            Fees Overview
          </h4>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Total Collected</span>
              <span className="text-green-400">₹12,45,000</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Pending</span>
              <span className="text-yellow-400">₹3,20,000</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Overdue</span>
              <span className="text-red-400">₹85,000</span>
            </div>
          </div>
        </div>
        <div
          className="rounded-lg p-4"
          style={{ background: "#1a1f2e", border: "1px solid #374151" }}
        >
          <h4 className="text-gray-300 text-sm font-medium mb-2">
            Enquiry Overview
          </h4>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Total Enquiries</span>
              <span className="text-blue-400">142</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Converted</span>
              <span className="text-green-400">0</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Pending</span>
              <span className="text-yellow-400">142</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick navigation */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {[
          { label: "Students", path: "/students", color: "#3b82f6" },
          { label: "Fees", path: "/fees", color: "#22c55e" },
          { label: "Attendance", path: "/attendance", color: "#f97316" },
          { label: "Examinations", path: "/examinations", color: "#8b5cf6" },
          { label: "HR", path: "/hr", color: "#14b8a6" },
          { label: "Transport", path: "/transport", color: "#eab308" },
          { label: "Reports", path: "/reports", color: "#ef4444" },
          { label: "Communicate", path: "/communicate", color: "#ec4899" },
        ].map((item) => (
          <button
            type="button"
            key={item.label}
            onClick={() => navigate(item.path)}
            className="rounded-lg p-2 text-xs text-white font-medium hover:opacity-80 transition"
            style={{
              background: `${item.color}22`,
              border: `1px solid ${item.color}44`,
              color: item.color,
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
