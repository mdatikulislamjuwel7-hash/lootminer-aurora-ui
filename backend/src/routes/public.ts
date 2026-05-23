import { Router } from 'express';
import { prisma } from '../config/database';

const router = Router();

router.get('/stats', async (_req, res) => {
  const [totalUsers, totalXpAgg, totalOffers] = await Promise.all([
    prisma.user.count(),
    prisma.activity.aggregate({ _sum: { xp: true }, where: { status: 'valid' } }),
    prisma.activity.count(),
  ]);
  res.json({ totalUsers, totalXpPaid: totalXpAgg._sum.xp || 0, totalOffers });
});

router.get('/leads', async (_req, res) => {
  const items = await prisma.activity.findMany({
    where: { status: 'valid' },
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: { user: { select: { username: true, avatarUrl: true } } },
  });
  res.json({
    items: items.map((a) => ({
      username: a.user.username,
      avatarUrl: a.user.avatarUrl,
      network: a.network,
      offerName: a.offerName,
      xp: a.xp,
      country: a.country,
      createdAt: a.createdAt,
    })),
  });
});

router.get('/offerwalls', async (_req, res) => {
  const items = await prisma.offerwall.findMany({ where: { enabled: true, type: 'offerwall' }, orderBy: { sortOrder: 'asc' } });
  res.json({ items });
});

router.get('/settings', async (_req, res) => {
  const items = await prisma.setting.findMany({ where: { key: { in: ['maintenance_mode', 'live_leads_enabled'] } } });
  const out: Record<string, string> = {};
  for (const s of items) out[s.key] = s.value;
  res.json(out);
});

export default router;
