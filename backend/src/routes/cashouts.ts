import { Router } from 'express';
import { prisma } from '../config/database';
import { authMiddleware } from '../middleware/auth';
import { xpToUsd } from '../utils/xpCalculator';

const methods = Router();
methods.use(authMiddleware);
methods.get('/', async (_req, res) => {
  const items = await prisma.paymentMethod.findMany({ where: { enabled: true }, orderBy: { sortOrder: 'asc' } });
  res.json({ items });
});

const cashouts = Router();
cashouts.use(authMiddleware);

cashouts.post('/', async (req, res) => {
  try {
    const { method, amountXp, accountDetails } = req.body || {};
    const xp = parseInt(String(amountXp), 10);
    if (!method || !xp || !accountDetails) return res.status(400).json({ error: 'Missing fields' });

    const pm = await prisma.paymentMethod.findFirst({ where: { name: method, enabled: true } });
    if (!pm) return res.status(404).json({ error: 'Payment method not available' });
    if (xp < pm.minXp) return res.status(400).json({ error: `Minimum ${pm.minXp} XP for ${method}` });

    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user || user.balanceXp < xp) return res.status(400).json({ error: 'Insufficient balance' });

    const xpSetting = await prisma.setting.findUnique({ where: { key: 'xp_per_usd' } });
    const xpPerUsd = parseInt(xpSetting?.value || '1000', 10);
    const amountUsd = xpToUsd(xp, xpPerUsd, pm.feePercent);

    await prisma.$transaction([
      prisma.user.update({ where: { id: user.id }, data: { balanceXp: { decrement: xp }, pendingXp: { increment: xp } } }),
      prisma.cashout.create({ data: { userId: user.id, method, amountXp: xp, amountUsd, accountDetails, status: 'pending' } }),
      prisma.notification.create({ data: { userId: user.id, type: 'cashout', title: 'Cashout submitted', body: `${xp} XP withdrawal pending review.` } }),
      prisma.log.create({ data: { userId: user.id, type: 'cashout', action: 'requested', details: JSON.stringify({ method, xp, amountUsd }), ipAddress: String(req.ip || '') } }),
    ]);
    res.json({ ok: true });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

cashouts.get('/my', async (req, res) => {
  const page = parseInt(String(req.query.page || '1'), 10);
  const limit = 20;
  const where = { userId: req.user!.id };
  const [items, total] = await Promise.all([
    prisma.cashout.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    prisma.cashout.count({ where }),
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) });
});

export default { methods, cashouts };
