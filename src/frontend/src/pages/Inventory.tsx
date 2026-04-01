import { Plus, X } from "lucide-react";
import { useState } from "react";

interface Item {
  id: number;
  name: string;
  category: string;
  store: string;
  quantity: number;
  unit: string;
}

const initialItems: Item[] = [];

export function Inventory() {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "",
    store: "Main Store",
    quantity: "",
    unit: "",
  });

  const handleAdd = () => {
    if (!form.name) return;
    setItems((prev) => [
      ...prev,
      { id: prev.length + 1, ...form, quantity: Number(form.quantity) || 0 },
    ]);
    setShowModal(false);
    setForm({
      name: "",
      category: "",
      store: "Main Store",
      quantity: "",
      unit: "",
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-lg font-semibold">
          Inventory Management
        </h2>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded"
        >
          <Plus size={14} /> Add Item
        </button>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div
          className="rounded-lg p-3"
          style={{ background: "#1a1f2e", border: "1px solid #374151" }}
        >
          <p className="text-gray-400 text-xs">Total Items</p>
          <p className="text-white text-2xl font-bold">{items.length}</p>
        </div>
        <div
          className="rounded-lg p-3"
          style={{ background: "#1a1f2e", border: "1px solid #374151" }}
        >
          <p className="text-gray-400 text-xs">Low Stock (&lt;10)</p>
          <p className="text-red-400 text-2xl font-bold">
            {items.filter((i) => i.quantity < 10).length}
          </p>
        </div>
        <div
          className="rounded-lg p-3"
          style={{ background: "#1a1f2e", border: "1px solid #374151" }}
        >
          <p className="text-gray-400 text-xs">Categories</p>
          <p className="text-blue-400 text-2xl font-bold">
            {new Set(items.map((i) => i.category)).size}
          </p>
        </div>
      </div>
      <div className="rounded-lg overflow-hidden border border-gray-700">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ background: "#1a1f2e" }}>
              {[
                "Item Name",
                "Category",
                "Store",
                "Quantity",
                "Unit",
                "Status",
              ].map((h) => (
                <th key={h} className="text-left px-3 py-2 text-gray-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr
                key={item.id}
                style={{ background: i % 2 === 0 ? "#111827" : "#0f1117" }}
              >
                <td className="px-3 py-2 text-white">{item.name}</td>
                <td className="px-3 py-2 text-blue-400">{item.category}</td>
                <td className="px-3 py-2 text-gray-300">{item.store}</td>
                <td className="px-3 py-2 text-white font-medium">
                  {item.quantity}
                </td>
                <td className="px-3 py-2 text-gray-400">{item.unit}</td>
                <td className="px-3 py-2">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] ${item.quantity > 20 ? "bg-green-900/50 text-green-400" : item.quantity > 10 ? "bg-yellow-900/50 text-yellow-400" : "bg-red-900/50 text-red-400"}`}
                  >
                    {item.quantity > 20
                      ? "In Stock"
                      : item.quantity > 10
                        ? "Low Stock"
                        : "Critical"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div
            className="rounded-xl p-6 w-full max-w-md"
            style={{ background: "#1a1f2e", border: "1px solid #374151" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Add Inventory Item</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(["name", "category", "store", "quantity", "unit"] as const).map(
                (key) => (
                  <div key={key} className={key === "name" ? "col-span-2" : ""}>
                    <label
                      htmlFor={`inv-${key}`}
                      className="text-gray-400 text-xs block mb-1 capitalize"
                    >
                      {key}
                    </label>
                    <input
                      id={`inv-${key}`}
                      value={form[key]}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, [key]: e.target.value }))
                      }
                      className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none focus:border-green-500"
                    />
                  </div>
                ),
              )}
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
