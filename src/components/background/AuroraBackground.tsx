export function AuroraBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[oklch(0.08_0.012_260)]">
      {/* deep vignette base */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.13_0.02_265)_0%,oklch(0.08_0.012_260)_55%,oklch(0.05_0.008_260)_100%)]" />

      {/* subtle dark glow blobs — low opacity, very blurred */}
      <div className="absolute -top-1/4 -left-1/4 h-[60vmax] w-[60vmax] rounded-full bg-[oklch(0.5_0.18_265/0.18)] blur-[160px] animate-aurora-drift-slow" />
      <div className="absolute top-1/2 -right-1/4 h-[55vmax] w-[55vmax] rounded-full bg-[oklch(0.55_0.16_200/0.14)] blur-[180px] animate-aurora-drift" style={{ animationDelay: "-10s" }} />
      <div className="absolute -bottom-1/4 left-1/3 h-[50vmax] w-[50vmax] rounded-full bg-[oklch(0.5_0.15_160/0.12)] blur-[180px] animate-aurora-drift-slow" style={{ animationDelay: "-18s" }} />
      <div className="absolute top-1/4 left-1/2 h-[30vmax] w-[30vmax] rounded-full bg-[oklch(0.7_0.14_88/0.07)] blur-[160px] animate-aurora-drift" style={{ animationDelay: "-22s" }} />

      {/* subtle grid */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
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

      {/* fine noise */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.06] mix-blend-overlay" xmlns="http://www.w3.org/2000/svg">
        <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" /></filter>
        <rect width="100%" height="100%" filter="url(#n)" />
      </svg>

      {/* outer darken vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,oklch(0.05_0.008_260/0.85))]" />
    </div>
  );
}
