import { Router, type Request } from 'express';
import { prisma } from '../config/database';

const router = Router();

const isLocalAddress = (value?: string) =>
  (value || '')
    .split(',')
    .map((part) => part.trim().replace(/^https?:\/\//i, ''))
    .some((part) => {
      if (part.startsWith('[::1]') || part === '::1') return true;
      const host = part.split('/')[0].split(':')[0];
      return ['localhost', '127.0.0.1', '0.0.0.0'].includes(host);
    });

const isLocalRequest = (req: Request) =>
  [req.get('origin'), req.get('referer'), req.get('host'), req.get('x-forwarded-host')].some(isLocalAddress);

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

router.get('/settings', async (req, res) => {
  res.set('Cache-Control', 'no-store, max-age=0');
  const items = await prisma.setting.findMany({ where: { key: { in: ['maintenance_mode', 'live_leads_enabled'] } } });
  const out: Record<string, boolean> = {};
  for (const s of items) out[s.key] = s.value === 'true' || s.value === '1';
  if (isLocalRequest(req)) out.maintenance_mode = false;
  res.json(out);
});

export default router;
