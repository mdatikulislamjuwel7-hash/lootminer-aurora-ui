import { Link } from "@tanstack/react-router";

export function Logo({ withText = true, to = "/" }: { withText?: boolean; to?: string }) {
  return (
    <Link to={to} className="group flex items-center gap-2.5">
      <div className="relative">
        <div className="absolute inset-0 rounded-xl bg-gradient-primary blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow-primary overflow-hidden">
          {/* Crystal SVG — replaceable */}
          <svg viewBox="0 0 32 32" className="h-5 w-5 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
            <path d="M16 3 L26 11 L22 28 L10 28 L6 11 Z" fill="currentColor" fillOpacity="0.15" />
            <path d="M16 3 L26 11 L22 28 L10 28 L6 11 Z" />
            <path d="M6 11 L16 14 L26 11" />
            <path d="M16 14 L16 28" />
            <path d="M10 28 L16 14 L22 28" />
          </svg>
        </div>
      </div>
      {withText && (
        <span className="font-display text-lg font-bold tracking-tight">
          Loot<span className="text-gradient-primary">Miner</span>
        </span>
      )}
    </Link>
  );
}
