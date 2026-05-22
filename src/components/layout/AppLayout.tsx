import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "@tanstack/react-router";
import { AuroraBackground } from "@/components/background/AuroraBackground";
import { AppTopbar } from "./AppTopbar";
import { MobileHeader } from "./MobileHeader";
import { MobileBottomNav } from "./MobileBottomNav";
import { DesktopSidebar } from "./DesktopSidebar";
import { AdminSidebar } from "./AdminSidebar";
import { useAuth } from "@/lib/auth";

export function AppLayout({ admin = false }: { admin?: boolean }) {
  const [collapsed, setCollapsed] = useState(false);
  const auth = useAuth();
  const nav = useNavigate();

  // Demo-only gate: if not signed in, auto sign in (mock) so previews work.
  useEffect(() => {
    if (auth === null && typeof window !== "undefined") {
      // do nothing — landing page will handle. but show content anyway since this is mock.
    }
  }, [auth, nav]);

  return (
    <div className="relative min-h-screen text-foreground">
      <AuroraBackground />
      <AppTopbar onToggleSidebar={() => setCollapsed((c) => !c)} admin={admin} />
      <MobileHeader admin={admin} />

      <div className="mx-auto flex w-full max-w-[1600px] gap-4 px-3 md:px-4 pb-28 md:pb-8 pt-4 md:pt-4">
        {admin ? <AdminSidebar collapsed={collapsed} /> : <DesktopSidebar collapsed={collapsed} />}
        <main className="min-w-0 flex-1 pt-2 md:pt-4">
          <Outlet />
        </main>
      </div>

      {!admin && <MobileBottomNav />}
    </div>
  );
}
