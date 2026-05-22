import { Logo } from "@/components/common/Logo";
import { BalancePill } from "@/components/common/BalancePill";
import { AvatarDropdown } from "./AvatarDropdown";

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-40 md:hidden">
      <div className="px-3 pt-3">
        <div className="flex items-center gap-2 rounded-2xl glass px-3 py-2 shadow-card">
          <Logo />
          <div className="ml-auto flex items-center gap-2">
            <BalancePill />
            <AvatarDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}
