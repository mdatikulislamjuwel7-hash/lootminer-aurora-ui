import { Link } from "@tanstack/react-router";

export function Logo({ withText = true }: { withText?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-2.5">
      <div className="relative">
        <div className="absolute inset-0 rounded-xl bg-gradient-primary blur-md opacity-60 group-hover:opacity-100 transition-opacity" />
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow-primary">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2l3 7h7l-5.5 4.5L18.5 21 12 17l-6.5 4 2-7.5L2 9h7z" strokeLinejoin="round" />
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
