import { useMemo } from "react";

export function AuroraBackground() {
  // Pre-compute deterministic positions so SSR/CSR match
  const stars = useMemo(
    () =>
      Array.from({ length: 60 }).map((_, i) => ({
        left: (i * 53) % 100,
        top: (i * 37) % 100,
        size: 1 + ((i * 7) % 3),
        delay: (i % 12) * 0.4,
        dur: 3 + (i % 5),
      })),
    [],
  );

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        left: (i * 547) % 100,
        size: 2 + (i % 3),
        delay: (i % 9) * 1.6,
        dur: 14 + ((i * 3) % 12),
        drift: ((i % 5) - 2) * 40,
        hue: i % 3, // 0 cyan, 1 violet, 2 gold
      })),
    [],
  );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[oklch(0.07_0.014_265)]">
      {/* deep base */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.16_0.035_275)_0%,oklch(0.09_0.018_262)_45%,oklch(0.05_0.01_260)_100%)]" />

      {/* slow rotating conic glow — premium "halo" */}
      <div
        className="absolute left-1/2 top-1/2 h-[180vmax] w-[180vmax] -translate-x-1/2 -translate-y-1/2 opacity-[0.35]"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, oklch(0.55 0.22 280 / 0.35) 60deg, transparent 120deg, oklch(0.65 0.18 200 / 0.3) 200deg, transparent 260deg, oklch(0.78 0.18 165 / 0.25) 320deg, transparent 360deg)",
          filter: "blur(80px)",
          animation: "conic-spin 60s linear infinite",
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 h-[140vmax] w-[140vmax] -translate-x-1/2 -translate-y-1/2 opacity-[0.25]"
        style={{
          background:
            "conic-gradient(from 180deg, transparent 0deg, oklch(0.6 0.24 320 / 0.4) 90deg, transparent 180deg, oklch(0.86 0.16 88 / 0.25) 270deg, transparent 360deg)",
          filter: "blur(100px)",
          animation: "conic-spin 90s linear infinite reverse",
        }}
      />

      {/* drifting aurora blobs */}
      <div className="absolute -top-1/4 -left-1/4 h-[55vmax] w-[55vmax] rounded-full bg-[oklch(0.55_0.22_280/0.32)] blur-[140px] animate-aurora-drift-slow" />
      <div className="absolute top-1/3 -right-1/4 h-[50vmax] w-[50vmax] rounded-full bg-[oklch(0.65_0.18_200/0.26)] blur-[150px] animate-aurora-drift" style={{ animationDelay: "-8s" }} />
      <div className="absolute -bottom-1/4 left-1/4 h-[48vmax] w-[48vmax] rounded-full bg-[oklch(0.6_0.18_165/0.2)] blur-[150px] animate-aurora-drift-slow" style={{ animationDelay: "-16s" }} />
      <div className="absolute top-[8%] left-[55%] h-[28vmax] w-[28vmax] rounded-full bg-[oklch(0.6_0.24_320/0.2)] blur-[130px] animate-aurora-drift-slow" style={{ animationDelay: "-22s" }} />

      {/* twinkling stars */}
      <div className="absolute inset-0">
        {stars.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              boxShadow: "0 0 6px oklch(0.92 0.05 220 / 0.9)",
              animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* rising XP particles */}
      <div className="absolute inset-0">
        {particles.map((p, i) => {
          const color =
            p.hue === 0
              ? "oklch(0.82 0.15 200)"
              : p.hue === 1
                ? "oklch(0.7 0.24 320)"
                : "oklch(0.88 0.17 88)";
          return (
            <span
              key={i}
              className="absolute bottom-[-20px] rounded-full"
              style={
                {
                  left: `${p.left}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  background: color,
                  boxShadow: `0 0 12px ${color}`,
                  animation: `particle-rise ${p.dur}s linear ${p.delay}s infinite`,
                  ["--drift" as string]: `${p.drift}px`,
                } as React.CSSProperties
              }
            />
          );
        })}
      </div>

      {/* subtle grid */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.055]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="56" height="56" patternUnits="userSpaceOnUse">
            <path d="M 56 0 L 0 0 0 56" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          <radialGradient id="fade" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="gridmask"><rect width="100%" height="100%" fill="url(#fade)" /></mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" mask="url(#gridmask)" className="text-foreground" />
      </svg>

      {/* central glowing crystal silhouette */}
      <svg
        className="absolute left-1/2 top-[16%] -translate-x-1/2 opacity-[0.08] animate-glow-pulse"
        width="560" height="560" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.82 0.15 200)" />
            <stop offset="60%" stopColor="oklch(0.62 0.24 305)" />
            <stop offset="100%" stopColor="oklch(0.86 0.16 88)" />
          </linearGradient>
        </defs>
        <g fill="none" stroke="url(#cg)" strokeWidth="1.2" strokeLinejoin="round">
          <path d="M100 30 L150 80 L125 170 L75 170 L50 80 Z" />
          <path d="M100 30 L125 80 L75 80 Z" />
          <path d="M50 80 L150 80" />
          <path d="M100 30 L100 170" opacity="0.7" />
          <path d="M75 80 L100 170 L125 80" opacity="0.6" />
        </g>
      </svg>

      {/* fine noise */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.05] mix-blend-overlay" xmlns="http://www.w3.org/2000/svg">
        <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" /></filter>
        <rect width="100%" height="100%" filter="url(#n)" />
      </svg>

      {/* outer darken vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,oklch(0.04_0.008_260/0.85))]" />
    </div>
  );
}
