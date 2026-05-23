import { Router } from 'express';
import { handlePostback } from './index';

const router = Router();
router.get('/', async (req, res) => {
  await handlePostback(req, res, 'offery', {
    userId: String(req.query.subId || ''),
    xpAmount: parseFloat(String(req.query.reward)) || 0,
    payoutUsd: parseFloat(String(req.query.payout)) || 0,
    isReversal: String(req.query.status) === '2',
    transactionId: String(req.query.transId || ''),
    offerName: String(req.query.offer_name || 'Offery Offer'),
    offerId: String(req.query.offer_id || ''),
    country: String(req.query.country || ''),
    ipAddress: String(req.query.userIp || ''),
  });
});
export default router;
