import { Router } from 'express';
import { prisma } from '../../config/database';

const router = Router();

router.get('/', async (_req, res) => {
  const items = await prisma.paymentMethod.findMany({ orderBy: { sortOrder: 'asc' } });
  res.json({ items });
});

router.post('/', async (req, res) => {
  const b = req.body || {};
  const item = await prisma.paymentMethod.create({
    data: {
      name: b.name, iconUrl: b.iconUrl || null,
      minXp: parseInt(b.minXp || '500', 10),
      feePercent: parseFloat(b.feePercent || '0'),
      processingTime: b.processingTime || 'Instant',
      enabled: b.enabled !== false,
      sortOrder: parseInt(b.sortOrder || '0', 10),
    },
  });
  res.json({ item });
});

router.patch('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const b = req.body || {};
  const data: any = {};
  for (const k of ['name', 'iconUrl', 'processingTime']) if (b[k] !== undefined) data[k] = b[k];
  if (b.minXp !== undefined) data.minXp = parseInt(b.minXp, 10);
  if (b.feePercent !== undefined) data.feePercent = parseFloat(b.feePercent);
  if (b.enabled !== undefined) data.enabled = !!b.enabled;
  if (b.sortOrder !== undefined) data.sortOrder = parseInt(b.sortOrder, 10);
  const item = await prisma.paymentMethod.update({ where: { id }, data });
  res.json({ item });
});

router.delete('/:id', async (req, res) => {
  await prisma.paymentMethod.delete({ where: { id: parseInt(req.params.id, 10) } });
  res.json({ ok: true });
});

export default router;
