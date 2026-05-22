import { Logo } from "@/components/common/Logo";
import { XpPill } from "@/components/common/XpPill";
import { AvatarDropdown } from "./AvatarDropdown";

export function MobileHeader({ admin = false }: { admin?: boolean }) {
  return (
    <header className="sticky top-0 z-40 md:hidden">
      <div className="px-3 pt-3">
        <div className="flex items-center gap-2 rounded-2xl glass px-3 py-2 shadow-card">
          <Logo to={admin ? "/admin" : "/dashboard"} />
          <div className="ml-auto flex items-center gap-2">
            <XpPill />
            <AvatarDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}
