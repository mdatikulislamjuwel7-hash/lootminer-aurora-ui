import { Router } from 'express';
import { handlePostback } from './index';

const router = Router();
router.get('/', async (req, res) => {
  const rewardedTxId = String(req.query.rewarded_txn_id || '');
  const isReversal = !!rewardedTxId;
  await handlePostback(req, res, 'notik', {
    userId: String(req.query.user_id || ''),
    xpAmount: parseInt(String(req.query.amount)) || 0,
    payoutUsd: parseFloat(String(req.query.payout)) || 0,
    isReversal,
    transactionId: isReversal ? rewardedTxId : String(req.query.txn_id || ''),
    offerName: String(req.query.offer_name || 'Notik Offer'),
    offerId: String(req.query.offer_id || ''),
    ipAddress: String(req.query.conversion_ip || ''),
  });
});
export default router;
