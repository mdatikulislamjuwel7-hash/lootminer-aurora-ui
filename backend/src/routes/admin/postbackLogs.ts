import { Router } from 'express';
import { prisma } from '../../config/database';

const router = Router();

router.get('/', async (req, res) => {
  const page = parseInt(String(req.query.page || '1'), 10);
  const limit = 50;
  const where = { type: 'postback' };
  const [items, total] = await Promise.all([
    prisma.log.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    prisma.log.count({ where }),
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) });
});

export default router;
