import { Router } from 'express';
import { handlePostback } from './index';

const router = Router();
router.get('/', async (req, res) => {
  await handlePostback(req, res, 'pubscale', {
    userId: String(req.query.user_id || ''),
    xpAmount: 0,
    payoutUsd: parseFloat(String(req.query.payout_usd)) || parseFloat(String(req.query.value)) || 0,
    isReversal: false,
    transactionId: String(req.query.token || ''),
    offerName: String(req.query.offer_name || req.query.goal_name || 'Pubscale Offer'),
    offerId: String(req.query.offer_id || ''),
    country: String(req.query.country || ''),
    ipAddress: String(req.query.ip || ''),
  });
});
export default router;
