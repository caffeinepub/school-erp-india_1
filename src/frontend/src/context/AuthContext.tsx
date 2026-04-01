import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { defaultPermissions } from "../data/permissions";
import type { Role, RolePermissions, User } from "../types/auth";

interface DemoUser {
  userId: string;
  password: string;
  name: string;
  role: Role;
}

const DEMO_USERS: DemoUser[] = [
  {
    userId: "superadmin",
    password: "admin123",
    name: "Super Admin",
    role: "super_admin",
  },
  {
    userId: "admin",
    password: "admin123",
    name: "School Admin",
    role: "admin",
  },
  {
    userId: "accountant",
    password: "acc123",
    name: "Ramesh Gupta",
    role: "accountant",
  },
  {
    userId: "librarian",
    password: "lib123",
    name: "Sunita Sharma",
    role: "librarian",
  },
  {
    userId: "teacher",
    password: "teacher123",
    name: "Priya Nair",
    role: "teacher",
  },
  {
    userId: "parent",
    password: "parent123",
    name: "Vijay Mehta",
    role: "parent",
  },
  {
    userId: "student",
    password: "student123",
    name: "Aarav Mehta",
    role: "student",
  },
];

const AUTH_KEY = "erp_auth_user";
const PERMS_KEY = "erp_role_permissions";

interface AuthContextValue {
  user: User | null;
  login: (userId: string, password: string, role: Role) => boolean;
  logout: () => void;
  permissions: Record<Role, RolePermissions>;
  updateRolePermissions: (role: Role, perms: RolePermissions) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [permissions, setPermissions] = useState<Record<Role, RolePermissions>>(
    () => {
      try {
        const stored = localStorage.getItem(PERMS_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Merge with defaults to ensure all roles/modules exist
          return { ...defaultPermissions, ...parsed };
        }
      } catch {}
      return defaultPermissions;
    },
  );

  useEffect(() => {
    if (user) localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    else localStorage.removeItem(AUTH_KEY);
  }, [user]);

  const login = useCallback(
    (userId: string, password: string, role: Role): boolean => {
      const found = DEMO_USERS.find(
        (u) =>
          u.userId === userId && u.password === password && u.role === role,
      );
      if (found) {
        const newUser: User = {
          id: found.userId,
          name: found.name,
          role: found.role,
          userId: found.userId,
        };
        setUser(newUser);
        return true;
      }
      return false;
    },
    [],
  );

  const logout = useCallback(() => setUser(null), []);

  const updateRolePermissions = useCallback(
    (role: Role, perms: RolePermissions) => {
      setPermissions((prev) => {
        const next = { ...prev, [role]: perms };
        localStorage.setItem(PERMS_KEY, JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  return (
    <AuthContext.Provider
      value={{ user, login, logout, permissions, updateRolePermissions }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { DEMO_USERS };
export type { DemoUser };
