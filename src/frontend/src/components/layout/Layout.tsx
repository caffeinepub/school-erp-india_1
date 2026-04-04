import { useEffect, useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
  currentPath: string;
  navigate: (path: string) => void;
  isOnline: boolean;
  isSyncing: boolean;
  children: React.ReactNode;
}

export function Layout({
  collapsed,
  onToggleSidebar,
  currentPath,
  navigate,
  isOnline,
  isSyncing,
  children,
}: LayoutProps) {
  const [viewingSession, setViewingSession] = useState<string>(
    () => localStorage.getItem("erp_viewing_session") || "",
  );

  useEffect(() => {
    function handleSessionChange(e: CustomEvent) {
      setViewingSession(e.detail.session || "");
    }
    window.addEventListener(
      "erp_session_changed",
      handleSessionChange as EventListener,
    );
    return () =>
      window.removeEventListener(
        "erp_session_changed",
        handleSessionChange as EventListener,
      );
  }, []);

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#0f1117" }}
    >
      <Sidebar
        collapsed={collapsed}
        currentPath={currentPath}
        navigate={navigate}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          onToggleSidebar={onToggleSidebar}
          isOnline={isOnline}
          isSyncing={isSyncing}
        />
        {viewingSession && (
          <div
            className="flex items-center justify-between px-4 py-1.5 text-xs font-medium"
            style={{
              background: "#78350f",
              color: "#fef3c7",
              borderBottom: "1px solid #92400e",
            }}
          >
            <span>
              📂 Viewing archived session: <strong>{viewingSession}</strong> —
              Read Only
            </span>
            <button
              type="button"
              onClick={() => {
                localStorage.setItem("erp_viewing_session", "");
                setViewingSession("");
                window.dispatchEvent(
                  new CustomEvent("erp_session_changed", {
                    detail: { session: "" },
                  }),
                );
              }}
              className="underline hover:no-underline text-amber-200 hover:text-white transition"
            >
              Return to current session →
            </button>
          </div>
        )}
        <main
          className="flex-1 overflow-y-auto p-4"
          style={{ background: "#0f1117" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
