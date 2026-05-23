import { Router } from 'express';
import { handlePostback } from './index';

const router = Router();
router.get('/', async (req, res) => {
  await handlePostback(req, res, 'vortexwall', {
    userId: String(req.query.identity_id || ''),
    xpAmount: parseInt(String(req.query.points)) || 0,
    payoutUsd: parseFloat(String(req.query.payout)) || 0,
    isReversal: String(req.query.result) === 'rejected',
    transactionId: String(req.query.txid || ''),
    offerName: String(req.query.campaign_name || 'Vortexwall Offer'),
    offerId: String(req.query.campaign_id || ''),
    ipAddress: String(req.query.ipaddr || req.query.user_ip || ''),
  });
});
export default router;
