import { Router } from 'express';
import { prisma } from '../../config/database';

const router = Router();

router.get('/', async (req, res) => {
  const { type, search, from, to } = req.query as Record<string, string>;
  const page = parseInt(String(req.query.page || '1'), 10);
  const limit = 50;
  const where: any = {};
  if (type) where.type = type;
  if (search) where.OR = [{ action: { contains: search } }, { details: { contains: search } }];
  if (from || to) where.createdAt = {};
  if (from) where.createdAt.gte = new Date(from);
  if (to) where.createdAt.lte = new Date(to);
  const [items, total] = await Promise.all([
    prisma.log.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    prisma.log.count({ where }),
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) });
});

export default router;
