import { useState, useEffect } from "react";
import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
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
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (auth === null && typeof window !== "undefined") {
      // landing handles unauth; mock previews stay open
    }
  }, [auth, nav]);

  return (
    <div className="relative min-h-screen text-foreground">
      <AuroraBackground />
      <AppTopbar onToggleSidebar={() => setCollapsed((c) => !c)} admin={admin} />
      <MobileHeader admin={admin} />

      <div className="mx-auto flex w-full max-w-[1600px] gap-4 px-3 md:px-4 pb-28 md:pb-8 pt-4 md:pt-4">
        {admin ? <AdminSidebar collapsed={collapsed} /> : <DesktopSidebar collapsed={collapsed} />}
        <main key={pathname} className="min-w-0 flex-1 pt-2 md:pt-4 animate-page-in">
          <Outlet />
        </main>
      </div>

      {!admin && <MobileBottomNav />}
    </div>
  );
}

