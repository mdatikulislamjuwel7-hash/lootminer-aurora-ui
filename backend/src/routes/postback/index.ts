import { Router, Request, Response } from 'express';
import { processPostback, PostbackInput } from '../../utils/postbackHandler';
import { prisma } from '../../config/database';

import cpx from './cpx';
import gemad from './gemad';
import offery from './offery';
import radientwall from './radientwall';
import upwall from './upwall';
import playtimeads from './playtimeads';
import pixylabs from './pixylabs';
import vortexwall from './vortexwall';
import notik from './notik';
import pubscale from './pubscale';
import adswedmedia from './adswedmedia';

const router = Router();

router.use('/cpx', cpx);
router.use('/gemad', gemad);
router.use('/offery', offery);
router.use('/radientwall', radientwall);
router.use('/upwall', upwall);
router.use('/playtimeads', playtimeads);
router.use('/pixylabs', pixylabs);
router.use('/vortexwall', vortexwall);
router.use('/notik', notik);
router.use('/pubscale', pubscale);
router.use('/adswedmedia', adswedmedia);

export default router;

export async function handlePostback(req: Request, res: Response, network: string, input: Omit<PostbackInput, 'network' | 'rawParams'>) {
  try {
    const full: PostbackInput = { ...input, network, rawParams: req.query as Record<string, unknown> };
    const result = await processPostback(full);
    await prisma.log.create({
      data: {
        userId: parseInt(String(input.userId), 10) || null,
        type: 'postback',
        action: `${network}:${result.status}`,
        details: JSON.stringify({ query: req.query, result }),
        ipAddress: String(req.ip || ''),
      },
    });
  } catch (e) {
    console.error(`[postback:${network}]`, e);
    try {
      await prisma.log.create({
        data: {
          userId: null, type: 'postback', action: `${network}:error`,
          details: JSON.stringify({ query: req.query, error: String(e) }),
          ipAddress: String(req.ip || ''),
        },
      });
    } catch { /* ignore */ }
  }
  res.status(200).send('1');
}
