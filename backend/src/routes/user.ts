import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';
import { authMiddleware } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

function sanitize(u: any) { if (!u) return null; const { passwordHash, ...rest } = u; return rest; }

router.get('/dashboard', async (req, res) => {
  const userId = req.user!.id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  const recentActivities = await prisma.activity.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 5 });
  const levels = await prisma.level.findMany({ orderBy: { levelNumber: 'asc' } });
  const current = levels.find((l) => l.levelNumber === user.level) || levels[0];
  const next = levels.find((l) => l.levelNumber === user.level + 1) || null;
  const unreadNotifications = await prisma.notification.count({ where: { userId, read: false } });

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const claimed = !!user.lastDailyClaim && user.lastDailyClaim >= today;
  const baseSetting = await prisma.setting.findUnique({ where: { key: 'daily_bonus_base_xp' } });
  const base = parseInt(baseSetting?.value || '100', 10);
  const todayReward = base * Math.min(Math.max(user.streak, 1), 7);

  res.json({
    user: sanitize(user),
    recentActivities,
    dailyBonusStatus: { claimed, streakDays: user.streak, todayReward },
    levelInfo: { current, next },
    unreadNotifications,
  });
});

router.get('/activity', async (req, res) => {
  const userId = req.user!.id;
  const page = parseInt(String(req.query.page || '1'), 10);
  const limit = parseInt(String(req.query.limit || '20'), 10);
  const type = String(req.query.type || 'all');
  const where: any = { userId };
  if (type !== 'all') where.status = type;
  const [items, total] = await Promise.all([
    prisma.activity.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    prisma.activity.count({ where }),
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) });
});

router.get('/notifications', async (req, res) => {
  const items = await prisma.notification.findMany({ where: { userId: req.user!.id }, orderBy: { createdAt: 'desc' }, take: 50 });
  res.json({ items });
});

router.patch('/notifications/read-all', async (req, res) => {
  await prisma.notification.updateMany({ where: { userId: req.user!.id, read: false }, data: { read: true } });
  res.json({ ok: true });
});

router.get('/profile', async (req, res) => {
  const userId = req.user!.id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const activityCount = await prisma.activity.count({ where: { userId, status: 'valid' } });
  const cashoutCount = await prisma.cashout.count({ where: { userId, status: 'approved' } });
  res.json({ user: sanitize(user), activityCount, cashoutCount });
});

router.patch('/profile', async (req, res) => {
  const { username, avatarUrl, country, isPrivate } = req.body || {};
  if (username) {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing && existing.id !== req.user!.id) return res.status(409).json({ error: 'Username taken' });
  }
  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: { username, avatarUrl, country, isPrivate },
  });
  res.json({ user: sanitize(user) });
});

router.patch('/password', async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  const ok = await bcrypt.compare(currentPassword || '', user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Current password is incorrect' });
  const hash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hash } });
  res.json({ ok: true });
});

export default router;
