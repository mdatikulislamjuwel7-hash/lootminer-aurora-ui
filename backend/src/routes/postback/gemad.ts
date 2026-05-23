import { Router } from 'express';
import { handlePostback } from './index';

const router = Router();
router.get('/', async (req, res) => {
  const payoutUsd = parseFloat(String(req.query.payout)) || 0;
  const status = String(req.query.status || '');
  await handlePostback(req, res, 'gemad', {
    userId: String(req.query.user_id || ''),
    xpAmount: parseInt(String(req.query.reward)) || 0,
    payoutUsd,
    isReversal: status === 'rejected' || payoutUsd < 0,
    transactionId: String(req.query.txid || ''),
    offerName: String(req.query.offer_name || 'GemAd Offer'),
    offerId: String(req.query.offer_id || ''),
    ipAddress: String(req.query.ipaddr || ''),
  });
});
export default router;
