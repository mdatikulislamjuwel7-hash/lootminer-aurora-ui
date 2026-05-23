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

function makeCrud(type: 'offerwall' | 'survey') {
  const r = Router();
  r.get('/', async (_req, res) => {
    const items = await prisma.offerwall.findMany({ where: { type }, orderBy: { sortOrder: 'asc' } });
    res.json({ items });
  });
  r.post('/', upload.single('logo'), async (req, res) => {
    const b = req.body;
    const logoUrl = req.file ? `/uploads/${req.file.filename}` : (b.logoUrl || null);
    const item = await prisma.offerwall.create({
      data: {
        name: b.name, slug: b.slug || String(b.name || '').toLowerCase().replace(/\s+/g, '-'),
        type, logoUrl, logoBgColor: b.logoBgColor || '#1a1a2e', logoSize: parseInt(b.logoSize || '80', 10),
        iframeUrl: b.iframeUrl || '', enabled: b.enabled !== 'false' && b.enabled !== false,
        isTopOffer: b.isTopOffer === 'true' || b.isTopOffer === true,
        bgGradientFrom: b.bgGradientFrom || '#1a1a2e', bgGradientTo: b.bgGradientTo || '#16213e',
        sortOrder: parseInt(b.sortOrder || '0', 10),
      },
    });
    res.json({ item });
  });
  r.patch('/:id', upload.single('logo'), async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const b = req.body;
    const data: any = { ...b };
    if (req.file) data.logoUrl = `/uploads/${req.file.filename}`;
    if (data.logoSize) data.logoSize = parseInt(data.logoSize, 10);
    if (data.sortOrder) data.sortOrder = parseInt(data.sortOrder, 10);
    if (typeof data.enabled === 'string') data.enabled = data.enabled === 'true';
    if (typeof data.isTopOffer === 'string') data.isTopOffer = data.isTopOffer === 'true';
    delete data.id;
    const item = await prisma.offerwall.update({ where: { id }, data });
    res.json({ item });
  });
  r.delete('/:id', async (req, res) => {
    await prisma.offerwall.delete({ where: { id: parseInt(req.params.id, 10) } });
    res.json({ ok: true });
  });
  return r;
}

export const offerwallsCrud = makeCrud('offerwall');
export const surveysCrud = makeCrud('survey');
export default offerwallsCrud;
