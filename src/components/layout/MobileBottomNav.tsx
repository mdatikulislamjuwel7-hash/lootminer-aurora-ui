import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Sparkles, Wallet, Trophy, Menu } from "lucide-react";
import { NavDrawer } from "./NavDrawer";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/earn", label: "Earn", icon: Sparkles },
  { to: "/cashout", label: "Cashout", icon: Wallet },
  { to: "/rewards", label: "Rewards", icon: Trophy },
] as const;

export function MobileBottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 md:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="mx-3 mb-3 rounded-2xl glass shadow-card">
        <ul className="grid grid-cols-5">
          {items.map((it) => {
            const active = pathname === it.to;
            return (
              <li key={it.to}>
                <Link
                  to={it.to}
                  className="group flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition"
                >
                  <span className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition ${
                    active ? "bg-gradient-primary shadow-glow-primary text-primary-foreground" : "group-hover:bg-card/60 text-muted-foreground"
                  }`}>
                    <it.icon className="h-4 w-4" />
                  </span>
                  <span className={active ? "text-foreground" : "text-muted-foreground"}>{it.label}</span>
                </Link>
              </li>
            );
          })}
          <li>
            <NavDrawer
              trigger={
                <button type="button" aria-label="Open menu" className="group flex w-full flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium text-muted-foreground">
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
