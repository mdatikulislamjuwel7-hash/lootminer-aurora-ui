import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import {
  Menu, LayoutDashboard, Sparkles, Wallet, Trophy, User, Users,
  LifeBuoy, Crown, Flame, LogOut, Zap,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { useAuth } from "@/lib/auth";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/earn", label: "Earn", icon: Sparkles },
  { to: "/top-offers", label: "Top Offers", icon: Flame },
  { to: "/cashout", label: "Cashout", icon: Wallet },
  { to: "/rewards", label: "Rewards", icon: Trophy },
  { to: "/ranking", label: "Ranking", icon: Crown },
  { to: "/referrals", label: "Referrals", icon: Users },
  { to: "/support", label: "Support", icon: LifeBuoy },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function NavDrawer({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const { user, logout } = useAuth();
  const initials = (user?.username ?? "??").slice(0, 2).toUpperCase();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger ?? (
          <button type="button" aria-label="Open menu" className="flex h-10 w-10 items-center justify-center rounded-xl glass shadow-card hover:bg-card/80 transition">
            <Menu className="h-5 w-5" />
          </button>
        )}
      </SheetTrigger>
      <SheetContent side="left" className="w-80 border-border bg-background/95 backdrop-blur-2xl p-0">
        <SheetHeader className="p-5 border-b border-border">
          <SheetTitle className="text-left">
            <Logo to="/dashboard" />
          </SheetTitle>
        </SheetHeader>

        <div className="p-5">
          <div className="rounded-2xl glass p-4 shadow-card ring-gradient">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-0.5 rounded-full bg-gradient-primary blur opacity-60" />
                <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-card border border-border font-display font-bold">
                  {initials}
                </div>
              </div>
              <div className="min-w-0">
                <div className="truncate font-display text-sm font-semibold">{user?.username ?? "Guest"}</div>
                <div className="truncate text-xs text-muted-foreground">
                  Level {user?.level ?? 0} · <span className="text-gradient-xp font-semibold">{(user?.balanceXp ?? 0).toLocaleString()} XP</span>
                </div>
              </div>
              <Zap className="h-4 w-4 text-xp" />
            </div>
          </div>

          <nav className="mt-5 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground/80 hover:bg-card hover:text-foreground transition"
                activeProps={{ className: "bg-card text-foreground shadow-card" }}
              >
                <l.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition" />
                {l.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => { setOpen(false); logout(); nav({ to: "/" }); }}
            className="mt-6 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
