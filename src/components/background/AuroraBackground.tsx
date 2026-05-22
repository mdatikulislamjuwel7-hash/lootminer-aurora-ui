export function AuroraBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[oklch(0.09_0.015_260)]">
      {/* base depth gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.16_0.03_270)_0%,oklch(0.1_0.018_260)_45%,oklch(0.06_0.01_260)_100%)]" />

      {/* animated aurora blobs — richer but still soft */}
      <div className="absolute -top-1/4 -left-1/4 h-[60vmax] w-[60vmax] rounded-full bg-[oklch(0.55_0.22_280/0.28)] blur-[140px] animate-aurora-drift-slow" />
      <div className="absolute top-1/3 -right-1/4 h-[55vmax] w-[55vmax] rounded-full bg-[oklch(0.65_0.18_200/0.22)] blur-[150px] animate-aurora-drift" style={{ animationDelay: "-8s" }} />
      <div className="absolute -bottom-1/4 left-1/4 h-[50vmax] w-[50vmax] rounded-full bg-[oklch(0.6_0.18_165/0.18)] blur-[150px] animate-aurora-drift-slow" style={{ animationDelay: "-16s" }} />
      <div className="absolute top-1/2 left-1/2 h-[34vmax] w-[34vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(0.78_0.16_88/0.12)] blur-[150px] animate-aurora-drift" style={{ animationDelay: "-22s" }} />
      <div className="absolute top-[10%] left-[55%] h-[28vmax] w-[28vmax] rounded-full bg-[oklch(0.6_0.24_320/0.16)] blur-[130px] animate-aurora-drift-slow" style={{ animationDelay: "-28s" }} />

      {/* subtle grid */}
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

      {/* branded crystal pattern watermark */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.045]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="crystals" width="220" height="220" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
            <g fill="none" stroke="oklch(0.82 0.15 200)" strokeWidth="1" strokeLinejoin="round">
              {/* crystal/gem shape */}
              <path d="M55 30 L80 55 L70 95 L40 95 L30 55 Z" />
              <path d="M55 30 L70 55 L40 55 Z" />
              <path d="M30 55 L70 55" />
              <path d="M55 30 L55 95" opacity="0.6" />
            </g>
            <g fill="none" stroke="oklch(0.7 0.18 305)" strokeWidth="1" strokeLinejoin="round" transform="translate(110 110) scale(0.7)">
              <path d="M55 30 L80 55 L70 95 L40 95 L30 55 Z" />
              <path d="M30 55 L70 55" />
            </g>
          </pattern>
          <radialGradient id="crystalfade" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="crystalmask"><rect width="100%" height="100%" fill="url(#crystalfade)" /></mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#crystals)" mask="url(#crystalmask)" />
      </svg>

      {/* central glowing crystal silhouette */}
      <svg
        className="absolute left-1/2 top-[18%] -translate-x-1/2 opacity-[0.06] animate-glow-pulse"
        width="520" height="520" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"
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

      {/* outer darken vignette for readability */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,oklch(0.05_0.008_260/0.7))]" />
    </div>
  );
}
