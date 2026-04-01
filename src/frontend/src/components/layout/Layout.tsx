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
