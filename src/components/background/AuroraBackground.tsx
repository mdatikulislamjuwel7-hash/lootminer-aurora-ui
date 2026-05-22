export function AuroraBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-mesh opacity-70" />
      <div className="absolute -top-40 -left-40 h-[55vmax] w-[55vmax] rounded-full bg-[oklch(0.62_0.24_305/0.5)] blur-[120px] animate-aurora-drift" />
      <div className="absolute top-1/3 -right-40 h-[50vmax] w-[50vmax] rounded-full bg-[oklch(0.82_0.15_200/0.45)] blur-[120px] animate-aurora-drift-slow" />
      <div className="absolute -bottom-40 left-1/4 h-[45vmax] w-[45vmax] rounded-full bg-[oklch(0.78_0.18_165/0.35)] blur-[140px] animate-aurora-drift" style={{ animationDelay: "-8s" }} />
      <div className="absolute top-10 left-1/2 h-[35vmax] w-[35vmax] rounded-full bg-[oklch(0.86_0.16_88/0.25)] blur-[120px] animate-aurora-drift-slow" style={{ animationDelay: "-14s" }} />

      <svg className="absolute inset-0 h-full w-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          <radialGradient id="fade" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="gridmask"><rect width="100%" height="100%" fill="url(#fade)" /></mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" mask="url(#gridmask)" className="text-foreground" />
      </svg>

      <svg className="absolute inset-0 h-full w-full opacity-[0.04] mix-blend-overlay" xmlns="http://www.w3.org/2000/svg">
        <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" /></filter>
        <rect width="100%" height="100%" filter="url(#n)" />
      </svg>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,oklch(0.08_0.02_260/0.75))]" />
    </div>
  );
}
