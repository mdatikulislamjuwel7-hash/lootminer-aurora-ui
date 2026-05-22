import { Logo } from "@/components/common/Logo";
import { XpPill } from "@/components/common/XpPill";
import { AvatarDropdown } from "./AvatarDropdown";
import { NotificationDropdown } from "./NotificationDropdown";
import { Menu, ShieldHalf } from "lucide-react";

export function AppTopbar({
  onToggleSidebar, admin = false,
}: { onToggleSidebar: () => void; admin?: boolean }) {
  return (
    <header className="sticky top-0 z-40 hidden md:block">
      <div className="px-4 pt-4">
        <div className="mx-auto flex max-w-[1600px] items-center gap-3 rounded-2xl glass px-3 py-2.5 shadow-card">
          <button
            type="button"
            aria-label="Toggle sidebar"
            onClick={onToggleSidebar}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-card/60 hover:bg-card transition"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Logo to={admin ? "/admin" : "/dashboard"} />
          {admin && (
            <span className="ml-2 hidden lg:inline-flex items-center gap-1 rounded-full bg-gradient-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-accent-foreground shadow-glow-accent">
              <ShieldHalf className="h-3 w-3" /> Admin
            </span>
          )}
          <div className="ml-auto flex items-center gap-2.5">
            <XpPill />
            <NotificationDropdown />
            <AvatarDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}
