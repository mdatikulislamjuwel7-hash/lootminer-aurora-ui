import { Router } from 'express';
import { handlePostback } from './index';

const router = Router();
router.get('/', async (req, res) => {
  await handlePostback(req, res, 'pixylabs', {
    userId: String(req.query.user_id || ''),
    xpAmount: parseInt(String(req.query.amount)) || 0,
    payoutUsd: parseFloat(String(req.query.payout)) || 0,
    isReversal: false,
    transactionId: String(req.query.trx || ''),
    offerName: `Pixylabs Offer ${String(req.query.campaign_id || '')}`,
    offerId: String(req.query.campaign_id || ''),
  });
});
export default router;
