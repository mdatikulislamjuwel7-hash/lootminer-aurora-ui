import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Sparkles, Gift, Wallet, Flame, Users, Check } from "lucide-react";
import { userAPI } from "@/lib/api";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  xp: Sparkles, reward: Gift, cashout: Wallet, offer: Flame, referral: Users, default: Bell,
};
const toneMap: Record<string, string> = {
  primary: "bg-gradient-primary text-primary-foreground shadow-glow-primary",
  xp: "bg-gradient-xp text-xp-foreground shadow-glow-xp",
  accent: "bg-gradient-accent text-accent-foreground shadow-glow-accent",
  success: "bg-gradient-success text-primary-foreground",
  warning: "bg-warning text-warning-foreground",
};

export function NotificationDropdown() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: userAPI.notifications,
    refetchInterval: 60000,
  });

  const items: any[] = data?.notifications ?? [];
  const unreadCount = items.filter((i) => i.unread || !i.read).length;

  const markAll = useMutation({
    mutationFn: userAPI.markAllRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: () => toast.error("Could not mark as read"),
  });

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full bg-card/60 hover:bg-card transition outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-destructive opacity-75" />
              <span className="relative h-2 w-2 rounded-full bg-destructive shadow-glow-accent" />
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="z-[60] w-[min(92vw,360px)] glass-strong border-border p-0 overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="font-display text-sm font-semibold">Notifications</span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-destructive/15 text-destructive px-2 py-0.5 text-[10px] font-semibold">
                {unreadCount} new
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => markAll.mutate()}
            disabled={markAll.isPending || unreadCount === 0}
            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition disabled:opacity-50"
          >
            <Check className="h-3 w-3" /> Mark all read
          </button>
        </div>

        <ul className="max-h-[60vh] overflow-y-auto divide-y divide-border/60">
          {items.map((n) => {
            const Icon = iconMap[n.type] ?? iconMap.default;
            const tone = toneMap[n.tone ?? "primary"] ?? toneMap.primary;
            const unread = n.unread ?? !n.read;
            return (
              <li
                key={n.id}
                className={`flex gap-3 px-4 py-3 transition hover:bg-card/40 cursor-pointer ${unread ? "bg-card/20" : ""}`}
              >
                <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${tone}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-display text-sm font-semibold truncate">{n.title}</p>
                    {unread && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-glow-primary flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{n.text ?? n.message}</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-1">{n.time ?? n.createdAt}</p>
                </div>
              </li>
            );
          })}
          {items.length === 0 && (
            <li className="px-4 py-8 text-center text-xs text-muted-foreground">No notifications</li>
          )}
        </ul>

        <div className="border-t border-border px-4 py-2.5 text-center">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-xs font-medium text-primary hover:text-primary-glow transition"
          >
            Close
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
