import { Router } from 'express';
import { prisma } from '../../config/database';

const router = Router();

router.get('/', async (req, res) => {
  const search = String(req.query.search || '');
  const status = String(req.query.status || 'all');
  const page = parseInt(String(req.query.page || '1'), 10);
  const limit = 20;
  const where: any = {};
  if (search) where.OR = [{ username: { contains: search } }, { email: { contains: search } }];
  if (status === 'active') where.isBanned = false;
  if (status === 'banned') where.isBanned = true;
  const [items, total] = await Promise.all([
    prisma.user.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    prisma.user.count({ where }),
  ]);
  res.json({ items: items.map(({ passwordHash, ...u }) => u), total, page, pages: Math.ceil(total / limit) });
});

router.patch('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { role, balanceXpAdjust, adjustReason, isBanned, banReason } = req.body || {};
  const data: any = {};
  if (role) data.role = role;
  if (typeof isBanned === 'boolean') { data.isBanned = isBanned; data.banReason = banReason || null; }
  if (typeof balanceXpAdjust === 'number' && balanceXpAdjust !== 0) {
    data.balanceXp = { increment: balanceXpAdjust };
    await prisma.log.create({ data: { userId: id, type: 'admin', action: 'xp_adjust', details: JSON.stringify({ amount: balanceXpAdjust, reason: adjustReason }), ipAddress: String(req.ip || '') } });
  }
  const user = await prisma.user.update({ where: { id }, data });
  if (typeof isBanned === 'boolean' && isBanned) {
    await prisma.notification.create({ data: { userId: id, type: 'warning', title: 'Account banned', body: banReason || 'Your account has been banned.' } });
  }
  const { passwordHash, ...rest } = user;
  res.json({ user: rest });
});

router.delete('/:id', async (req, res) => {
  await prisma.user.delete({ where: { id: parseInt(req.params.id, 10) } });
  res.json({ ok: true });
});

export default router;
