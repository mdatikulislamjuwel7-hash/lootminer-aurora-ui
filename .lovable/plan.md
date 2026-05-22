# LootMiner — Frontend UI Plan

Premium dark gaming/rewards platform. Frontend only — mock data, no backend, no database, no real auth.

## Pages (TanStack routes)

- `/` Dashboard — balance, stats, recent activity, featured offers
- `/earn` Earn — offerwall partner grid (main offerwall)
- `/cashout` Cashout — withdrawal method cards (PayPal, Crypto, Gift Cards) + mock form
- `/rewards` Rewards — daily bonus, streaks, achievements, leaderboard
- `/profile` Profile — user info, stats, settings (reachable only via avatar dropdown → Profile)
- `/history` Transaction history
- `/referrals` Referral program
- `/support` Support / FAQ
- `/settings` Settings

## Layout

- `__root.tsx` wraps app in providers + `<AppShell>`
- **Desktop topbar** (md+): `[menu icon] [logo] LootMiner` on left, balance pill + avatar on right
  - Avatar click → dropdown only (Profile, Settings, Logout). Profile page reachable only from this dropdown.
  - Menu icon opens the same drawer used on mobile
- **Mobile bottom nav** (fixed, blurred glass): Dashboard, Earn, Cashout, Rewards, Menu
  - Menu item opens a `Sheet` drawer listing all pages (Profile, History, Referrals, Support, Settings, Logout)
- Topbar hidden on mobile (compact header with logo + avatar instead); bottom nav hidden on desktop

## Signature visual: Animated Aurora/Mesh Background

New `AuroraBackground` component, fixed full-viewport behind content:
- Multiple large radial-gradient blobs (primary cyan, violet, magenta, lime accent) blurred heavily
- CSS `@keyframes` slow drift + scale + hue-rotate (20–40s loops, staggered)
- Subtle SVG grain overlay + faint grid mask for depth
- Reduced-motion fallback: static gradient
- Pure CSS/SVG — no Three.js

## Offerwall — Provider Cards

`ProviderCard` component:
- Whole card is a `<Link>` (clickable area = entire card). **No "Start Earning" button.**
- Layout: provider logo/icon (gradient tile), name, payout range badge, completion count, hover glow
- Grid: `grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4`
  - Mobile: 2 per row
  - Desktop: 6 per row
- Hover: lift + aurora glow ring; tap: scale-down
- ~18 mock providers (AdGate, BitLabs, CPX Research, Lootably, Pollfish, Revenue Universe, etc.)

## Design System

`src/styles.css` tokens (oklch, dark default):
- Background: near-black with subtle blue undertone
- Surface: translucent glass (`bg-card/60 backdrop-blur-xl border-white/10`)
- Primary: electric cyan; Accent: violet; Success: lime; Warning: amber
- Gradient tokens for buttons, card glows, text
- Shadows: layered colored glows (cyan/violet) for premium depth
- Radius: 1rem default, 1.5rem on hero surfaces

Typography: Space Grotesk (display) + Inter (body) via Google Fonts in root `head()`.

Motion: Tailwind keyframes already available (fade-in, scale-in); add `aurora-drift` and `glow-pulse`.

## Components to create

```
src/components/
  layout/
    AppShell.tsx
    DesktopTopbar.tsx
    MobileBottomNav.tsx
    NavDrawer.tsx          (Sheet with all pages)
    AvatarDropdown.tsx     (DropdownMenu)
  background/
    AuroraBackground.tsx
  offerwall/
    ProviderCard.tsx
    ProviderGrid.tsx
  dashboard/
    BalanceCard.tsx
    StatTile.tsx
    ActivityList.tsx
  rewards/
    DailyBonusCard.tsx
    StreakTracker.tsx
    AchievementCard.tsx
  cashout/
    PayoutMethodCard.tsx
  common/
    GlassCard.tsx
    GradientButton.tsx
    BalancePill.tsx
```

Mock data lives in `src/data/` (providers, activity, achievements, payout methods).

## Technical notes

- TanStack Router file routes; each page has its own `head()` meta
- Shadcn `Sheet` for drawer, `DropdownMenu` for avatar, `Avatar`, `Badge`, `Button`, `Card`
- All colors via semantic tokens — no hardcoded hex in components
- Mock auth: hardcoded user object in `src/data/user.ts` (avatar, username, balance) — no login flow
- Replace placeholder `src/routes/index.tsx`

## Out of scope

No Lovable Cloud, no Supabase, no real auth, no API calls, no payment integration.
