# LootMiner Backend

Node.js + Express + Prisma + MySQL backend for the LootMiner GPT/CPA platform.

## Prerequisites

- Node.js 18+
- MySQL 8.0+
- (Optional) Docker & Docker Compose

## Quick Start (Local)

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and configure your MySQL connection:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Generate Prisma client and run migrations:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. Seed the database (creates default admin, settings, levels, payment methods):
```bash
npx prisma db seed
```

5. Start the development server:
```bash
npm run dev
```

Backend will be available at `http://localhost:5001`.

### Default Admin
- **Email:** `admin@lootminer.com`
- **Password:** `Admin@123456`

## Docker Compose (Recommended for Local)

The easiest way to run locally with MySQL:

```bash
docker-compose up --build
```

This starts:
- MySQL on port `3306`
- Backend on port `5001`

Run migrations and seed inside the container:
```bash
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npx prisma db seed
```

## Deployment Options

### Option 1: Railway (Recommended)

1. Push this repo to GitHub.
2. Go to [Railway](https://railway.app) → New Project → Deploy from GitHub repo.
3. Add a MySQL database (Railway provides one-click MySQL).
4. Set environment variables in Railway dashboard:
   - `DATABASE_URL` (from MySQL service)
   - `JWT_SECRET` (generate a strong secret)
   - `FRONTEND_URL` (your frontend domain, or `*` for any)
5. Railway auto-detects the Dockerfile and deploys.

### Option 2: Render

1. Push this repo to GitHub.
2. Go to [Render](https://render.com) → Blueprints → `+ New Blueprint Instance`.
3. Connect your repo and use the included `render.yaml`.
4. Render will provision both MySQL and the backend.

### Option 3: Fly.io

```bash
# Install flyctl: https://fly.io/docs/hands-on/install-flyctl/
fly launch
# Add a MySQL database (or use Fly Postgres and adapt schema if needed)
# Set secrets:
fly secrets set DATABASE_URL="mysql://..." JWT_SECRET="..." FRONTEND_URL="*"
fly deploy
```

### Option 4: VPS / cPanel

1. Provision a VPS with Node.js and MySQL.
2. Upload the `backend/` folder (without `node_modules`).
3. Install dependencies and build:
```bash
npm install
npm run build
```
4. Run production migrations and seed:
```bash
npx prisma migrate deploy
npx prisma db seed
```
5. Start with PM2 or systemd:
```bash
NODE_ENV=production PORT=5001 node dist/index.js
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | MySQL connection string |
| `JWT_SECRET` | Yes | Min 64 chars recommended |
| `JWT_EXPIRES_IN` | No | Default `7d` |
| `PORT` | No | Default `5001` |
| `NODE_ENV` | No | `development` or `production` |
| `FRONTEND_URL` | No | CORS origin (`*` for any) |

## API Overview

| Endpoint | Auth | Description |
|----------|------|-------------|
| `GET /api/health` | No | Health check |
| `POST /api/auth/register` | No | User registration |
| `POST /api/auth/login` | No | User login |
| `GET /api/auth/me` | Yes | Current user |
| `GET /api/public/stats` | No | Public stats |
| `GET /api/public/offerwalls` | No | Public offerwalls list |
| `GET /api/user/dashboard` | Yes | User dashboard data |
| `GET /api/user/activity` | Yes | User activity history |
| `GET /api/user/notifications` | Yes | User notifications |
| `GET /api/offerwalls` | Yes | Authenticated offerwalls |
| `GET /api/surveys` | Yes | Authenticated surveys |
| `GET /api/top-offers` | Yes | Top offers |
| `POST /api/cashouts` | Yes | Submit cashout |
| `GET /api/cashouts/my` | Yes | Cashout history |
| `POST /api/promos/claim` | Yes | Claim promo code |
| `GET /api/referrals` | Yes | Referral stats |
| `GET /api/rankings` | Yes | Leaderboard |
| `GET /api/rewards/daily-bonus` | Yes | Daily bonus status |
| `POST /api/rewards/claim-daily` | Yes | Claim daily bonus |
| `GET /api/rewards/achievements` | Yes | Achievement progress |
| `GET /api/admin/stats` | Admin | Admin dashboard stats |
| `GET /api/admin/users` | Admin | User management |
| `GET /api/admin/leads` | Admin | Lead management |
| `GET /api/admin/cashouts` | Admin | Cashout management |
| `GET /api/admin/offerwalls` | Admin | Offerwall CRUD |
| `GET /api/admin/surveys` | Admin | Survey CRUD |
| `GET /api/admin/top-offers` | Admin | Top offers CRUD |
| `GET /api/admin/promos` | Admin | Promo codes CRUD |
| `GET /api/admin/payment-methods` | Admin | Payment methods CRUD |
| `GET /api/admin/levels` | Admin | Level settings |
| `GET /api/admin/settings` | Admin | System settings |
| `GET /api/admin/postback-logs` | Admin | Postback logs |
| `GET /api/admin/logs` | Admin | System logs |
| `GET /api/admin/offer-pending/rules` | Admin | Pending rules |
| `GET /api/admin/offer-pending/leads` | Admin | Pending leads |
| `GET /api/postback/:network` | No | Network postbacks |

## Postback Test URLs

Use these to test postback integrations locally:

```
http://localhost:5001/api/postback/cpx?user_id=1&user_amount=500&offer_name=Test+Survey&offer_id=1&payout=0.50&transactionID=test_cpx_001
http://localhost:5001/api/postback/gemad?user_id=1&reward=300&payout=0.30&offer_name=GemAd+Test&txid=test_gemad_001&status=completed
http://localhost:5001/api/postback/vortexwall?identity_id=1&points=200&payout=1.20&campaign_name=VortexTest&txid=test_vortex_001&result=completed
http://localhost:5001/api/postback/offery?subId=1&reward=400&payout=0.40&offer_name=OfferyTest&transId=test_offery_001
```

All postbacks return `1` on success.

## Notes

- Uploads are stored in the `uploads/` directory. In production, mount a persistent volume here.
- Prisma migrations should be run with `prisma migrate deploy` in production (not `migrate dev`).
- The seed script is idempotent — safe to run multiple times.
