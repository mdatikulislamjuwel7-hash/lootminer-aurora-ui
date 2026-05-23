import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import publicRoutes from './routes/public';
import offerwallRoutes from './routes/offerwalls';
import cashoutRoutes from './routes/cashouts';
import promoRoutes from './routes/promos';
import referralRoutes from './routes/referrals';
import rankingRoutes from './routes/rankings';
import rewardRoutes from './routes/rewards';
import notificationRoutes from './routes/notifications';
import topOfferRoutes from './routes/topOffers';
import postbackRoutes from './routes/postback';
import adminRoutes from './routes/admin';

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/offerwalls', offerwallRoutes.offerwalls);
app.use('/api/surveys', offerwallRoutes.surveys);
app.use('/api/top-offers', topOfferRoutes);
app.use('/api/payment-methods', cashoutRoutes.methods);
app.use('/api/cashouts', cashoutRoutes.cashouts);
app.use('/api/promos', promoRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/rankings', rankingRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/postback', postbackRoutes);
app.use('/api/admin', adminRoutes);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[error]', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const PORT = parseInt(process.env.PORT || '5000', 10);
app.listen(PORT, () => {
  console.log(`LootMiner backend running on port ${PORT}`);
});
