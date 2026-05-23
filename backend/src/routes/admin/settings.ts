import { Router } from 'express';
import { prisma } from '../../config/database';

const router = Router();

router.get('/', async (_req, res) => {
  const items = await prisma.setting.findMany();
  const out: Record<string, string> = {};
  for (const s of items) out[s.key] = s.value;
  res.json(out);
});

router.patch('/', async (req, res) => {
  const body = req.body || {};
  await prisma.$transaction(
    Object.entries(body).map(([key, value]) =>
      prisma.setting.upsert({ where: { key }, update: { value: String(value) }, create: { key, value: String(value) } }),
    ),
  );
  res.json({ ok: true });
});

router.post('/clear-today-xp', async (_req, res) => {
  await prisma.user.updateMany({ data: { todayEarnedXp: 0 } });
  res.json({ ok: true });
});

export default router;
