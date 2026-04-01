import { useState } from "react";

const routes: {
  id: number;
  name: string;
  stops: string[];
  vehicles: number;
  students: number;
}[] = [];

const vehicles: {
  id: number;
  number: string;
  driver: string;
  route: string;
  capacity: number;
  students: number;
  status: string;
}[] = [];

export function Transport() {
  const [tab, setTab] = useState<"routes" | "vehicles">("routes");

  return (
    <div>
      <h2 className="text-white text-lg font-semibold mb-4">
        Transport Management
      </h2>
      <div className="flex gap-1 mb-4">
        {(["routes", "vehicles"] as const).map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded text-xs font-medium capitalize transition ${tab === t ? "bg-green-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}
          >
            {t === "routes" ? "Routes" : "Vehicles"}
          </button>
        ))}
      </div>

      {tab === "routes" && (
        <div className="grid gap-3">
          {routes.map((route) => (
            <div
              key={route.id}
              className="rounded-lg p-4"
              style={{ background: "#1a1f2e", border: "1px solid #374151" }}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-white text-sm font-medium">{route.name}</h3>
                <div className="flex gap-3">
                  <span className="text-gray-400 text-xs">
                    {route.vehicles} vehicles
                  </span>
                  <span className="text-blue-400 text-xs">
                    {route.students} students
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {route.stops.map((stop, i) => (
                  <span key={stop} className="flex items-center gap-1">
                    <span className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded">
                      {stop}
                    </span>
                    {i < route.stops.length - 1 && (
                      <span className="text-gray-600">→</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "vehicles" && (
        <div className="rounded-lg overflow-hidden border border-gray-700">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: "#1a1f2e" }}>
                {[
                  "Vehicle No",
                  "Driver",
                  "Route",
                  "Capacity",
                  "Students",
                  "Status",
                ].map((h) => (
                  <th key={h} className="text-left px-3 py-2 text-gray-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v, i) => (
                <tr
                  key={v.id}
                  style={{ background: i % 2 === 0 ? "#111827" : "#0f1117" }}
                >
                  <td className="px-3 py-2 text-blue-400 font-mono">
                    {v.number}
                  </td>
                  <td className="px-3 py-2 text-white">{v.driver}</td>
                  <td className="px-3 py-2 text-gray-300">{v.route}</td>
                  <td className="px-3 py-2 text-gray-300">{v.capacity}</td>
                  <td className="px-3 py-2 text-gray-300">
                    {v.students}/{v.capacity}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] ${v.status === "Active" ? "bg-green-900/50 text-green-400" : "bg-yellow-900/50 text-yellow-400"}`}
                    >
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
