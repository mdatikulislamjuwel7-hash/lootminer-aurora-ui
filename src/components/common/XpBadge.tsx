import { Sparkles } from "lucide-react";

export function XpBadge({ value, size = "md" }: { value: number; size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "text-[10px] px-1.5 py-0.5 gap-1",
    md: "text-xs px-2 py-1 gap-1.5",
    lg: "text-sm px-3 py-1.5 gap-2",
  }[size];
  return (
    <span className={`inline-flex items-center rounded-full bg-gradient-xp text-xp-foreground font-semibold tabular-nums shadow-glow-xp ${sizes}`}>
      <Sparkles className={size === "lg" ? "h-3.5 w-3.5" : "h-3 w-3"} />
      +{value.toLocaleString()} XP
    </span>
  );
}
