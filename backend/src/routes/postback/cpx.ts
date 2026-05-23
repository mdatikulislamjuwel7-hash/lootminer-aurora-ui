import { Router } from 'express';
import { handlePostback } from './index';

const router = Router();
router.get('/', async (req, res) => {
  const payoutUsd = parseFloat(String(req.query.payout)) || 0;
  await handlePostback(req, res, 'cpx', {
    userId: String(req.query.user_id || ''),
    xpAmount: parseInt(String(req.query.user_amount)) || 0,
    payoutUsd,
    isReversal: payoutUsd < 0,
    transactionId: String(req.query.transactionID || ''),
    offerName: String(req.query.offer_name || 'CPX Offer'),
    offerId: String(req.query.offer_id || ''),
    ipAddress: String(req.query.ip_address || ''),
  });
});
export default router;
