import { Router } from 'express';
import { prisma } from '../../config/database';
import { checkAndUpdateLevel } from '../../utils/postbackHandler';

const router = Router();

router.get('/rules', async (_req, res) => {
  const items = await prisma.offerPendingRule.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ items });
});

router.post('/rules', async (req, res) => {
  const { keyword, note } = req.body || {};
  if (!keyword || String(keyword).trim().length < 2) return res.status(400).json({ error: 'Keyword too short' });
  const item = await prisma.offerPendingRule.create({ data: { keyword: String(keyword).trim(), note: note || null } });
  res.json({ item });
});

router.delete('/rules/:id', async (req, res) => {
  await prisma.offerPendingRule.delete({ where: { id: parseInt(req.params.id, 10) } });
  res.json({ ok: true });
});

router.get('/leads', async (req, res) => {
  const page = parseInt(String(req.query.page || '1'), 10);
  const limit = 50;
  const where = { status: 'pending' };
  const [items, total] = await Promise.all([
    prisma.activity.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit, include: { user: { select: { username: true, avatarUrl: true } } } }),
    prisma.activity.count({ where }),
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) });
});

router.patch('/leads/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { action } = req.body || {};
  const activity = await prisma.activity.findUnique({ where: { id } });
  if (!activity) return res.status(404).json({ error: 'Activity not found' });
  if (activity.status !== 'pending') return res.status(409).json({ error: 'Already processed' });

  if (action === 'approve') {
    await prisma.$transaction([
      prisma.activity.update({ where: { id }, data: { status: 'valid' } }),
      prisma.user.update({ where: { id: activity.userId }, data: { balanceXp: { increment: activity.xp }, totalEarnedXp: { increment: activity.xp }, todayEarnedXp: { increment: activity.xp } } }),
      prisma.notification.create({ data: { userId: activity.userId, type: 'earn', title: '✅ Offer approved', body: `Your offer "${activity.offerName}" was approved! +${activity.xp} XP credited.` } }),
    ]);
    await checkAndUpdateLevel(activity.userId);
  } else if (action === 'reject') {
    await prisma.$transaction([
      prisma.activity.update({ where: { id }, data: { status: 'reversed' } }),
      prisma.notification.create({ data: { userId: activity.userId, type: 'warning', title: '❌ Offer rejected', body: `Your offer "${activity.offerName}" was rejected.` } }),
    ]);
  } else {
    return res.status(400).json({ error: 'Invalid action' });
  }
  res.json({ ok: true });
});

export default router;
