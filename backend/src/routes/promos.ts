import { Router } from 'express';
import { prisma } from '../config/database';
import { authMiddleware } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

router.post('/claim', async (req, res) => {
  try {
    const settings = await prisma.setting.findUnique({ where: { key: 'promo_codes_enabled' } });
    if (settings?.value === 'false') return res.status(403).json({ error: 'Promo codes disabled' });

    const code = String(req.body?.code || '').trim();
    if (!code) return res.status(400).json({ error: 'Code required' });

    const promo = await prisma.promoCode.findFirst({ where: { code: { equals: code } } });
    if (!promo || !promo.active) return res.status(404).json({ error: 'Invalid code' });
    if (promo.expiresAt && promo.expiresAt < new Date()) return res.status(410).json({ error: 'Code expired' });
    if (promo.maxUses > 0 && promo.usesCount >= promo.maxUses) return res.status(410).json({ error: 'Code limit reached' });

    const already = await prisma.promoUse.findUnique({ where: { promoId_userId: { promoId: promo.id, userId: req.user!.id } } });
    if (already) return res.status(409).json({ error: 'Already claimed' });

    await prisma.$transaction([
      prisma.user.update({ where: { id: req.user!.id }, data: { balanceXp: { increment: promo.rewardXp }, totalEarnedXp: { increment: promo.rewardXp } } }),
      prisma.promoCode.update({ where: { id: promo.id }, data: { usesCount: { increment: 1 } } }),
      prisma.promoUse.create({ data: { promoId: promo.id, userId: req.user!.id } }),
      prisma.notification.create({ data: { userId: req.user!.id, type: 'earn', title: `+${promo.rewardXp} Promo XP`, body: `Code ${promo.code} redeemed.` } }),
    ]);
    res.json({ ok: true, rewardXp: promo.rewardXp });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

export default router;
