import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Calendar,
  CheckSquare,
  LogOut,
  Menu,
  RefreshCw,
  Search,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

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
