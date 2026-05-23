
# LootMiner — Backend build + frontend API wiring

## Important caveats (please confirm you accept these)

1. **The backend will not run inside the Lovable preview.** Lovable runs on Cloudflare Workers (TanStack Start), not Node/Express. The `backend/` folder will be source code only — you must run it yourself with XAMPP locally, then deploy to cPanel.
2. **`VITE_API_URL` points to `http://localhost:5000/api` by default.** In Lovable preview the browser cannot reach your local machine, so every page that depends on real data will show its loading/error state in preview. It will only work when you run the backend locally and open the frontend at `http://localhost:5173` (or your cPanel domain in production).
3. **Frontend stack difference.** The current frontend is TanStack Start + TanStack Router (file routes under `src/routes/_admin.*`, `src/routes/_app.*`), not Vite + React Router as the spec assumes. I will keep the existing routes and design untouched, and wire data via TanStack Query + a typed `axios` client (`src/lib/api.ts`). I will not rewrite the router.
4. **Mock data lives in `src/data/mock.ts` and is imported directly by route files.** I will leave `mock.ts` in place as a typed fallback during development and switch each page to TanStack Query hooks; pages keep their existing skeleton/empty states.

If any of these are wrong, stop me here.

---

## What gets built

### A. New `backend/` folder (Node 20 + TypeScript + Express + Prisma + MySQL)

Exactly the tree from STEP 1 of the spec. Highlights:

- `package.json` with the spec's dependencies (`express`, `prisma`, `@prisma/client`, `bcryptjs`, `jsonwebtoken`, `cors`, `multer`, `axios`, `uuid`, `dotenv`) and scripts (`dev`, `build`, `start`, `db:push`, `db:migrate`, `db:seed`, `db:studio`).
- `.env` / `.env.production` templates with `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, `PORT=5000`.
- `prisma/schema.prisma` — all 13 models verbatim (User, Offerwall, TopOffer, Activity, Cashout, PaymentMethod, PromoCode, PromoUse, Referral, Level, Notification, Setting, Log, **OfferPendingRule**).
- `prisma/seed.ts` — admin user (`admin@lootminer.com` / `Admin@123456`), all 25 levels, 6 payment methods, every setting key with its default. Idempotent via `upsert`.
- `src/index.ts` — Express bootstrap, CORS using `FRONTEND_URL`, JSON + urlencoded, static `uploads/` (auto-created), `/api/*` mount points, global error handler.
- `src/middleware/auth.ts` (Bearer JWT → `req.user`) and `src/middleware/admin.ts` (role gate).
- `src/utils/postbackHandler.ts` — full version from STEP 8: dedupe by `(transactionId, network)`, OfferPendingRule keyword match → status `pending` + "under review" notification, normal credit path in a Prisma `$transaction` with notification + log, reversal path, `checkAndUpdateLevel` helper.
- `src/utils/iframeUrl.ts` — `buildIframeUrl(baseUrl, network, userId, email)` with the 12 slug rules from STEP 13.
- `src/utils/vpnCheck.ts` — Fraudlogix + IPQS lookups gated by Setting keys, called only from `POST /api/auth/register`.
- `src/utils/xpCalculator.ts` — fee / XP-to-USD helpers used by cashouts.
- `src/routes/postback/*.ts` — all 11 networks (cpx, gemad, offery, radientwall, upwall, playtimeads, pixylabs, vortexwall, notik, pubscale, adswedmedia) as `GET /api/postback/<slug>`, each extracting the spec-listed params, calling `processPostback`, logging, and returning `200 "1"`.
- `src/routes/auth.ts` — register (VPN check, signup gate, signup bonus XP, optional referral bonus), login (ban check, bcrypt), `GET /me`.
- `src/routes/user.ts` — `/dashboard` aggregate, paginated `/activity`, notifications + read-all, profile get/patch, password change.
- `src/routes/offerwalls.ts` — `/offerwalls`, `/surveys`, `/top-offers` enriched with `buildIframeUrl`.
- `src/routes/cashouts.ts` — payment methods list, submit (min XP + balance + fee math, pending XP move), my history.
- `src/routes/promos.ts`, `referrals.ts`, `rankings.ts` (daily/weekly/monthly/all), `rewards.ts` (daily bonus claim + streak, achievements), `notifications.ts`, `public.ts` (stats / leads / offerwalls / settings), `topOffers.ts`.
- `src/routes/admin/*` — stats with 7-day chart arrays, users (search/filter/edit/delete/ban/XP adjust), offerwalls + surveys + topOffers CRUD with `multer` logo upload to `uploads/`, leads with filters, cashouts approve/reject (returns XP on reject), promos CRUD, levels GET/PATCH, payments CRUD, settings GET/PATCH + clear-today-xp, postbackLogs, logs, and **offerPending** (rules CRUD + pending leads list + approve/reject that credits XP and runs level check).

### B. Frontend API wiring (no visual changes)

- Install `axios` and `@tanstack/react-query`. Add a `QueryClientProvider` in `src/routes/__root.tsx` (additive — keeps existing providers, `<Outlet />`, head meta).
- Create `src/lib/api.ts` with the `axios` instance + interceptors (attach `lm_token`, on 401 clear token + redirect home) and all namespaced API objects from STEP 15 (`authAPI`, `publicAPI`, `userAPI`, `earnAPI`, `cashoutAPI`, `promosAPI`, `referralsAPI`, `rankingsAPI`, `rewardsAPI`, `adminAPI`, plus `offerPendingAPI`).
- Create `src/lib/auth-token.ts` helpers for `lm_token` / `lm_user` storage and a `useCurrentUser()` hook.
- `.env` with `VITE_API_URL=http://localhost:5000/api`; `.env.production` for the cPanel domain.
- Replace `src/data/mock.ts` consumers page by page with `useQuery` / `useMutation` calls. Each page keeps its existing layout but gains:
  - skeleton on `isLoading` (reuse existing card shells),
  - error block on `error`,
  - empty state on `data.length === 0` (icon + message),
  - optimistic update + rollback on toggles (offerwalls/surveys/top-offers/settings),
  - `queryClient.invalidateQueries` after mutations.
- Pages touched (admin): dashboard, users, offerwalls, surveys, top-offers, leads, **offer-pending** (already exists — switch to real `offerPendingAPI`), cashouts, promos, levels, payments, postback-logs, logs, settings.
- Pages touched (app): dashboard, earn, top-offers, cashout, rewards, ranking, referrals, profile, support, and the landing live-leads ticker.
- Auth: wire `AuthModal` register/login to `authAPI`, store token, refetch `userAPI.dashboard`.

### C. Documentation

- `backend/README.md` — XAMPP setup steps, `npm install`, `npx prisma migrate dev`, `npx prisma db seed`, `npm run dev`, admin login, postback URL list, cPanel deploy notes (Node app + MySQL DB + env vars + `dist/` build).
- Root `README.md` section explaining the two-process dev setup.

## What I will NOT do

- Will not change any colors, spacing, fonts, animations, layouts, or component structure.
- Will not run the backend in preview, will not try to make Lovable host MySQL.
- Will not touch the existing route files' visual JSX beyond swapping data sources and adding skeleton/empty/error blocks where missing.
- Will not invent endpoints or fields outside the spec.

## Technical notes

- Backend uses CommonJS-style `ts-node` dev runner per the spec's `nodemon --exec ts-node`. No ESM/edge-runtime adjustments.
- Postback dedupe relies on the `@@unique([transactionId, network])` constraint; handler still does a pre-check to return `duplicate` cleanly.
- Logo uploads use `multer.diskStorage` writing under `backend/uploads/`; URLs returned to the frontend are `${API_ORIGIN}/uploads/<filename>`. Admin edit modals already accept a logo data URL — they will switch to `multipart/form-data` uploads via the new API.
- 7-day chart series for admin dashboard built in SQL with `groupBy` on `DATE(createdAt)`; returned as length-7 arrays aligned to today−6 … today.
- Token storage stays in `localStorage` per the spec (`lm_token`, `lm_user`); SSR-safe guards (`typeof window !== 'undefined'`) where needed since TanStack Start prerenders.
- The TanStack Start SSR path will only call public, no-auth queries during prerender (`enabled: typeof window !== 'undefined'` on protected ones) to avoid 401s at build.

## Suggested execution order once you approve

1. Scaffold `backend/` (package.json, tsconfig, prisma schema, seed, env templates, README).
2. Implement middleware, postback handler, utils, all postback routes.
3. Implement auth, user, public, earn, cashout, promos, referrals, rankings, rewards, notifications routes.
4. Implement all admin routes including `offerPending.ts`.
5. Frontend: install deps, add QueryClient provider, create `src/lib/api.ts` + auth helpers + env files.
6. Migrate admin pages to API (start with dashboard + offer-pending, then the rest).
7. Migrate user-facing pages to API.
8. Final pass: verify each page handles loading/error/empty; verify TS build is clean.

Approve and I will start at step 1.
