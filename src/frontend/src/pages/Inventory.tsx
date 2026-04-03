import { Edit2, Plus, Printer, Search, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  store: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
}

interface IssueRecord {
  id: number;
  itemId: number;
  itemName: string;
  quantity: number;
  issuedTo: string;
  recipientType: "Student" | "Staff";
  date: string;
  returnDate: string;
  returned: boolean;
}

interface Category {
  id: number;
  name: string;
}
interface Store {
  id: number;
  name: string;
  location: string;
}

const DEMO_ITEMS: InventoryItem[] = [
  {
    id: 1,
    name: "A4 Paper Ream",
    category: "Stationery",
    store: "Main Store",
    quantity: 150,
    unit: "Reams",
    reorderLevel: 20,
  },
  {
    id: 2,
    name: "Ballpoint Pens (Blue)",
    category: "Stationery",
    store: "Main Store",
    quantity: 500,
    unit: "Pcs",
    reorderLevel: 50,
  },
  {
    id: 3,
    name: "Football",
    category: "Sports",
    store: "Sports Room",
    quantity: 8,
    unit: "Pcs",
    reorderLevel: 5,
  },
  {
    id: 4,
    name: "Cricket Kit",
    category: "Sports",
    store: "Sports Room",
    quantity: 3,
    unit: "Sets",
    reorderLevel: 2,
  },
  {
    id: 5,
    name: "Bunsen Burner",
    category: "Lab Equipment",
    store: "Science Lab",
    quantity: 12,
    unit: "Pcs",
    reorderLevel: 5,
  },
  {
    id: 6,
    name: "Microscope",
    category: "Lab Equipment",
    store: "Science Lab",
    quantity: 6,
    unit: "Pcs",
    reorderLevel: 3,
  },
  {
    id: 7,
    name: "Student Desk",
    category: "Furniture",
    store: "Warehouse",
    quantity: 45,
    unit: "Pcs",
    reorderLevel: 10,
  },
  {
    id: 8,
    name: "Whiteboard Marker",
    category: "Stationery",
    store: "Main Store",
    quantity: 80,
    unit: "Pcs",
    reorderLevel: 20,
  },
  {
    id: 9,
    name: "Basketball",
    category: "Sports",
    store: "Sports Room",
    quantity: 4,
    unit: "Pcs",
    reorderLevel: 3,
  },
  {
    id: 10,
    name: "Projector",
    category: "Electronics",
    store: "AV Room",
    quantity: 5,
    unit: "Pcs",
    reorderLevel: 2,
  },
  {
    id: 11,
    name: "Chalk Box",
    category: "Stationery",
    store: "Main Store",
    quantity: 30,
    unit: "Boxes",
    reorderLevel: 10,
  },
  {
    id: 12,
    name: "Beaker 250ml",
    category: "Lab Equipment",
    store: "Science Lab",
    quantity: 20,
    unit: "Pcs",
    reorderLevel: 8,
  },
  {
    id: 13,
    name: "Office Chair",
    category: "Furniture",
    store: "Warehouse",
    quantity: 15,
    unit: "Pcs",
    reorderLevel: 5,
  },
  {
    id: 14,
    name: "Printer Cartridge",
    category: "Electronics",
    store: "Office",
    quantity: 6,
    unit: "Pcs",
    reorderLevel: 3,
  },
  {
    id: 15,
    name: "Art Brush Set",
    category: "Art & Craft",
    store: "Art Room",
    quantity: 25,
    unit: "Sets",
    reorderLevel: 5,
  },
];

const DEMO_CATEGORIES: Category[] = [
  { id: 1, name: "Stationery" },
  { id: 2, name: "Sports" },
  { id: 3, name: "Lab Equipment" },
  { id: 4, name: "Furniture" },
  { id: 5, name: "Electronics" },
  { id: 6, name: "Art & Craft" },
];

const DEMO_STORES: Store[] = [
  { id: 1, name: "Main Store", location: "Ground Floor, Block A" },
  { id: 2, name: "Sports Room", location: "Sports Complex" },
  { id: 3, name: "Science Lab", location: "Block B, 2nd Floor" },
  { id: 4, name: "Warehouse", location: "Back Campus" },
  { id: 5, name: "AV Room", location: "Block C, 1st Floor" },
  { id: 6, name: "Art Room", location: "Block A, 1st Floor" },
  { id: 7, name: "Office", location: "Admin Block" },
];

function loadLS<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}

function stockStatus(
  qty: number,
  reorder: number,
): { label: string; cls: string } {
  if (qty <= 0)
    return { label: "Out of Stock", cls: "bg-gray-800 text-gray-400" };
  if (qty <= reorder)
    return { label: "Critical", cls: "bg-red-900/50 text-red-400" };
  if (qty <= reorder * 2)
    return { label: "Low Stock", cls: "bg-yellow-900/50 text-yellow-400" };
  return { label: "In Stock", cls: "bg-green-900/50 text-green-400" };
}

export function Inventory() {
  const [tab, setTab] = useState<"items" | "issue" | "categories" | "report">(
    "items",
  );
  const [items, setItems] = useState<InventoryItem[]>(() =>
    loadLS("erp_inventory", DEMO_ITEMS),
  );
  const [issues, setIssues] = useState<IssueRecord[]>(() =>
    loadLS("erp_inventory_issues", []),
  );
  const [categories, setCategories] = useState<Category[]>(() =>
    loadLS("erp_inventory_cats", DEMO_CATEGORIES),
  );
  const [stores, setStores] = useState<Store[]>(() =>
    loadLS("erp_inventory_stores", DEMO_STORES),
  );
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");

  // Item modal
  const [showItemModal, setShowItemModal] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [itemForm, setItemForm] = useState({
    name: "",
    category: "Stationery",
    store: "Main Store",
    quantity: "",
    unit: "Pcs",
    reorderLevel: "10",
  });

  // Issue modal
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueForm, setIssueForm] = useState({
    itemId: "",
    quantity: "",
    issuedTo: "",
    recipientType: "Student" as "Student" | "Staff",
    date: new Date().toISOString().split("T")[0],
    returnDate: "",
  });

  // Category modal
  const [showCatModal, setShowCatModal] = useState(false);
  const [catForm, setCatForm] = useState({
    name: "",
    type: "category" as "category" | "store",
    location: "",
  });

  useEffect(() => {
    localStorage.setItem("erp_inventory", JSON.stringify(items));
  }, [items]);
  useEffect(() => {
    localStorage.setItem("erp_inventory_issues", JSON.stringify(issues));
  }, [issues]);
  useEffect(() => {
    localStorage.setItem("erp_inventory_cats", JSON.stringify(categories));
  }, [categories]);
  useEffect(() => {
    localStorage.setItem("erp_inventory_stores", JSON.stringify(stores));
  }, [stores]);

  const filteredItems = items.filter((i) => {
    const q = search.toLowerCase();
    return (
      (!q ||
        i.name.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        i.store.toLowerCase().includes(q)) &&
      (!filterCat || i.category === filterCat)
    );
  });

  const saveItem = () => {
    if (!itemForm.name.trim()) return;
    const rec = {
      ...itemForm,
      quantity: Number(itemForm.quantity) || 0,
      reorderLevel: Number(itemForm.reorderLevel) || 10,
    };
    if (editItem) {
      setItems((prev) =>
        prev.map((it) =>
          it.id === editItem.id ? { ...editItem, ...rec } : it,
        ),
      );
      toast.success("Item updated");
    } else {
      setItems((prev) => [...prev, { id: Date.now(), ...rec }]);
      toast.success("Item added");
    }
    setShowItemModal(false);
    setEditItem(null);
    setItemForm({
      name: "",
      category: "Stationery",
      store: "Main Store",
      quantity: "",
      unit: "Pcs",
      reorderLevel: "10",
    });
  };

  const saveIssue = () => {
    if (!issueForm.itemId || !issueForm.issuedTo || !issueForm.quantity) return;
    const item = items.find((i) => i.id === Number(issueForm.itemId));
    if (!item) return;
    const qty = Number(issueForm.quantity);
    if (qty > item.quantity) {
      toast.error("Insufficient stock");
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity - qty } : i,
      ),
    );
    setIssues((prev) => [
      ...prev,
      {
        id: Date.now(),
        itemId: item.id,
        itemName: item.name,
        quantity: qty,
        issuedTo: issueForm.issuedTo,
        recipientType: issueForm.recipientType,
        date: issueForm.date,
        returnDate: issueForm.returnDate,
        returned: false,
      },
    ]);
    toast.success(`${qty} ${item.name} issued to ${issueForm.issuedTo}`);
    setShowIssueModal(false);
    setIssueForm({
      itemId: "",
      quantity: "",
      issuedTo: "",
      recipientType: "Student",
      date: new Date().toISOString().split("T")[0],
      returnDate: "",
    });
  };

  const returnIssue = (id: number) => {
    const issue = issues.find((i) => i.id === id);
    if (!issue || issue.returned) return;
    setItems((prev) =>
      prev.map((i) =>
        i.id === issue.itemId
          ? { ...i, quantity: i.quantity + issue.quantity }
          : i,
      ),
    );
    setIssues((prev) =>
      prev.map((i) => (i.id === id ? { ...i, returned: true } : i)),
    );
    toast.success("Item returned to stock");
  };

  const lowStock = items.filter((i) => i.quantity <= i.reorderLevel);
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-lg font-semibold">
          Inventory Management
        </h2>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: "Total Items", value: items.length, color: "text-white" },
          { label: "Total Quantity", value: totalQty, color: "text-blue-400" },
          {
            label: "Low / Critical Stock",
            value: lowStock.length,
            color: "text-red-400",
          },
          {
            label: "Active Issues",
            value: issues.filter((i) => !i.returned).length,
            color: "text-yellow-400",
          },
        ].map((k) => (
          <div
            key={k.label}
            className="rounded-lg p-3"
            style={{ background: "#1a1f2e", border: "1px solid #374151" }}
          >
            <p className="text-gray-400 text-xs">{k.label}</p>
            <p className={`${k.color} text-2xl font-bold`}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {(["items", "issue", "categories", "report"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            data-ocid={`inventory.${t}.tab`}
            className={`px-4 py-1.5 rounded text-xs font-medium transition ${tab === t ? "bg-green-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}
          >
            {t === "items"
              ? "Stock Items"
              : t === "issue"
                ? "Issue / Return"
                : t === "categories"
                  ? "Categories & Stores"
                  : "Stock Report"}
          </button>
        ))}
      </div>

      {/* ─ STOCK ITEMS ─ */}
      {tab === "items" && (
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center bg-gray-800 border border-gray-700 rounded px-2 py-1.5 flex-1 max-w-xs">
              <Search size={13} className="text-gray-400 mr-1.5" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search items..."
                className="bg-transparent text-gray-300 text-xs outline-none w-full"
                data-ocid="inventory.search_input"
              />
            </div>
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-gray-300 text-xs outline-none"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id}>{c.name}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                setEditItem(null);
                setItemForm({
                  name: "",
                  category: "Stationery",
                  store: "Main Store",
                  quantity: "",
                  unit: "Pcs",
                  reorderLevel: "10",
                });
                setShowItemModal(true);
              }}
              data-ocid="inventory.primary_button"
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded"
            >
              <Plus size={13} /> Add Item
            </button>
          </div>
          <div className="rounded-lg overflow-hidden border border-gray-700">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: "#1a1f2e" }}>
                  {[
                    "#",
                    "Item Name",
                    "Category",
                    "Store",
                    "Qty",
                    "Unit",
                    "Reorder",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-3 py-2 text-gray-400 font-medium whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-3 py-8 text-center text-gray-500"
                      data-ocid="inventory.empty_state"
                    >
                      No items found.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, i) => {
                    const st = stockStatus(item.quantity, item.reorderLevel);
                    return (
                      <tr
                        key={item.id}
                        style={{
                          background: i % 2 === 0 ? "#111827" : "#0f1117",
                        }}
                        data-ocid={`inventory.item.${i + 1}`}
                      >
                        <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                        <td className="px-3 py-2 text-white font-medium">
                          {item.name}
                        </td>
                        <td className="px-3 py-2 text-blue-400">
                          {item.category}
                        </td>
                        <td className="px-3 py-2 text-gray-300">
                          {item.store}
                        </td>
                        <td className="px-3 py-2 text-white font-semibold">
                          {item.quantity}
                        </td>
                        <td className="px-3 py-2 text-gray-400">{item.unit}</td>
                        <td className="px-3 py-2 text-gray-400">
                          {item.reorderLevel}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] ${st.cls}`}
                          >
                            {st.label}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditItem(item);
                                setItemForm({
                                  name: item.name,
                                  category: item.category,
                                  store: item.store,
                                  quantity: String(item.quantity),
                                  unit: item.unit,
                                  reorderLevel: String(item.reorderLevel),
                                });
                                setShowItemModal(true);
                              }}
                              className="text-blue-400 hover:text-blue-300"
                              data-ocid={`inventory.edit_button.${i + 1}`}
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setItems((prev) =>
                                  prev.filter((x) => x.id !== item.id),
                                );
                                toast.success("Deleted");
                              }}
                              className="text-red-400 hover:text-red-300"
                              data-ocid={`inventory.delete_button.${i + 1}`}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─ ISSUE / RETURN ─ */}
      {tab === "issue" && (
        <div>
          <div className="flex justify-end mb-3">
            <button
              type="button"
              onClick={() => setShowIssueModal(true)}
              data-ocid="inventory.issue.primary_button"
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded"
            >
              <Plus size={13} /> Issue Item
            </button>
          </div>
          <div className="rounded-lg overflow-hidden border border-gray-700">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: "#1a1f2e" }}>
                  {[
                    "#",
                    "Item",
                    "Qty",
                    "Issued To",
                    "Type",
                    "Issue Date",
                    "Return Date",
                    "Status",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-3 py-2 text-gray-400 font-medium whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {issues.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-3 py-8 text-center text-gray-500"
                      data-ocid="inventory.issue.empty_state"
                    >
                      No items issued yet.
                    </td>
                  </tr>
                ) : (
                  issues.map((iss, i) => (
                    <tr
                      key={iss.id}
                      style={{
                        background: i % 2 === 0 ? "#111827" : "#0f1117",
                      }}
                      data-ocid={`inventory.issue.item.${i + 1}`}
                    >
                      <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                      <td className="px-3 py-2 text-white">{iss.itemName}</td>
                      <td className="px-3 py-2 text-yellow-400 font-medium">
                        {iss.quantity}
                      </td>
                      <td className="px-3 py-2 text-gray-300">
                        {iss.issuedTo}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded ${iss.recipientType === "Student" ? "bg-blue-900/40 text-blue-300" : "bg-purple-900/40 text-purple-300"}`}
                        >
                          {iss.recipientType}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-gray-400">{iss.date}</td>
                      <td className="px-3 py-2 text-gray-400">
                        {iss.returnDate || "-"}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded ${iss.returned ? "bg-green-900/40 text-green-400" : "bg-orange-900/40 text-orange-400"}`}
                        >
                          {iss.returned ? "Returned" : "Issued"}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        {!iss.returned && (
                          <button
                            type="button"
                            onClick={() => returnIssue(iss.id)}
                            className="text-xs bg-green-700 hover:bg-green-600 text-white px-2 py-0.5 rounded"
                          >
                            Return
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─ CATEGORIES & STORES ─ */}
      {tab === "categories" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-sm">Categories</h3>
              <button
                type="button"
                onClick={() => {
                  setCatForm({ name: "", type: "category", location: "" });
                  setShowCatModal(true);
                }}
                data-ocid="inventory.categories.primary_button"
                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded"
              >
                <Plus size={13} /> Add
              </button>
            </div>
            <div className="space-y-2">
              {categories.map((c, i) => (
                <div
                  key={c.id}
                  className="rounded-lg p-3 flex items-center justify-between"
                  style={{ background: "#1a1f2e", border: "1px solid #374151" }}
                  data-ocid={`inventory.categories.item.${i + 1}`}
                >
                  <span className="text-gray-300 text-xs">{c.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCategories((prev) =>
                        prev.filter((x) => x.id !== c.id),
                      );
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-sm">
                Stores / Locations
              </h3>
              <button
                type="button"
                onClick={() => {
                  setCatForm({ name: "", type: "store", location: "" });
                  setShowCatModal(true);
                }}
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded"
              >
                <Plus size={13} /> Add
              </button>
            </div>
            <div className="space-y-2">
              {stores.map((s, i) => (
                <div
                  key={s.id}
                  className="rounded-lg p-3 flex items-center justify-between"
                  style={{ background: "#1a1f2e", border: "1px solid #374151" }}
                  data-ocid={`inventory.stores.item.${i + 1}`}
                >
                  <div>
                    <div className="text-gray-300 text-xs font-medium">
                      {s.name}
                    </div>
                    <div className="text-gray-500 text-[10px]">
                      {s.location}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStores((prev) => prev.filter((x) => x.id !== s.id));
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─ STOCK REPORT ─ */}
      {tab === "report" && (
        <div>
          <div className="flex justify-end mb-3">
            <button
              type="button"
              onClick={() => {
                const win = window.open("", "_blank", "width=900,height=600");
                if (!win) return;
                const el = document.getElementById("inv-report-print");
                if (!el) return;
                win.document.write(
                  `<html><head><title>Inventory Report</title><style>body{font-family:Arial,sans-serif;font-size:11px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccc;padding:4px 8px}th{background:#e8f0fe}</style></head><body>${el.innerHTML}</body></html>`,
                );
                win.document.close();
                setTimeout(() => {
                  win.print();
                  win.close();
                }, 400);
              }}
              data-ocid="inventory.report.print.button"
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded"
            >
              <Printer size={13} /> Print Report
            </button>
          </div>
          <div id="inv-report-print">
            {lowStock.length > 0 && (
              <div className="mb-4">
                <h3 className="text-red-400 font-semibold text-sm mb-2">
                  ⚠️ Low / Critical Stock Alert ({lowStock.length} items)
                </h3>
                <div className="rounded-lg overflow-hidden border border-red-800">
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ background: "#1a1f2e" }}>
                        {[
                          "Item",
                          "Category",
                          "Current Qty",
                          "Reorder Level",
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
                      {lowStock.map((item, i) => {
                        const st = stockStatus(
                          item.quantity,
                          item.reorderLevel,
                        );
                        return (
                          <tr
                            key={item.id}
                            style={{
                              background: i % 2 === 0 ? "#111827" : "#0f1117",
                            }}
                          >
                            <td className="px-3 py-2 text-white">
                              {item.name}
                            </td>
                            <td className="px-3 py-2 text-gray-300">
                              {item.category}
                            </td>
                            <td className="px-3 py-2 text-red-400 font-bold">
                              {item.quantity}
                            </td>
                            <td className="px-3 py-2 text-gray-400">
                              {item.reorderLevel}
                            </td>
                            <td className="px-3 py-2">
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded ${st.cls}`}
                              >
                                {st.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <h3 className="text-white font-semibold text-sm mb-2">
              Category-wise Summary
            </h3>
            <div className="rounded-lg overflow-hidden border border-gray-700">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: "#1a1f2e" }}>
                    {["Category", "Items", "Total Qty", "Low Stock Items"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left px-3 py-2 text-gray-400 font-medium"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat, i) => {
                    const catItems = items.filter(
                      (it) => it.category === cat.name,
                    );
                    const catQty = catItems.reduce(
                      (s, it) => s + it.quantity,
                      0,
                    );
                    const catLow = catItems.filter(
                      (it) => it.quantity <= it.reorderLevel,
                    ).length;
                    return (
                      <tr
                        key={cat.id}
                        style={{
                          background: i % 2 === 0 ? "#111827" : "#0f1117",
                        }}
                      >
                        <td className="px-3 py-2 text-white">{cat.name}</td>
                        <td className="px-3 py-2 text-blue-400">
                          {catItems.length}
                        </td>
                        <td className="px-3 py-2 text-gray-300">{catQty}</td>
                        <td className="px-3 py-2">
                          {catLow > 0 ? (
                            <span className="text-red-400 font-semibold">
                              {catLow}
                            </span>
                          ) : (
                            <span className="text-green-400">0</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─ ITEM MODAL ─ */}
      {showItemModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          data-ocid="inventory.modal"
        >
          <div
            className="rounded-xl p-6 w-full max-w-md"
            style={{ background: "#1a1f2e", border: "1px solid #374151" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">
                {editItem ? "Edit Item" : "Add Inventory Item"}
              </h3>
              <button
                type="button"
                onClick={() => setShowItemModal(false)}
                className="text-gray-400 hover:text-white"
                data-ocid="inventory.close_button"
              >
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label
                  htmlFor="inv-name"
                  className="text-gray-400 text-xs block mb-1"
                >
                  Item Name
                </label>
                <input
                  id="inv-name"
                  value={itemForm.name}
                  onChange={(e) =>
                    setItemForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none focus:border-green-500"
                  data-ocid="inventory.input"
                />
              </div>
              <div>
                <label
                  htmlFor="inv-cat"
                  className="text-gray-400 text-xs block mb-1"
                >
                  Category
                </label>
                <select
                  id="inv-cat"
                  value={itemForm.category}
                  onChange={(e) =>
                    setItemForm((p) => ({ ...p, category: e.target.value }))
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="inv-store"
                  className="text-gray-400 text-xs block mb-1"
                >
                  Store
                </label>
                <select
                  id="inv-store"
                  value={itemForm.store}
                  onChange={(e) =>
                    setItemForm((p) => ({ ...p, store: e.target.value }))
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none"
                >
                  {stores.map((s) => (
                    <option key={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="inv-qty"
                  className="text-gray-400 text-xs block mb-1"
                >
                  Quantity
                </label>
                <input
                  id="inv-qty"
                  type="number"
                  value={itemForm.quantity}
                  onChange={(e) =>
                    setItemForm((p) => ({ ...p, quantity: e.target.value }))
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="inv-unit"
                  className="text-gray-400 text-xs block mb-1"
                >
                  Unit
                </label>
                <input
                  id="inv-unit"
                  value={itemForm.unit}
                  onChange={(e) =>
                    setItemForm((p) => ({ ...p, unit: e.target.value }))
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none"
                />
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="inv-reorder"
                  className="text-gray-400 text-xs block mb-1"
                >
                  Reorder Level
                </label>
                <input
                  id="inv-reorder"
                  type="number"
                  value={itemForm.reorderLevel}
                  onChange={(e) =>
                    setItemForm((p) => ({ ...p, reorderLevel: e.target.value }))
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={saveItem}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-2 rounded"
                data-ocid="inventory.submit_button"
              >
                {editItem ? "Update" : "Save"}
              </button>
              <button
                type="button"
                onClick={() => setShowItemModal(false)}
                className="flex-1 bg-gray-700 text-white text-xs py-2 rounded"
                data-ocid="inventory.cancel_button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─ ISSUE MODAL ─ */}
      {showIssueModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          data-ocid="inventory.issue.modal"
        >
          <div
            className="rounded-xl p-6 w-full max-w-md"
            style={{ background: "#1a1f2e", border: "1px solid #374151" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Issue Item</h3>
              <button
                type="button"
                onClick={() => setShowIssueModal(false)}
                className="text-gray-400 hover:text-white"
                data-ocid="inventory.issue.close_button"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="iss-item"
                  className="text-gray-400 text-xs block mb-1"
                >
                  Select Item
                </label>
                <select
                  id="iss-item"
                  value={issueForm.itemId}
                  onChange={(e) =>
                    setIssueForm((p) => ({ ...p, itemId: e.target.value }))
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none"
                  data-ocid="inventory.issue.select"
                >
                  <option value="">-- Select --</option>
                  {items.map((it) => (
                    <option key={it.id} value={it.id}>
                      {it.name} (Qty: {it.quantity})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="iss-qty"
                    className="text-gray-400 text-xs block mb-1"
                  >
                    Quantity
                  </label>
                  <input
                    id="iss-qty"
                    type="number"
                    value={issueForm.quantity}
                    onChange={(e) =>
                      setIssueForm((p) => ({ ...p, quantity: e.target.value }))
                    }
                    className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="iss-type"
                    className="text-gray-400 text-xs block mb-1"
                  >
                    Recipient Type
                  </label>
                  <select
                    id="iss-type"
                    value={issueForm.recipientType}
                    onChange={(e) =>
                      setIssueForm((p) => ({
                        ...p,
                        recipientType: e.target.value as "Student" | "Staff",
                      }))
                    }
                    className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none"
                  >
                    <option>Student</option>
                    <option>Staff</option>
                  </select>
                </div>
              </div>
              <div>
                <label
                  htmlFor="iss-to"
                  className="text-gray-400 text-xs block mb-1"
                >
                  Issued To (Name)
                </label>
                <input
                  id="iss-to"
                  value={issueForm.issuedTo}
                  onChange={(e) =>
                    setIssueForm((p) => ({ ...p, issuedTo: e.target.value }))
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="iss-date"
                    className="text-gray-400 text-xs block mb-1"
                  >
                    Issue Date
                  </label>
                  <input
                    id="iss-date"
                    type="date"
                    value={issueForm.date}
                    onChange={(e) =>
                      setIssueForm((p) => ({ ...p, date: e.target.value }))
                    }
                    className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="iss-return"
                    className="text-gray-400 text-xs block mb-1"
                  >
                    Expected Return
                  </label>
                  <input
                    id="iss-return"
                    type="date"
                    value={issueForm.returnDate}
                    onChange={(e) =>
                      setIssueForm((p) => ({
                        ...p,
                        returnDate: e.target.value,
                      }))
                    }
                    className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={saveIssue}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 rounded"
                data-ocid="inventory.issue.submit_button"
              >
                Issue
              </button>
              <button
                type="button"
                onClick={() => setShowIssueModal(false)}
                className="flex-1 bg-gray-700 text-white text-xs py-2 rounded"
                data-ocid="inventory.issue.cancel_button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─ CAT/STORE MODAL ─ */}
      {showCatModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          data-ocid="inventory.categories.modal"
        >
          <div
            className="rounded-xl p-6 w-full max-w-sm"
            style={{ background: "#1a1f2e", border: "1px solid #374151" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">
                Add {catForm.type === "category" ? "Category" : "Store"}
              </h3>
              <button
                type="button"
                onClick={() => setShowCatModal(false)}
                className="text-gray-400 hover:text-white"
                data-ocid="inventory.categories.close_button"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="cat-name"
                  className="text-gray-400 text-xs block mb-1"
                >
                  Name
                </label>
                <input
                  id="cat-name"
                  value={catForm.name}
                  onChange={(e) =>
                    setCatForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none"
                />
              </div>
              {catForm.type === "store" && (
                <div>
                  <label
                    htmlFor="cat-loc"
                    className="text-gray-400 text-xs block mb-1"
                  >
                    Location
                  </label>
                  <input
                    id="cat-loc"
                    value={catForm.location}
                    onChange={(e) =>
                      setCatForm((p) => ({ ...p, location: e.target.value }))
                    }
                    className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={() => {
                  if (!catForm.name.trim()) return;
                  if (catForm.type === "category") {
                    setCategories((prev) => [
                      ...prev,
                      { id: Date.now(), name: catForm.name },
                    ]);
                  } else {
                    setStores((prev) => [
                      ...prev,
                      {
                        id: Date.now(),
                        name: catForm.name,
                        location: catForm.location,
                      },
                    ]);
                  }
                  toast.success("Added");
                  setShowCatModal(false);
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-2 rounded"
                data-ocid="inventory.categories.submit_button"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowCatModal(false)}
                className="flex-1 bg-gray-700 text-white text-xs py-2 rounded"
                data-ocid="inventory.categories.cancel_button"
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
