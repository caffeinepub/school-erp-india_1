import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Archive,
  Bell,
  Building2,
  Calendar,
  CheckSquare,
  ChevronDown,
  Eye,
  EyeOff,
  KeyRound,
  LogOut,
  Menu,
  RefreshCw,
  Search,
  User,
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
  driver: "bg-teal-500/20 text-teal-300 border-teal-500/30",
};

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  accountant: "Accountant",
  librarian: "Librarian",
  teacher: "Teacher",
  parent: "Parent",
  student: "Student",
  driver: "Driver",
};

interface HeaderProps {
  onToggleSidebar: () => void;
  isOnline: boolean;
  isSyncing: boolean;
}

export function Header({ onToggleSidebar, isOnline, isSyncing }: HeaderProps) {
  const { user, logout, changePassword } = useAuth();
  const { branches, activeBranch, setActiveBranch } = useSchool();
  const [branchOpen, setBranchOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const [sessionOpen, setSessionOpen] = useState(false);
  const sessionRef = useRef<HTMLDivElement>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [viewingSession, setViewingSession] = useState<string>(() => {
    return localStorage.getItem("erp_viewing_session") || "";
  });

  // Change password modal
  const [changePwdOpen, setChangePwdOpen] = useState(false);
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

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
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sessionButtonLabel = viewingSession
    ? viewingSession
    : `Current Session: ${currentActiveSession}`;

  const handleChangePwd = () => {
    setPwdError("");
    setPwdSuccess(false);
    if (!currentPwd || !newPwd || !confirmPwd) {
      setPwdError("All fields are required.");
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdError("New passwords do not match.");
      return;
    }
    if (newPwd.length < 4) {
      setPwdError("Password must be at least 4 characters.");
      return;
    }
    if (!user) return;
    const success = changePassword(user.userId, currentPwd, newPwd);
    if (!success) {
      setPwdError("Current password is incorrect.");
      return;
    }
    setPwdSuccess(true);
    setCurrentPwd("");
    setNewPwd("");
    setConfirmPwd("");
    setTimeout(() => {
      setChangePwdOpen(false);
      setPwdSuccess(false);
    }, 1500);
  };

  return (
    <>
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
            SHUBH SCHOOL ERP
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
                  : "text-green-300 bg-green-900/20 hover:bg-green-900/30 border-green-600/50 hover:text-white"
              }`}
              data-ocid="header.session.toggle"
            >
              <Archive
                size={11}
                className={viewingSession ? "text-amber-400" : "text-green-400"}
              />
              <span className="hidden sm:inline max-w-[160px] truncate">
                {sessionButtonLabel}
              </span>
              <ChevronDown size={11} />
            </button>
            {sessionOpen && (
              <div
                className="absolute top-full left-0 mt-1 z-50 min-w-[180px] rounded border border-gray-600 shadow-xl"
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
                      <span>{isCurrent ? `Current Session: ${s}` : s}</span>
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

          {/* User Profile Dropdown */}
          {user && (
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 ml-1 pl-2 border-l border-gray-700 hover:bg-gray-700/50 rounded px-2 py-1 transition"
                data-ocid="header.profile.toggle"
              >
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
                <User size={16} className="text-gray-400" />
                <ChevronDown size={11} className="text-gray-400" />
              </button>
              {profileOpen && (
                <div
                  className="absolute top-full right-0 mt-1 z-50 min-w-[180px] rounded border border-gray-600 shadow-xl"
                  style={{ background: "#1e293b" }}
                >
                  <div className="px-3 py-2 border-b border-gray-700">
                    <p className="text-white text-xs font-medium">
                      {user.name}
                    </p>
                    <p className="text-gray-400 text-[10px]">
                      {ROLE_LABELS[user.role]}
                    </p>
                    <p className="text-gray-500 text-[10px] font-mono">
                      {user.userId}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      setChangePwdOpen(true);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-gray-700 transition"
                    data-ocid="header.change_password.button"
                  >
                    <KeyRound size={13} /> Change Password
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-900/20 transition rounded-b"
                    data-ocid="header.button"
                  >
                    <LogOut size={13} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Change Password Modal */}
      {changePwdOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.7)" }}
          data-ocid="change_password.dialog"
        >
          <div
            className="rounded-xl p-6 w-full max-w-sm shadow-2xl"
            style={{ background: "#1a1f2e", border: "1px solid #374151" }}
          >
            <h3 className="text-white text-base font-semibold mb-1">
              Change Password
            </h3>
            <p className="text-gray-400 text-xs mb-4">
              Update your account password
            </p>
            {pwdSuccess ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-2">✅</div>
                <p className="text-green-400 font-semibold">
                  Password changed successfully!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="hdr-current-password"
                    className="text-gray-400 text-xs block mb-1"
                  >
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      id="hdr-current-password"
                      type={showCurrent ? "text" : "password"}
                      value={currentPwd}
                      onChange={(e) => setCurrentPwd(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm outline-none focus:border-blue-500 pr-8"
                      data-ocid="change_password.input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="hdr-new-password"
                    className="text-gray-400 text-xs block mb-1"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="hdr-new-password"
                      type={showNew ? "text" : "password"}
                      value={newPwd}
                      onChange={(e) => setNewPwd(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm outline-none focus:border-blue-500 pr-8"
                      data-ocid="change_password.input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="hdr-confirm-new-password"
                    className="text-gray-400 text-xs block mb-1"
                  >
                    Confirm New Password
                  </label>
                  <input
                    id="hdr-confirm-password"
                    type="password"
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleChangePwd()}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm outline-none focus:border-blue-500"
                    data-ocid="change_password.input"
                  />
                </div>
                {pwdError && (
                  <p
                    className="text-red-400 text-xs"
                    data-ocid="change_password.error_state"
                  >
                    {pwdError}
                  </p>
                )}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleChangePwd}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 text-sm font-medium transition"
                    data-ocid="change_password.submit_button"
                  >
                    Change Password
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setChangePwdOpen(false);
                      setPwdError("");
                      setCurrentPwd("");
                      setNewPwd("");
                      setConfirmPwd("");
                    }}
                    className="px-4 py-2 text-sm text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded transition"
                    data-ocid="change_password.cancel_button"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
