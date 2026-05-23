import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { adminMiddleware } from '../../middleware/admin';

import stats from './index_stats';
import users from './users';
import offerwalls from './offerwalls';
import surveys from './surveys';
import topOffers from './topOffers';
import leads from './leads';
import cashouts from './cashouts';
import promos from './promos';
import levels from './levels';
import payments from './payments';
import settings from './settings';
import postbackLogs from './postbackLogs';
import logs from './logs';
import offerPending from './offerPending';

const router = Router();
router.use(authMiddleware, adminMiddleware);

router.use('/', stats);
router.use('/users', users);
router.use('/offerwalls', offerwalls);
router.use('/surveys', surveys);
router.use('/top-offers', topOffers);
router.use('/leads', leads);
router.use('/cashouts', cashouts);
router.use('/promos', promos);
router.use('/levels', levels);
router.use('/payment-methods', payments);
router.use('/settings', settings);
router.use('/postback-logs', postbackLogs);
router.use('/logs', logs);
router.use('/offer-pending', offerPending);

export default router;
