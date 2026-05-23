import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { prisma } from '../../config/database';

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, path.resolve(process.cwd(), 'uploads')),
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`),
  }),
});

const router = Router();

router.get('/', async (_req, res) => {
  const items = await prisma.topOffer.findMany({ orderBy: { sortOrder: 'asc' } });
  res.json({ items });
});

router.post('/', upload.single('image'), async (req, res) => {
  const b = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : (b.imageUrl || null);
  const item = await prisma.topOffer.create({
    data: {
      title: b.title, description: b.description || null,
      imageUrl, offerUrl: b.offerUrl || '',
      networkName: b.networkName || null,
      offerwallId: b.offerwallId ? parseInt(b.offerwallId, 10) : null,
      enabled: b.enabled !== 'false' && b.enabled !== false,
      sortOrder: parseInt(b.sortOrder || '0', 10),
    },
  });
  res.json({ item });
});

router.patch('/:id', upload.single('image'), async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const b = req.body;
  const data: any = { ...b };
  if (req.file) data.imageUrl = `/uploads/${req.file.filename}`;
  if (data.offerwallId) data.offerwallId = parseInt(data.offerwallId, 10);
  if (data.sortOrder) data.sortOrder = parseInt(data.sortOrder, 10);
  if (typeof data.enabled === 'string') data.enabled = data.enabled === 'true';
  delete data.id;
  const item = await prisma.topOffer.update({ where: { id }, data });
  res.json({ item });
});

router.delete('/:id', async (req, res) => {
  await prisma.topOffer.delete({ where: { id: parseInt(req.params.id, 10) } });
  res.json({ ok: true });
});

export default router;
