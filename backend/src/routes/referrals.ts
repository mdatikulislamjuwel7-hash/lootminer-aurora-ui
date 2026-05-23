import { Router } from 'express';
import { prisma } from '../config/database';
import { authMiddleware } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  const userId = req.user!.id;
  const referrals = await prisma.referral.findMany({
    where: { referrerId: userId },
    include: { referred: { select: { username: true, avatarUrl: true, createdAt: true } } },
    orderBy: { createdAt: 'desc' },
  });
  const totalReferrals = referrals.length;
  const xpEarned = referrals.reduce((a, r) => a + r.xpAwarded, 0);
  const pendingCount = referrals.filter((r) => r.status === 'pending').length;
  res.json({
    stats: { totalReferrals, xpEarned, pendingCount },
    items: referrals.map((r) => ({
      id: r.id, status: r.status, xpAwarded: r.xpAwarded, createdAt: r.createdAt,
      username: r.referred.username, avatarUrl: r.referred.avatarUrl,
    })),
  });
});

export default router;
