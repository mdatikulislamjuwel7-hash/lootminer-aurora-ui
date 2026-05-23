import { Router } from 'express';
import { prisma } from '../config/database';
import { authMiddleware } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  const items = await prisma.topOffer.findMany({ where: { enabled: true }, orderBy: { sortOrder: 'asc' } });
  const userId = req.user!.id;
  const username = req.user!.username;
  res.json({
    items: items.map((o) => ({
      ...o,
      offerUrl: o.offerUrl.replace(/\{USER_ID\}/g, String(userId)).replace(/\{USERNAME\}/g, username),
    })),
  });
});

export default router;
