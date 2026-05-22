// Mock auth via localStorage — frontend demo only, no real auth.
import { useEffect, useState, useSyncExternalStore } from "react";

const KEY = "lootminer-auth";

type AuthState = { username: string; avatar: string } | null;

const listeners = new Set<() => void>();
function emit() { listeners.forEach((l) => l()); }

function read(): AuthState {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(KEY) ?? "null"); } catch { return null; }
}

export function signIn(username = "CrystalMiner", avatar = "CM") {
  localStorage.setItem(KEY, JSON.stringify({ username, avatar }));
  emit();
}
export function signOut() {
  localStorage.removeItem(KEY);
  emit();
}

export function useAuth(): AuthState {
  // SSR-safe: snapshots on client only after mount
  const [state, setState] = useState<AuthState>(null);
  useEffect(() => {
    setState(read());
    const handler = () => setState(read());
    listeners.add(handler);
    window.addEventListener("storage", handler);
    return () => { listeners.delete(handler); window.removeEventListener("storage", handler); };
  }, []);
  return state;
}
