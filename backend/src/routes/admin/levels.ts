import { Router } from 'express';
import { prisma } from '../../config/database';

const router = Router();

router.get('/', async (_req, res) => {
  const items = await prisma.level.findMany({ orderBy: { levelNumber: 'asc' } });
  res.json({ items });
});

router.patch('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { bonusXp, badgeColor } = req.body || {};
  const data: any = {};
  if (bonusXp !== undefined) data.bonusXp = parseInt(bonusXp, 10);
  if (badgeColor !== undefined) data.badgeColor = badgeColor;
  const item = await prisma.level.update({ where: { id }, data });
  res.json({ item });
});

export default router;
