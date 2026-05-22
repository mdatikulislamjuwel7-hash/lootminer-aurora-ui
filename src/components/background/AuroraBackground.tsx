import { useMemo } from "react";

/**
 * Deep obsidian glass background.
 * Calm, premium, readable: deep base + 3 soft color depth glows,
 * faint grid, a few sparkle dots, fine noise, and a vignette.
 */
export function AuroraBackground() {
  const sparkles = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => ({
        left: (i * 41 + 7) % 100,
        top: (i * 67 + 13) % 100,
        size: 1 + (i % 3) * 0.5,
        delay: (i % 9) * 0.6,
        dur: 3 + (i % 5),
        hue:
          i % 4 === 0
            ? "oklch(0.95 0.12 200)"
            : i % 4 === 1
              ? "oklch(0.9 0.14 305)"
              : i % 4 === 2
                ? "oklch(0.95 0.13 88)"
                : "oklch(1 0 0)",
        opacity: 0.25 + (i % 4) * 0.12,
      })),
    [],
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#050508]"
    >
      {/* deep depth glows — soft, low-opacity, calm */}
      <div
        className="absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full"
        style={{
          background: "oklch(0.55 0.22 265 / 0.18)",
          filter: "blur(120px)",
          animation: "glow-pulse 9s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-1/2 -right-32 h-[26rem] w-[26rem] rounded-full"
        style={{
          background: "oklch(0.6 0.22 305 / 0.16)",
          filter: "blur(110px)",
          animation: "glow-pulse 12s ease-in-out infinite",
          animationDelay: "-3s",
        }}
      />
      <div
        className="absolute -bottom-32 left-1/4 h-[28rem] w-[28rem] rounded-full"
        style={{
          background: "oklch(0.78 0.18 200 / 0.10)",
          filter: "blur(120px)",
          animation: "glow-pulse 14s ease-in-out infinite",
          animationDelay: "-6s",
        }}
      />

      {/* faint grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />

      {/* sparkle particles */}
      <div className="absolute inset-0">
        {sparkles.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              background: s.hue,
              opacity: s.opacity,
              boxShadow: `0 0 6px ${s.hue}`,
              animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* fine grain noise */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.04] mix-blend-overlay"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="lm-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#lm-noise)" />
      </svg>

      {/* vignette for readability */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,#050508_100%)]" />
    </div>
  );
}
