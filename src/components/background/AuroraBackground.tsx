import { useMemo } from "react";

export function AuroraBackground() {
  const stars = useMemo(
    () =>
      Array.from({ length: 90 }).map((_, i) => ({
        left: (i * 53) % 100,
        top: (i * 37) % 100,
        size: 1 + ((i * 7) % 3),
        delay: (i % 14) * 0.35,
        dur: 2.6 + (i % 6),
        hue: i % 3 === 0 ? "oklch(0.95 0.12 200)" : i % 3 === 1 ? "oklch(0.9 0.14 305)" : "oklch(0.95 0.13 88)",
      })),
    [],
  );

  const particles = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        left: (i * 547) % 100,
        size: 2 + (i % 4),
        delay: (i % 11) * 1.4,
        dur: 12 + ((i * 3) % 14),
        drift: ((i % 7) - 3) * 50,
        hue: i % 3,
      })),
    [],
  );

  const comets = useMemo(
    () =>
      Array.from({ length: 4 }).map((_, i) => ({
        top: 5 + i * 22,
        delay: i * 6 + 2,
        dur: 7 + i * 1.5,
      })),
    [],
  );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[oklch(0.06_0.014_265)]">
      {/* deep base radial */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.18_0.04_275)_0%,oklch(0.09_0.02_262)_45%,oklch(0.04_0.01_260)_100%)]" />

      {/* animated multi-stop mesh — hue drifts for a "living" feel */}
      <div
        className="absolute inset-[-20%] opacity-[0.55]"
        style={{
          backgroundImage: [
            "radial-gradient(at 22% 28%, oklch(0.6 0.24 305 / 0.55), transparent 55%)",
            "radial-gradient(at 78% 22%, oklch(0.78 0.18 200 / 0.5), transparent 55%)",
            "radial-gradient(at 60% 82%, oklch(0.72 0.2 165 / 0.45), transparent 55%)",
            "radial-gradient(at 20% 80%, oklch(0.86 0.16 88 / 0.35), transparent 55%)",
          ].join(","),
          backgroundSize: "200% 200%, 200% 200%, 200% 200%, 200% 200%",
          animation: "mesh-shift 28s ease-in-out infinite, hue-drift 24s ease-in-out infinite",
          filter: "blur(60px)",
        }}
      />

      {/* dual rotating conic halos */}
      <div
        className="absolute left-1/2 top-1/2 h-[200vmax] w-[200vmax] opacity-[0.42]"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, oklch(0.55 0.22 280 / 0.45) 60deg, transparent 120deg, oklch(0.65 0.2 200 / 0.4) 200deg, transparent 260deg, oklch(0.78 0.18 165 / 0.35) 320deg, transparent 360deg)",
          filter: "blur(90px)",
          animation: "conic-spin 60s linear infinite",
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 h-[160vmax] w-[160vmax] opacity-[0.32]"
        style={{
          background:
            "conic-gradient(from 180deg, transparent 0deg, oklch(0.62 0.26 320 / 0.5) 90deg, transparent 180deg, oklch(0.88 0.17 88 / 0.35) 270deg, transparent 360deg)",
          filter: "blur(110px)",
          animation: "conic-spin 95s linear infinite reverse",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* orbiting glow orbs (xy oscillation) */}
      <div className="absolute top-[12%] left-[12%] h-72 w-72 rounded-full bg-[oklch(0.65_0.24_305/0.45)] blur-3xl" style={{ animation: "orbit-xy 18s ease-in-out infinite" }} />
      <div className="absolute top-[20%] right-[10%] h-80 w-80 rounded-full bg-[oklch(0.78_0.18_200/0.4)] blur-3xl" style={{ animation: "orbit-xy 22s ease-in-out infinite reverse" }} />
      <div className="absolute bottom-[14%] left-[28%] h-72 w-72 rounded-full bg-[oklch(0.72_0.2_165/0.36)] blur-3xl" style={{ animation: "orbit-xy 26s ease-in-out infinite" }} />
      <div className="absolute bottom-[20%] right-[20%] h-64 w-64 rounded-full bg-[oklch(0.88_0.17_88/0.32)] blur-3xl" style={{ animation: "orbit-xy 20s ease-in-out infinite reverse" }} />

      {/* concentric ripple pulses from center crystal */}
      <div className="absolute left-1/2 top-[28%]">
        {[0, 3, 6].map((d) => (
          <span
            key={d}
            className="absolute left-0 top-0 h-72 w-72 rounded-full border border-[oklch(0.82_0.15_200/0.35)]"
            style={{ animation: `ripple 9s ease-out ${d}s infinite` }}
          />
        ))}
      </div>

      {/* twinkling stars */}
      <div className="absolute inset-0">
        {stars.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              background: s.hue,
              boxShadow: `0 0 8px ${s.hue}`,
              animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* shooting comets */}
      <div className="absolute inset-0">
        {comets.map((c, i) => (
          <span
            key={i}
            className="absolute"
            style={{
              top: `${c.top}%`,
              left: 0,
              width: "180px",
              height: "2px",
              background:
                "linear-gradient(90deg, transparent, oklch(0.95 0.12 200 / 0.95), oklch(0.92 0.17 88 / 0.7), transparent)",
              boxShadow: "0 0 14px oklch(0.92 0.16 200 / 0.9)",
              animation: `comet ${c.dur}s ease-in ${c.delay}s infinite`,
              transformOrigin: "left center",
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
                  boxShadow: `0 0 14px ${color}`,
                  animation: `particle-rise ${p.dur}s linear ${p.delay}s infinite`,
                  ["--drift" as string]: `${p.drift}px`,
                } as React.CSSProperties
              }
            />
          );
        })}
      </div>

      {/* subtle grid with radial fade */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
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
        className="absolute left-1/2 top-[14%] -translate-x-1/2 opacity-[0.1] animate-glow-pulse"
        width="600" height="600" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"
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

      {/* fine grain noise */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.06] mix-blend-overlay" xmlns="http://www.w3.org/2000/svg">
        <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" /></filter>
        <rect width="100%" height="100%" filter="url(#n)" />
      </svg>

      {/* outer darken vignette for readability */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_38%,oklch(0.03_0.008_260/0.9))]" />
    </div>
  );
}
