import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/common/Logo";
import { BalancePill } from "@/components/common/BalancePill";
import { AvatarDropdown } from "./AvatarDropdown";
import { NavDrawer } from "./NavDrawer";
import { LayoutDashboard, Sparkles, Wallet, Trophy } from "lucide-react";

const primaryLinks = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/earn", label: "Earn", icon: Sparkles },
  { to: "/cashout", label: "Cashout", icon: Wallet },
  { to: "/rewards", label: "Rewards", icon: Trophy },
] as const;

export function DesktopTopbar() {
  return (
    <header className="sticky top-0 z-40 hidden md:block">
      <div className="px-4 pt-4">
        <div className="mx-auto flex max-w-7xl items-center gap-4 rounded-2xl glass px-3 py-2.5 shadow-card">
          <NavDrawer />
          <Logo />
          <nav className="ml-4 hidden lg:flex items-center gap-1">
            {primaryLinks.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-card/60 transition"
                activeProps={{ className: "bg-card text-foreground shadow-card" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                <l.icon className="h-4 w-4" /> {l.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2.5">
            <BalancePill />
            <AvatarDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}
