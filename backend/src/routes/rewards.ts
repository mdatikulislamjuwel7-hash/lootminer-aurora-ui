import { Router } from 'express';
import { prisma } from '../config/database';
import { authMiddleware } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

function todayStart() { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }
function daysBetween(a: Date, b: Date) { return Math.floor((b.getTime() - a.getTime()) / 86400000); }

router.get('/daily-bonus', async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  const baseSetting = await prisma.setting.findUnique({ where: { key: 'daily_bonus_base_xp' } });
  const base = parseInt(baseSetting?.value || '100', 10);
  const claimed = !!user.lastDailyClaim && user.lastDailyClaim >= todayStart();
  const todayReward = base * Math.min(Math.max(user.streak, 1), 7);
  res.json({ streakDays: user.streak, claimed, todayReward });
});

router.post('/claim-daily', async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  const start = todayStart();
  if (user.lastDailyClaim && user.lastDailyClaim >= start) return res.status(409).json({ error: 'Already claimed today' });

  let newStreak = 1;
  if (user.lastDailyClaim) {
    const last = new Date(user.lastDailyClaim); last.setHours(0, 0, 0, 0);
    const diff = daysBetween(last, start);
    if (diff === 1) newStreak = user.streak + 1;
  }

  const baseSetting = await prisma.setting.findUnique({ where: { key: 'daily_bonus_base_xp' } });
  const base = parseInt(baseSetting?.value || '100', 10);
  const reward = base * Math.min(Math.max(newStreak, 1), 7);

  await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { balanceXp: { increment: reward }, totalEarnedXp: { increment: reward }, streak: newStreak, lastDailyClaim: new Date() } }),
    prisma.notification.create({ data: { userId: user.id, type: 'earn', title: `+${reward} Daily Bonus`, body: `Streak: ${newStreak} day${newStreak === 1 ? '' : 's'}` } }),
  ]);
  res.json({ ok: true, reward, streak: newStreak });
});

router.get('/achievements', async (req, res) => {
  const userId = req.user!.id;
  const [activities, cashouts, referrals, user] = await Promise.all([
    prisma.activity.count({ where: { userId, status: 'valid' } }),
    prisma.cashout.count({ where: { userId, status: 'approved' } }),
    prisma.referral.count({ where: { referrerId: userId } }),
    prisma.user.findUnique({ where: { id: userId } }),
  ]);
  res.json({
    progress: {
      offersCompleted: activities,
      cashoutsCompleted: cashouts,
      referralsCount: referrals,
      streak: user?.streak || 0,
      totalEarnedXp: user?.totalEarnedXp || 0,
    },
  });
});

export default router;
