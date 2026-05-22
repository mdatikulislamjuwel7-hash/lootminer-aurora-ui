import { AuroraBackground } from "@/components/background/AuroraBackground";
import { DesktopTopbar } from "./DesktopTopbar";
import { MobileHeader } from "./MobileHeader";
import { MobileBottomNav } from "./MobileBottomNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen text-foreground">
      <AuroraBackground />
      <DesktopTopbar />
      <MobileHeader />
      <main className="mx-auto w-full max-w-7xl px-3 md:px-6 pb-28 md:pb-12 pt-4 md:pt-6">
        {children}
      </main>
      <MobileBottomNav />
    </div>
  );
}
