import { Router } from 'express';
import { prisma } from '../config/database';
import { authMiddleware } from '../middleware/auth';
import { buildIframeUrl } from '../utils/iframeUrl';

function enrich(item: any, userId: number, email: string) {
  return { ...item, iframeUrl: buildIframeUrl(item.iframeUrl, item.slug, userId, email) };
}

const offerwalls = Router();
offerwalls.use(authMiddleware);
offerwalls.get('/', async (req, res) => {
  const items = await prisma.offerwall.findMany({ where: { enabled: true, type: 'offerwall' }, orderBy: { sortOrder: 'asc' } });
  res.json({ items: items.map((i) => enrich(i, req.user!.id, req.user!.email)) });
});

const surveys = Router();
surveys.use(authMiddleware);
surveys.get('/', async (req, res) => {
  const items = await prisma.offerwall.findMany({ where: { enabled: true, type: 'survey' }, orderBy: { sortOrder: 'asc' } });
  res.json({ items: items.map((i) => enrich(i, req.user!.id, req.user!.email)) });
});

export default { offerwalls, surveys };
