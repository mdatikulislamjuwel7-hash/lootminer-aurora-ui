import { Router } from 'express';
import { handlePostback } from './index';

const router = Router();
router.get('/', async (req, res) => {
  await handlePostback(req, res, 'playtimeads', {
    userId: String(req.query.user_id || req.query.sub1 || ''),
    xpAmount: 0,
    payoutUsd: parseFloat(String(req.query.payout)) || 0,
    isReversal: false,
    transactionId: `${String(req.query.offer_id || '')}_${String(req.query.conversionDatetime || '')}`,
    offerName: String(req.query.offer_name || 'PlaytimeAds Offer'),
    offerId: String(req.query.offer_id || ''),
  });
});
export default router;
