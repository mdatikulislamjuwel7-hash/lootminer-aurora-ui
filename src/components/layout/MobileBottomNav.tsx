import { Link } from "@tanstack/react-router";
import { LayoutDashboard, Sparkles, Wallet, Trophy, Menu } from "lucide-react";
import { NavDrawer } from "./NavDrawer";

const items = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/earn", label: "Earn", icon: Sparkles },
  { to: "/cashout", label: "Cashout", icon: Wallet },
  { to: "/rewards", label: "Rewards", icon: Trophy },
] as const;

export function MobileBottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 md:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="mx-3 mb-3 rounded-2xl glass shadow-card">
        <ul className="grid grid-cols-5">
          {items.map((it) => (
            <li key={it.to}>
              <Link
                to={it.to}
                activeOptions={{ exact: it.exact }}
                className="group flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium text-muted-foreground transition"
                activeProps={{ className: "text-foreground" }}
              >
                {({ isActive }) => (
                  <>
                    <span className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition ${isActive ? "bg-gradient-primary shadow-glow-primary text-primary-foreground" : "group-hover:bg-card/60"}`}>
                      <it.icon className="h-4 w-4" />
                    </span>
                    <span>{it.label}</span>
                  </>
                )}
              </Link>
            </li>
          ))}
          <li>
            <NavDrawer
              trigger={
                <button className="group flex w-full flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium text-muted-foreground">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl group-hover:bg-card/60 transition">
                    <Menu className="h-4 w-4" />
                  </span>
                  <span>Menu</span>
                </button>
              }
            />
          </li>
        </ul>
      </div>
    </nav>
  );
}
