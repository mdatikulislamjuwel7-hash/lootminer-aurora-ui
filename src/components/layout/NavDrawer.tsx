import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, LayoutDashboard, Sparkles, Wallet, Trophy, User, Receipt, Users, LifeBuoy, Settings, LogOut } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { user } from "@/data/mock";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/earn", label: "Earn", icon: Sparkles },
  { to: "/cashout", label: "Cashout", icon: Wallet },
  { to: "/rewards", label: "Rewards", icon: Trophy },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/history", label: "History", icon: Receipt },
  { to: "/referrals", label: "Referrals", icon: Users },
  { to: "/support", label: "Support", icon: LifeBuoy },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function NavDrawer({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger ?? (
          <button className="flex h-10 w-10 items-center justify-center rounded-xl glass shadow-card hover:bg-card/80 transition">
            <Menu className="h-5 w-5" />
          </button>
        )}
      </SheetTrigger>
      <SheetContent side="left" className="w-80 border-border bg-background/95 backdrop-blur-2xl p-0">
        <SheetHeader className="p-5 border-b border-border">
          <SheetTitle className="text-left">
            <Logo />
          </SheetTitle>
        </SheetHeader>

        <div className="p-5">
          <div className="rounded-2xl glass p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-primary font-display font-bold text-primary-foreground">
                {user.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="min-w-0">
                <div className="truncate font-display text-sm font-semibold">{user.name}</div>
                <div className="truncate text-xs text-muted-foreground">Level {user.level} · {user.balance.toLocaleString()} coins</div>
              </div>
            </div>
          </div>

          <nav className="mt-5 flex flex-col gap-1">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground/80 hover:bg-card hover:text-foreground transition"
                activeProps={{ className: "bg-card text-foreground shadow-card" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                <l.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition" />
                {l.label}
              </Link>
            ))}
          </nav>

          <button className="mt-6 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition">
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
