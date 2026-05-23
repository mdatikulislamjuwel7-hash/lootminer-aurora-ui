import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { prisma } from '../config/database';
import { checkVpnOnSignup } from '../utils/vpnCheck';
import { authMiddleware } from '../middleware/auth';

const router = Router();

function sanitize(u: any) {
  if (!u) return null;
  const { passwordHash, ...rest } = u;
  return rest;
}

function sign(user: { id: number; email: string; username: string; role: string }) {
  return jwt.sign(user, process.env.JWT_SECRET as string, {
    expiresIn: (process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']) || '7d',
  });
}

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, referralCode } = req.body || {};
    if (!username || !email || !password) return res.status(400).json({ error: 'Missing fields' });

    const settings = await prisma.setting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) map[s.key] = s.value;
    if (map.new_signups_enabled === 'false') return res.status(403).json({ error: 'Signups are closed' });

    const vpn = await checkVpnOnSignup(String(req.ip || ''));
    if (vpn.blocked) return res.status(403).json({ error: vpn.reason || 'Blocked' });

    if (await prisma.user.findUnique({ where: { username } })) return res.status(409).json({ error: 'Username taken' });
    if (await prisma.user.findUnique({ where: { email } })) return res.status(409).json({ error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    const code = randomBytes(4).toString('hex').toUpperCase();
    const signupBonus = parseInt(map.signup_bonus_xp || '500', 10);

    let referredBy: number | null = null;
    if (referralCode) {
      const ref = await prisma.user.findUnique({ where: { referralCode } });
      if (ref) referredBy = ref.id;
    }

    const user = await prisma.user.create({
      data: {
        username, email, passwordHash,
        referralCode: code,
        referredBy: referredBy || undefined,
        balanceXp: signupBonus,
        totalEarnedXp: signupBonus,
      },
    });

    await prisma.notification.create({
      data: { userId: user.id, type: 'earn', title: `Welcome! +${signupBonus} XP`, body: 'Signup bonus credited.' },
    });

    if (referredBy && map.referrals_enabled !== 'false') {
      const refXp = parseInt(map.referral_bonus_xp || '500', 10);
      await prisma.$transaction([
        prisma.user.update({
          where: { id: referredBy },
          data: { balanceXp: { increment: refXp }, totalEarnedXp: { increment: refXp } },
        }),
        prisma.referral.create({ data: { referrerId: referredBy, referredId: user.id, xpAwarded: refXp, status: 'valid' } }),
        prisma.notification.create({ data: { userId: referredBy, type: 'earn', title: `+${refXp} Referral XP`, body: `${username} signed up using your code.` } }),
      ]);
    }

    const token = sign({ id: user.id, email: user.email, username: user.username, role: user.role });
    res.json({ token, user: sanitize(user) });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (user.isBanned) return res.status(403).json({ error: user.banReason || 'Account banned' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = sign({ id: user.id, email: user.email, username: user.username, role: user.role });
    res.json({ token, user: sanitize(user) });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  res.json({ user: sanitize(user) });
});

export default router;
