import { Router } from 'express';
import { prisma } from '../../config/database';

const router = Router();

router.get('/', async (_req, res) => {
  const items = await prisma.promoCode.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ items });
});

router.post('/', async (req, res) => {
  const { code, rewardXp, maxUses, expiresAt, active } = req.body || {};
  const item = await prisma.promoCode.create({
    data: {
      code: String(code).trim(),
      rewardXp: parseInt(rewardXp, 10),
      maxUses: parseInt(maxUses || '0', 10),
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      active: active !== false,
    },
  });
  res.json({ item });
});

router.patch('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { code, rewardXp, maxUses, expiresAt, active } = req.body || {};
  const data: any = {};
  if (code !== undefined) data.code = code;
  if (rewardXp !== undefined) data.rewardXp = parseInt(rewardXp, 10);
  if (maxUses !== undefined) data.maxUses = parseInt(maxUses, 10);
  if (expiresAt !== undefined) data.expiresAt = expiresAt ? new Date(expiresAt) : null;
  if (active !== undefined) data.active = !!active;
  const item = await prisma.promoCode.update({ where: { id }, data });
  res.json({ item });
});

router.delete('/:id', async (req, res) => {
  await prisma.promoCode.delete({ where: { id: parseInt(req.params.id, 10) } });
  res.json({ ok: true });
});

export default router;
