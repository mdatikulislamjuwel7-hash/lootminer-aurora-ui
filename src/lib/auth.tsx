import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { authAPI } from "@/lib/api";

export type AuthUser = {
  id: number | string;
  username: string;
  email: string;
  avatar?: string | null;
  role?: string;
  level?: number;
  balanceXp?: number;
  referralCode?: string;
  country?: string | null;
  joinDate?: string;
  emailVerified?: boolean;
  [k: string]: any;
};

type AuthContextValue = {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: Record<string, unknown>) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
};

const Ctx = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "lm_token";
const USER_KEY = "lm_user";

function readUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(USER_KEY) ?? "null"); } catch { return null; }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (typeof window === "undefined") { setIsLoading(false); return; }
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const res = await authAPI.me();
      const u: AuthUser = res?.user ?? res;
      setUser(u);
      localStorage.setItem(USER_KEY, JSON.stringify(u));
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Hydrate from cache immediately, then verify in background.
    setUser(readUser());
    void refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authAPI.login({ email, password });
    const token = res?.token ?? res?.accessToken;
    const u: AuthUser = res?.user ?? res;
    if (!token) throw new Error("Invalid login response");
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setUser(u);
  }, []);

  const register = useCallback(async (data: Record<string, unknown>) => {
    const res = await authAPI.register(data);
    const token = res?.token ?? res?.accessToken;
    const u: AuthUser = res?.user ?? res;
    if (!token) throw new Error("Invalid register response");
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  return (
    <Ctx.Provider value={{ user, isLoggedIn: !!user, isLoading, login, register, logout, refresh }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) {
    // SSR / outside provider — return inert defaults.
    return {
      user: null,
      isLoggedIn: false,
      isLoading: false,
      login: async () => { throw new Error("AuthProvider missing"); },
      register: async () => { throw new Error("AuthProvider missing"); },
      logout: () => {},
      refresh: async () => {},
    };
  }
  return ctx;
}

/** Render-time guard for user routes. Shows spinner during init, redirects home if signed out. */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    if (!isLoading && !isLoggedIn) nav({ to: "/" });
  }, [isLoading, isLoggedIn, nav]);
  if (isLoading) return <AuthSpinner />;
  if (!isLoggedIn) return null;
  return <>{children}</>;
}

/** Admin-only guard. Redirects home if user is not admin. */
export function AdminRoute({ children }: { children: ReactNode }) {
  const { user, isLoggedIn, isLoading } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    if (isLoading) return;
    if (!isLoggedIn || user?.role !== "admin") nav({ to: "/" });
  }, [user, isLoggedIn, isLoading, nav]);
  if (isLoading) return <AuthSpinner />;
  if (!isLoggedIn || user?.role !== "admin") return null;
  return <>{children}</>;
}

function AuthSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}
