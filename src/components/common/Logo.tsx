import { Link } from "@tanstack/react-router";

type LogoProps = {
  withText?: boolean;
  to?: string;
  src?: string;
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: { box: "h-8 w-8", icon: "h-4 w-4", text: "text-base" },
  md: { box: "h-10 w-10", icon: "h-5 w-5", text: "text-lg" },
  lg: { box: "h-12 w-12", icon: "h-6 w-6", text: "text-2xl" },
};

export function Logo({ withText = true, to = "/", src, size = "md" }: LogoProps) {
  const s = sizeMap[size];
  return (
    <Link to={to} className="group inline-flex items-center gap-2.5 select-none">
      <div className="relative">
        {/* Outer glow */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-primary blur-lg opacity-60 group-hover:opacity-100 transition-opacity" />
        {/* Container */}
        <div
          className={`relative ${s.box} flex items-center justify-center rounded-2xl bg-[oklch(0.18_0.04_260)] ring-1 ring-white/10 shadow-glow-primary overflow-hidden`}
        >
          {/* Inner mesh */}
          <div className="absolute inset-0 bg-gradient-mesh opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />

          {src ? (
            <img src={src} alt="LootMiner" className={`relative ${s.icon} object-contain`} />
          ) : (
            <svg viewBox="0 0 40 40" className={`relative ${s.icon}`} fill="none">
              <defs>
                <linearGradient id="lm-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="oklch(0.92 0.16 200)" />
                  <stop offset="55%" stopColor="oklch(0.82 0.15 200)" />
                  <stop offset="100%" stopColor="oklch(0.7 0.24 305)" />
                </linearGradient>
                <linearGradient id="lm-grad-2" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="oklch(0.86 0.16 88)" />
                  <stop offset="100%" stopColor="oklch(0.92 0.16 200)" />
                </linearGradient>
              </defs>
              {/* Crystal/gem shape */}
              <path
                d="M20 3 L33 14 L28 35 L12 35 L7 14 Z"
                fill="url(#lm-grad)"
                stroke="white"
                strokeOpacity="0.35"
                strokeWidth="0.8"
                strokeLinejoin="round"
              />
              {/* Top facets */}
              <path d="M7 14 L20 11 L33 14 L20 19 Z" fill="white" fillOpacity="0.22" />
              <path d="M20 11 L20 19" stroke="white" strokeOpacity="0.45" strokeWidth="0.6" />
              {/* Bottom facets */}
              <path d="M12 35 L20 19 L28 35" stroke="white" strokeOpacity="0.5" strokeWidth="0.6" />
              {/* Spark / XP star */}
              <circle cx="30" cy="9" r="2.2" fill="url(#lm-grad-2)" />
              <circle cx="30" cy="9" r="3.6" fill="url(#lm-grad-2)" fillOpacity="0.25" />
            </svg>
          )}
          {/* Shine sweep */}
          <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_35%,rgba(255,255,255,0.18)_50%,transparent_65%)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        </div>
      </div>

      {withText && (
        <span className={`font-display ${s.text} font-bold tracking-tight leading-none`}>
          <span className="bg-[linear-gradient(90deg,oklch(0.96_0.02_220),oklch(0.82_0.15_200))] bg-clip-text text-transparent">
            Loot
          </span>
          <span className="bg-[linear-gradient(90deg,oklch(0.82_0.15_200),oklch(0.7_0.18_180),oklch(0.86_0.16_88))] bg-clip-text text-transparent">
            Miner
          </span>
        </span>
      )}
    </Link>
  );
}
