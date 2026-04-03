import { MessageCircle, Plus, Search, X } from "lucide-react";
import { useState } from "react";

interface Notice {
  id: number;
  title: string;
  message: string;
  target: string;
  date: string;
}

const initialNotices: Notice[] = [];

export function Communicate() {
  const [activeTab, setActiveTab] = useState<"notice" | "whatsapp">("notice");
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [showModal, setShowModal] = useState(false);
  const [noticeSearch, setNoticeSearch] = useState("");
  const [form, setForm] = useState({ title: "", message: "", target: "All" });

  // Live filtered notices
  const filteredNotices = noticeSearch.trim()
    ? notices.filter(
        (n) =>
          n.title.toLowerCase().includes(noticeSearch.toLowerCase()) ||
          n.message.toLowerCase().includes(noticeSearch.toLowerCase()) ||
          n.target.toLowerCase().includes(noticeSearch.toLowerCase()),
      )
    : notices;

  const handleAdd = () => {
    if (!form.title || !form.message) return;
    const today = new Date().toLocaleDateString("en-IN");
    setNotices((prev) => [
      { id: prev.length + 1, ...form, date: today },
      ...prev,
    ]);
    setShowModal(false);
    setForm({ title: "", message: "", target: "All" });
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-700 mb-4">
        <button
          type="button"
          onClick={() => setActiveTab("notice")}
          data-ocid="communicate.notice.tab"
          className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === "notice"
              ? "text-green-400 border-green-400"
              : "text-gray-400 border-transparent hover:text-gray-200"
          }`}
        >
          Notice Board
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("whatsapp")}
          data-ocid="communicate.whatsapp.tab"
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === "whatsapp"
              ? "text-green-400 border-green-400"
              : "text-gray-400 border-transparent hover:text-gray-200"
          }`}
        >
          <MessageCircle size={12} style={{ color: "#25D366" }} />
          WhatsApp
        </button>
      </div>

      {activeTab === "notice" && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white text-lg font-semibold">Notice Board</h2>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              data-ocid="communicate.notice.open_modal_button"
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded"
            >
              <Plus size={14} /> Add Notice
            </button>
          </div>
          <div className="flex items-center bg-gray-800 border border-gray-700 rounded px-2 py-1.5 mb-3 max-w-xs">
            <Search size={12} className="text-gray-400 mr-1.5" />
            <input
              value={noticeSearch}
              onChange={(e) => setNoticeSearch(e.target.value)}
              placeholder="Search notices..."
              className="bg-transparent text-gray-300 text-xs outline-none w-full"
              data-ocid="communicate.notice.search_input"
            />
          </div>
          <div className="space-y-3">
            {filteredNotices.length === 0 && notices.length === 0 && (
              <div
                className="rounded-lg p-8 text-center text-gray-500 text-sm"
                style={{ background: "#1a1f2e", border: "1px solid #374151" }}
                data-ocid="communicate.notice.empty_state"
              >
                No notices yet. Click "Add Notice" to publish one.
              </div>
            )}
            {filteredNotices.map((n, i) => (
              <div
                key={n.id}
                className="rounded-lg p-4"
                style={{ background: "#1a1f2e", border: "1px solid #374151" }}
                data-ocid={`communicate.notice.item.${i + 1}`}
              >
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-white text-sm font-medium">{n.title}</h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] ${
                        n.target === "All"
                          ? "bg-blue-900/50 text-blue-400"
                          : n.target === "Students"
                            ? "bg-green-900/50 text-green-400"
                            : "bg-purple-900/50 text-purple-400"
                      }`}
                    >
                      {n.target}
                    </span>
                    <span className="text-gray-500 text-xs">{n.date}</span>
                  </div>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">
                  {n.message}
                </p>
              </div>
            ))}
          </div>
          {showModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div
                className="rounded-xl p-6 w-full max-w-md"
                style={{ background: "#1a1f2e", border: "1px solid #374151" }}
                data-ocid="communicate.notice.modal"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Add Notice</h3>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    data-ocid="communicate.notice.close_button"
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="comm-title"
                      className="text-gray-400 text-xs block mb-1"
                    >
                      Title
                    </label>
                    <input
                      id="comm-title"
                      value={form.title}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, title: e.target.value }))
                      }
                      data-ocid="communicate.notice.input"
                      className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="comm-target"
                      className="text-gray-400 text-xs block mb-1"
                    >
                      Target Audience
                    </label>
                    <select
                      id="comm-target"
                      value={form.target}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, target: e.target.value }))
                      }
                      data-ocid="communicate.notice.select"
                      className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none"
                    >
                      {["All", "Students", "Staff", "Parents"].map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="comm-message"
                      className="text-gray-400 text-xs block mb-1"
                    >
                      Message
                    </label>
                    <textarea
                      id="comm-message"
                      value={form.message}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, message: e.target.value }))
                      }
                      rows={4}
                      data-ocid="communicate.notice.textarea"
                      className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none focus:border-green-500 resize-none"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
                    onClick={handleAdd}
                    data-ocid="communicate.notice.submit_button"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-2 rounded"
                  >
                    Publish
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    data-ocid="communicate.notice.cancel_button"
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "whatsapp" && (
        <div
          className="rounded-xl p-8 text-center"
          style={{ background: "#1a1f2e", border: "1px solid #374151" }}
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "#25D366" }}
          >
            <MessageCircle size={24} className="text-white" />
          </div>
          <h3 className="text-white text-sm font-semibold mb-1">
            WhatsApp Communication Module
          </h3>
          <p className="text-gray-400 text-xs mb-4">
            Send fee reminders, receipts, admission confirmations, exam
            schedules, and holiday notices via WhatsApp.
          </p>
          <button
            type="button"
            onClick={() => {
              window.location.hash = "/whatsapp";
            }}
            data-ocid="communicate.whatsapp.primary_button"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-white text-xs font-medium transition-opacity hover:opacity-90"
            style={{ background: "#25D366" }}
          >
            <MessageCircle size={14} />
            Go to WhatsApp Module
          </button>
        </div>
      )}
    </div>
  );
}
