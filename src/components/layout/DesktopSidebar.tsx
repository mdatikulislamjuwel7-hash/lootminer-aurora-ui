import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Sparkles, Wallet, Trophy, Users, LifeBuoy, Crown, Flame,
} from "lucide-react";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/earn", label: "Earn", icon: Sparkles },
  { to: "/top-offers", label: "Top Offers", icon: Flame },
  { to: "/cashout", label: "Cashout", icon: Wallet },
  { to: "/rewards", label: "Rewards", icon: Trophy },
  { to: "/ranking", label: "Ranking", icon: Crown },
  { to: "/referrals", label: "Referrals", icon: Users },
  { to: "/support", label: "Support", icon: LifeBuoy },
] as const;

export function DesktopSidebar({ collapsed }: { collapsed: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside
      className={`hidden md:flex sticky top-4 self-start h-[calc(100vh-2rem)] shrink-0 transition-[width] duration-300 ${
        collapsed ? "w-[72px]" : "w-[232px]"
      }`}
    >
      <div className="m-0 flex w-full flex-col rounded-3xl glass shadow-card p-3 overflow-hidden">
        <nav className="flex-1 flex flex-col gap-1">
          {items.map((it) => {
            const active = pathname === it.to;
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition ${
                  active ? "bg-card text-foreground shadow-card" : "text-foreground/70 hover:text-foreground hover:bg-card/60"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1 rounded-r-full bg-gradient-primary shadow-glow-primary" />
                )}
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
                  active ? "bg-gradient-primary text-primary-foreground shadow-glow-primary" : "bg-card/60 group-hover:bg-card"
                }`}>
                  <it.icon className="h-4 w-4" />
                </span>
                {!collapsed && <span className="truncate">{it.label}</span>}
              </Link>
            );
          })}
        </nav>
        {!collapsed && (
          <div className="mt-3 rounded-2xl bg-gradient-primary p-3 text-primary-foreground shadow-glow-primary">
            <div className="font-display text-sm font-bold">Boost weekend</div>
            <p className="mt-0.5 text-[11px] opacity-80">+25% XP on all surveys until Sun.</p>
          </div>
        )}
      </div>
    </aside>
  );
}
