import { Router } from 'express';
import { prisma } from '../../config/database';

const router = Router();

router.get('/', async (req, res) => {
  const status = String(req.query.status || '');
  const page = parseInt(String(req.query.page || '1'), 10);
  const limit = 20;
  const where: any = {};
  if (status) where.status = status;
  const [items, total] = await Promise.all([
    prisma.cashout.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit, include: { user: { select: { username: true, avatarUrl: true, email: true } } } }),
    prisma.cashout.count({ where }),
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) });
});

router.patch('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { action, rejectReason } = req.body || {};
  const cashout = await prisma.cashout.findUnique({ where: { id } });
  if (!cashout) return res.status(404).json({ error: 'Cashout not found' });
  if (cashout.status !== 'pending') return res.status(409).json({ error: 'Already processed' });

  if (action === 'approve') {
    await prisma.$transaction([
      prisma.cashout.update({ where: { id }, data: { status: 'approved', reviewedAt: new Date(), reviewedBy: req.user!.id } }),
      prisma.user.update({ where: { id: cashout.userId }, data: { pendingXp: { decrement: cashout.amountXp } } }),
      prisma.notification.create({ data: { userId: cashout.userId, type: 'cashout', title: 'Cashout approved', body: `${cashout.amountXp} XP — ${cashout.method}` } }),
    ]);
  } else if (action === 'reject') {
    await prisma.$transaction([
      prisma.cashout.update({ where: { id }, data: { status: 'rejected', rejectReason: rejectReason || null, reviewedAt: new Date(), reviewedBy: req.user!.id } }),
      prisma.user.update({ where: { id: cashout.userId }, data: { pendingXp: { decrement: cashout.amountXp }, balanceXp: { increment: cashout.amountXp } } }),
      prisma.notification.create({ data: { userId: cashout.userId, type: 'warning', title: 'Cashout rejected', body: rejectReason || 'Your cashout was rejected.' } }),
    ]);
  } else {
    return res.status(400).json({ error: 'Invalid action' });
  }
  res.json({ ok: true });
});

export default router;
