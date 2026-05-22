import { Coins } from "lucide-react";
import { user } from "@/data/mock";

export function BalancePill({ className = "" }: { className?: string }) {
  return (
    <div className={`group relative inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 shadow-card ${className}`}>
      <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-0 blur-md transition-opacity group-hover:opacity-30" />
      <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-gradient-primary">
        <Coins className="h-3.5 w-3.5 text-primary-foreground" />
      </div>
      <span className="relative font-display text-sm font-semibold tabular-nums">
        {user.balance.toLocaleString()}
      </span>
      <span className="relative text-xs text-muted-foreground">coins</span>
    </div>
  );
}
