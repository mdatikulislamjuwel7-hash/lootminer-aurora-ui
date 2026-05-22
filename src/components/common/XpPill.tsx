import { Sparkles } from "lucide-react";
import { mockUser } from "@/data/mock";

export function XpPill({ className = "" }: { className?: string }) {
  return (
    <div className={`group relative inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 shadow-card ${className}`}>
      <div className="absolute inset-0 rounded-full bg-gradient-xp opacity-0 blur-md transition-opacity group-hover:opacity-40" />
      <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-gradient-xp shadow-glow-xp">
        <Sparkles className="h-3.5 w-3.5 text-xp-foreground" />
      </div>
      <span className="relative font-display text-sm font-semibold tabular-nums text-gradient-xp">
        {mockUser.balanceXp.toLocaleString()}
      </span>
      <span className="relative text-xs text-muted-foreground">XP</span>
    </div>
  );
}
