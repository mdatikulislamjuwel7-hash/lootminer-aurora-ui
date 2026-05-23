# LootMiner Backend

Node.js + Express + Prisma + MySQL backend for the LootMiner GPT/CPA platform.

> **Note:** This backend does NOT run inside the Lovable preview. Lovable's preview hosts the
> frontend on Cloudflare Workers (TanStack Start) only. To exercise real data you must run
> this backend locally with XAMPP, then deploy to cPanel for production.

## Local Setup (XAMPP)

1. Start Apache + MySQL in XAMPP Control Panel.
2. Open http://localhost/phpmyadmin and create a database named `lootminer`.
3. From this folder:

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Backend will be available at http://localhost:5000.

Default admin: `admin@lootminer.com` / `Admin@123456`

In a second terminal start the frontend (from the repo root):

```bash
npm install
npm run dev
```

Frontend will be available at http://localhost:5173 and is configured to call
`VITE_API_URL=http://localhost:5000/api`.

## Postback Test URLs

```
http://localhost:5000/api/postback/cpx?user_id=1&user_amount=500&offer_name=Test+Survey&offer_id=1&payout=0.50&transactionID=test_cpx_001
http://localhost:5000/api/postback/gemad?user_id=1&reward=300&payout=0.30&offer_name=GemAd+Test&txid=test_gemad_001&status=completed
http://localhost:5000/api/postback/vortexwall?identity_id=1&points=200&payout=0.20&campaign_name=VortexTest&txid=test_vortex_001&result=completed
```

All postbacks return `1` on success and credit XP to the user.

## cPanel Deployment

1. cPanel → MySQL Databases → create db + user, grant all privileges.
2. Upload `backend/` (without `node_modules`) via File Manager.
3. cPanel → Setup Node.js App → root: `backend`, startup file: `dist/index.js`.
4. Set every env var from `.env.production` in the cPanel UI.
5. cPanel terminal:

```bash
cd backend
npm install
npm run build
npx prisma migrate deploy
npx prisma db seed
```

6. Build frontend locally (`npm run build`) and upload `dist/*` to `public_html/`.
7. Add `public_html/.htaccess`:

```
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

8. Enable SSL (Let's Encrypt).
9. Update `.env.production` and frontend `VITE_API_URL` to your domain, rebuild.
