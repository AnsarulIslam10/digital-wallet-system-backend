import express from 'express';
import { TransactionController } from './transaction.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';
import { validateRequest } from '../../middlewares/validateRequest';
import { amountSchema, sendMoneySchema } from './transaction.validation';

const router = express.Router();

router.post('/add', checkAuth(Role.USER), validateRequest(amountSchema), TransactionController.addMoney);
router.post('/withdraw', checkAuth(Role.USER), validateRequest(amountSchema), TransactionController.withdrawMoney);
router.post('/send', checkAuth(Role.USER), validateRequest(sendMoneySchema), TransactionController.sendMoney);

router.post('/cash-in', checkAuth(Role.AGENT), validateRequest(sendMoneySchema), TransactionController.agentCashIn);
router.post('/cash-out', checkAuth(Role.AGENT), validateRequest(sendMoneySchema), TransactionController.agentCashOut);

router.get('/my-history', checkAuth(Role.USER, Role.AGENT), TransactionController.getMyHistory);
router.get('/', checkAuth(Role.ADMIN), TransactionController.getAll);

export const TransactionRoutes = router;
