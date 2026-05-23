import { Router } from 'express';
import { prisma } from '../../config/database';

const router = Router();

router.get('/', async (req, res) => {
  const { search, network, status, from, to } = req.query as Record<string, string>;
  const page = parseInt(String(req.query.page || '1'), 10);
  const limit = 50;
  const where: any = {};
  if (network) where.network = network;
  if (status) where.status = status;
  if (from || to) where.createdAt = {};
  if (from) where.createdAt.gte = new Date(from);
  if (to) where.createdAt.lte = new Date(to);
  if (search) where.OR = [{ offerName: { contains: search } }, { user: { username: { contains: search } } }];
  const [items, total] = await Promise.all([
    prisma.activity.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit, include: { user: { select: { username: true, avatarUrl: true } } } }),
    prisma.activity.count({ where }),
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) });
});

export default router;
