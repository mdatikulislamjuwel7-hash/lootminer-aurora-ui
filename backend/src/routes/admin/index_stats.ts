import { Router } from 'express';
import { prisma } from '../../config/database';

const router = Router();

router.get('/stats', async (_req, res) => {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);

  const [totalUsers, todaySignups, totalXpAgg, pendingCashoutsCount, approvedCashouts, todayUsersXp, todayRev, monthRev] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: today } } }),
    prisma.activity.aggregate({ _sum: { xp: true }, where: { status: 'valid' } }),
    prisma.cashout.count({ where: { status: 'pending' } }),
    prisma.cashout.aggregate({ _sum: { amountUsd: true }, where: { status: 'approved' } }),
    prisma.user.aggregate({ _sum: { todayEarnedXp: true } }),
    prisma.activity.aggregate({ _sum: { payoutUsd: true }, where: { createdAt: { gte: today } } }),
    prisma.activity.aggregate({ _sum: { payoutUsd: true }, where: { createdAt: { gte: monthStart } } }),
  ]);

  const signups: number[] = [];
  const xpDistributed: number[] = [];
  for (let i = 6; i >= 0; i--) {
    const start = new Date(); start.setDate(start.getDate() - i); start.setHours(0, 0, 0, 0);
    const end = new Date(start); end.setDate(end.getDate() + 1);
    const [s, x] = await Promise.all([
      prisma.user.count({ where: { createdAt: { gte: start, lt: end } } }),
      prisma.activity.aggregate({ _sum: { xp: true }, where: { status: 'valid', createdAt: { gte: start, lt: end } } }),
    ]);
    signups.push(s);
    xpDistributed.push(x._sum.xp || 0);
  }

  res.json({
    totalUsers,
    todaySignups,
    totalXpPaid: totalXpAgg._sum.xp || 0,
    pendingCashoutsCount,
    totalCashoutsUsd: approvedCashouts._sum.amountUsd || 0,
    usersTodayEarnings: todayUsersXp._sum.todayEarnedXp || 0,
    adminRevenueToday: todayRev._sum.payoutUsd || 0,
    adminRevenueMonth: monthRev._sum.payoutUsd || 0,
    chartData: { signups, xpDistributed },
  });
});

export default router;
