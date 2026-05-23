import { prisma } from '../config/database';

export interface PostbackInput {
  userId: string | number;
  network: string;
  transactionId: string;
  xpAmount: number;
  payoutUsd: number;
  offerName: string;
  offerId?: string;
  country?: string;
  ipAddress?: string;
  rawParams: Record<string, unknown>;
  isReversal: boolean;
}

export async function processPostback(input: PostbackInput) {
  const {
    network, transactionId, xpAmount, payoutUsd,
    offerName, offerId, country, ipAddress, rawParams, isReversal,
  } = input;

  const userIdNum = parseInt(String(input.userId), 10);
  if (!userIdNum || Number.isNaN(userIdNum)) return { status: 'user_not_found' };

  const user = await prisma.user.findFirst({ where: { id: userIdNum } });
  if (!user) return { status: 'user_not_found' };
  if (user.isBanned) return { status: 'user_banned' };

  const xpSetting = await prisma.setting.findUnique({ where: { key: 'xp_per_usd' } });
  const xpPerUsd = parseInt(xpSetting?.value || '1000', 10);

  // Pending rule check
  const pendingRules = await prisma.offerPendingRule.findMany();
  let matchedKeyword: string | null = null;
  for (const rule of pendingRules) {
    if (offerName.toLowerCase().includes(rule.keyword.toLowerCase())) {
      matchedKeyword = rule.keyword;
      break;
    }
  }

  const txId = String(transactionId);

  if (matchedKeyword && !isReversal) {
    const finalXp = xpAmount > 0 ? xpAmount : Math.round(payoutUsd * xpPerUsd);
    const existing = await prisma.activity.findFirst({ where: { transactionId: txId, network } });
    if (existing) return { status: 'duplicate' };

    await prisma.activity.create({
      data: {
        userId: user.id, network, offerName,
        offerId: String(offerId || ''),
        xp: finalXp, payoutUsd,
        transactionId: txId,
        country: country || '', ipAddress: ipAddress || '',
        status: 'pending',
        matchedKeyword,
        rawParams: JSON.stringify(rawParams),
      },
    });
    await prisma.notification.create({
      data: {
        userId: user.id, type: 'warning',
        title: '⏳ Offer Under Review',
        body: `Your offer "${offerName}" is pending review. XP will be credited after approval.`,
      },
    });
    return { status: 'pending', matchedKeyword };
  }

  if (!isReversal) {
    const existing = await prisma.activity.findFirst({ where: { transactionId: txId, network } });
    if (existing) return { status: 'duplicate' };

    const finalXp = xpAmount > 0 ? xpAmount : Math.round(payoutUsd * xpPerUsd);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          balanceXp: { increment: finalXp },
          totalEarnedXp: { increment: finalXp },
          todayEarnedXp: { increment: finalXp },
        },
      }),
      prisma.activity.create({
        data: {
          userId: user.id, network, offerName,
          offerId: String(offerId || ''),
          xp: finalXp, payoutUsd,
          transactionId: txId,
          country: country || '', ipAddress: ipAddress || '',
          status: 'valid',
          rawParams: JSON.stringify(rawParams),
        },
      }),
      prisma.notification.create({
        data: {
          userId: user.id, type: 'earn',
          title: `+${finalXp} XP Earned!`,
          body: `You completed "${offerName}" on ${network}`,
        },
      }),
      prisma.log.create({
        data: {
          userId: user.id, type: 'postback', action: 'xp_credited',
          details: JSON.stringify({ network, finalXp, offerName, transactionId: txId }),
          ipAddress: ipAddress || '',
        },
      }),
    ]);

    await checkAndUpdateLevel(user.id);
    return { status: 'success', xpAwarded: finalXp };
  }

  // Reversal
  const original = await prisma.activity.findFirst({
    where: { transactionId: txId, network, status: 'valid' },
  });
  if (!original) return { status: 'reversal_not_found' };

  const deduct = Math.min(original.xp, user.balanceXp);
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { balanceXp: { decrement: deduct } },
    }),
    prisma.activity.update({ where: { id: original.id }, data: { status: 'reversed' } }),
    prisma.notification.create({
      data: {
        userId: user.id, type: 'warning',
        title: 'XP Reversed',
        body: `${deduct} XP removed: "${offerName}" was reversed by the network`,
      },
    }),
  ]);
  return { status: 'reversed', xpDeducted: deduct };
}

export async function checkAndUpdateLevel(userId: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;
  const levels = await prisma.level.findMany({ orderBy: { levelNumber: 'asc' } });
  let newLevel = 1;
  for (const lvl of levels) {
    if (user.totalEarnedXp >= lvl.xpRequired) newLevel = lvl.levelNumber;
  }
  if (newLevel !== user.level) {
    await prisma.user.update({ where: { id: userId }, data: { level: newLevel } });
    await prisma.notification.create({
      data: {
        userId, type: 'level_up',
        title: '⚡ Level Up!',
        body: `Congratulations! You reached Level ${newLevel}!`,
      },
    });
  }
}
