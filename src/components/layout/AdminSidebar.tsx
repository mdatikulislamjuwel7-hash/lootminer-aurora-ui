import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, Layers, Wallet, Radio,
  Ticket, Award, CreditCard, Settings, ScrollText,
} from "lucide-react";

const items = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/users", label: "Users", icon: Users, exact: false },
  { to: "/admin/offerwalls", label: "Offerwalls", icon: Layers, exact: false },
  { to: "/admin/cashouts", label: "Cashouts", icon: Wallet, exact: false },
  { to: "/admin/postback-logs", label: "Postback Logs", icon: Radio, exact: false },
  { to: "/admin/promos", label: "Promo Codes", icon: Ticket, exact: false },
  { to: "/admin/levels", label: "Levels", icon: Award, exact: false },
  { to: "/admin/payments", label: "Payment Methods", icon: CreditCard, exact: false },
  { to: "/admin/settings", label: "Settings", icon: Settings, exact: false },
  { to: "/admin/logs", label: "Logs", icon: ScrollText, exact: false },
] as const;

export function AdminSidebar({ collapsed }: { collapsed: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className={`hidden md:flex sticky top-4 self-start h-[calc(100vh-2rem)] shrink-0 transition-[width] duration-300 ${collapsed ? "w-[72px]" : "w-[240px]"}`}>
      <div className="flex w-full flex-col rounded-3xl glass shadow-card p-3 overflow-hidden">
        {!collapsed && (
          <div className="px-2 pb-2 pt-1 text-[10px] uppercase tracking-widest text-muted-foreground">Admin Panel</div>
        )}
        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto scrollbar-hide">
          {items.map((it) => {
            const active = it.exact ? pathname === it.to : pathname === it.to || pathname.startsWith(it.to + "/");
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`group relative flex items-center gap-3 rounded-2xl px-3 py-2 text-sm transition ${
                  active ? "bg-card text-foreground shadow-card" : "text-foreground/70 hover:text-foreground hover:bg-card/60"
                }`}
              >
                {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-gradient-accent shadow-glow-accent" />}
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition ${
                  active ? "bg-gradient-accent text-accent-foreground shadow-glow-accent" : "bg-card/60 group-hover:bg-card"
                }`}>
                  <it.icon className="h-4 w-4" />
                </span>
                {!collapsed && <span className="truncate">{it.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
