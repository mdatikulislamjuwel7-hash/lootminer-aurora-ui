import { Router } from 'express';
import { prisma } from '../config/database';
import { authMiddleware } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  const period = String(req.query.period || 'all');
  if (period === 'daily') {
    const users = await prisma.user.findMany({ orderBy: { todayEarnedXp: 'desc' }, take: 50, select: { id: true, username: true, avatarUrl: true, level: true, todayEarnedXp: true } });
    return res.json({ items: users.map((u, i) => ({ rank: i + 1, username: u.username, avatarUrl: u.avatarUrl, level: u.level, xp: u.todayEarnedXp, tier: null })) });
  }
  if (period === 'all') {
    const users = await prisma.user.findMany({ orderBy: { totalEarnedXp: 'desc' }, take: 50, select: { id: true, username: true, avatarUrl: true, level: true, totalEarnedXp: true } });
    return res.json({ items: users.map((u, i) => ({ rank: i + 1, username: u.username, avatarUrl: u.avatarUrl, level: u.level, xp: u.totalEarnedXp, tier: null })) });
  }
  // weekly / monthly
  const since = new Date();
  if (period === 'weekly') since.setDate(since.getDate() - 7);
  else since.setDate(since.getDate() - 30);
  const grouped = await prisma.activity.groupBy({
    by: ['userId'], where: { status: 'valid', createdAt: { gte: since } },
    _sum: { xp: true }, orderBy: { _sum: { xp: 'desc' } }, take: 50,
  });
  const ids = grouped.map((g) => g.userId);
  const users = await prisma.user.findMany({ where: { id: { in: ids } }, select: { id: true, username: true, avatarUrl: true, level: true } });
  const map = new Map(users.map((u) => [u.id, u]));
  res.json({
    items: grouped.map((g, i) => {
      const u = map.get(g.userId)!;
      return { rank: i + 1, username: u?.username, avatarUrl: u?.avatarUrl, level: u?.level, xp: g._sum.xp || 0, tier: null };
    }),
  });
});

export default router;
