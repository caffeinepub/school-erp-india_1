import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Archive,
  Bell,
  Building2,
  Calendar,
  CheckSquare,
  ChevronDown,
  LogOut,
  Menu,
  RefreshCw,
  Search,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSchool } from "../../context/SchoolContext";

const ROLE_COLORS: Record<string, string> = {
  super_admin: "bg-red-500/20 text-red-300 border-red-500/30",
  admin: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  accountant: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  librarian: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  teacher: "bg-green-500/20 text-green-300 border-green-500/30",
  parent: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  student: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
};

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  accountant: "Accountant",
  librarian: "Librarian",
  teacher: "Teacher",
  parent: "Parent",
  student: "Student",
};

interface HeaderProps {
  onToggleSidebar: () => void;
  isOnline: boolean;
  isSyncing: boolean;
}

export function Header({ onToggleSidebar, isOnline, isSyncing }: HeaderProps) {
  const { user, logout } = useAuth();
  const { branches, activeBranch, setActiveBranch } = useSchool();
  const [branchOpen, setBranchOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const [sessionOpen, setSessionOpen] = useState(false);
  const sessionRef = useRef<HTMLDivElement>(null);
  const [viewingSession, setViewingSession] = useState<string>(() => {
    return localStorage.getItem("erp_viewing_session") || "";
  });

  const archivedSessions: string[] = (() => {
    const sessions: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("erp_session_archive_")) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || "{}");
          if (data.sessionLabel) sessions.push(data.sessionLabel);
        } catch {
          /* ignore */
        }
      }
    }
    return sessions;
  })();

  const currentActiveSession = (() => {
    try {
      return (
        JSON.parse(localStorage.getItem("erp_settings") || "{}").session ||
        "2025-26"
      );
    } catch {
      return "2025-26";
    }
  })();

  const allSessions = [
    currentActiveSession,
    ...archivedSessions.filter((s) => s !== currentActiveSession),
  ];

  const switchSession = (session: string) => {
    const val = session === currentActiveSession ? "" : session;
    setViewingSession(val);
    localStorage.setItem("erp_viewing_session", val);
    setSessionOpen(false);
    window.dispatchEvent(
      new CustomEvent("erp_session_changed", { detail: { session: val } }),
    );
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        sessionRef.current &&
        !sessionRef.current.contains(e.target as Node)
      ) {
        setSessionOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className="flex items-center justify-between px-4 h-12 border-b border-gray-700 flex-shrink-0"
      style={{ background: "#1a1f2e" }}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="text-gray-300 hover:text-white p-1"
          data-ocid="header.toggle"
        >
          <Menu size={20} />
        </button>
        <span className="text-white font-semibold text-sm hidden sm:block">
          School ERP
        </span>

        {/* Branch Switcher */}
        <div className="relative" ref={dropRef}>
          <button
            type="button"
            onClick={() => setBranchOpen((v) => !v)}
            className="flex items-center gap-1 text-xs text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded px-2 py-1 transition"
            data-ocid="header.branch.toggle"
          >
            <Building2 size={12} className="text-blue-400" />
            <span className="hidden sm:inline max-w-[120px] truncate">
              {activeBranch?.name ?? "Select Branch"}
            </span>
            <ChevronDown size={11} />
          </button>
          {branchOpen && (
            <div
              className="absolute top-full left-0 mt-1 z-50 min-w-[160px] rounded border border-gray-600 shadow-xl"
              style={{ background: "#1e293b" }}
            >
              {branches.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    setActiveBranch(b);
                    setBranchOpen(false);
                  }}
                  data-ocid="header.branch.item"
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-700 transition ${
                    activeBranch?.id === b.id
                      ? "text-blue-400 font-semibold"
                      : "text-gray-300"
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Session Switcher */}
        <div className="relative" ref={sessionRef}>
          <button
            type="button"
            onClick={() => setSessionOpen((v) => !v)}
            className={`flex items-center gap-1 text-xs border rounded px-2 py-1 transition ${
              viewingSession
                ? "text-amber-300 bg-amber-900/30 border-amber-500/50 hover:bg-amber-900/40"
                : "text-gray-300 bg-gray-800 hover:bg-gray-700 border-gray-600 hover:text-white"
            }`}
            data-ocid="header.session.toggle"
          >
            <Archive
              size={11}
              className={viewingSession ? "text-amber-400" : "text-blue-400"}
            />
            <span className="hidden sm:inline max-w-[100px] truncate">
              {viewingSession
                ? viewingSession
                : currentActiveSession || "Session"}
            </span>
            <ChevronDown size={11} />
          </button>
          {sessionOpen && (
            <div
              className="absolute top-full left-0 mt-1 z-50 min-w-[160px] rounded border border-gray-600 shadow-xl"
              style={{ background: "#1e293b" }}
            >
              <div className="px-3 py-1.5 text-[10px] text-gray-500 font-semibold uppercase tracking-wider border-b border-gray-700">
                Select Session
              </div>
              {allSessions.map((s) => {
                const isCurrent = s === currentActiveSession;
                const isSelected = viewingSession
                  ? s === viewingSession
                  : isCurrent;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => switchSession(s)}
                    data-ocid="header.session.item"
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-700 transition flex items-center justify-between ${
                      isSelected
                        ? "text-blue-400 font-semibold"
                        : "text-gray-300"
                    }`}
                  >
                    <span>{s}</span>
                    <span className="flex items-center gap-1">
                      {isCurrent && (
                        <span className="text-[9px] bg-green-900/50 text-green-400 px-1.5 py-0.5 rounded">
                          Active
                        </span>
                      )}
                      {isSelected && <span className="text-blue-400">✓</span>}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-1 max-w-xs mx-4">
        <div className="flex items-center bg-gray-800 rounded px-2 py-1 flex-1">
          <Search size={14} className="text-gray-400 mr-1" />
          <input
            placeholder="Search By Student"
            className="bg-transparent text-gray-300 text-xs outline-none w-full"
            data-ocid="header.search_input"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isSyncing ? (
          <span className="flex items-center gap-1 text-yellow-400 text-xs bg-yellow-900/30 px-2 py-0.5 rounded-full">
            <RefreshCw size={10} className="animate-spin" /> Syncing
          </span>
        ) : isOnline ? (
          <span className="flex items-center gap-1 text-green-400 text-xs bg-green-900/30 px-2 py-0.5 rounded-full">
            <Wifi size={10} /> Online
          </span>
        ) : (
          <span className="flex items-center gap-1 text-orange-400 text-xs bg-orange-900/30 px-2 py-0.5 rounded-full">
            <WifiOff size={10} /> Offline
          </span>
        )}
        <button type="button" className="text-gray-400 hover:text-white">
          <Calendar size={16} />
        </button>
        <button type="button" className="text-gray-400 hover:text-white">
          <CheckSquare size={16} />
        </button>
        <button
          type="button"
          className="text-gray-400 hover:text-white relative"
        >
          <Bell size={16} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] rounded-full w-3.5 h-3.5 flex items-center justify-center">
            0
          </span>
        </button>

        {/* User info */}
        {user && (
          <div className="flex items-center gap-2 ml-1 pl-2 border-l border-gray-700">
            <div className="hidden sm:block text-right">
              <p className="text-white text-xs font-medium leading-none">
                {user.name}
              </p>
              <Badge
                variant="outline"
                className={`text-[9px] px-1 py-0 mt-0.5 border ${
                  ROLE_COLORS[user.role] ?? "bg-gray-700 text-gray-300"
                }`}
              >
                {ROLE_LABELS[user.role] ?? user.role}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-gray-400 hover:text-white hover:bg-gray-700 h-7 px-2 text-xs"
              data-ocid="header.button"
              title="Logout"
            >
              <LogOut size={14} className="mr-1" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
