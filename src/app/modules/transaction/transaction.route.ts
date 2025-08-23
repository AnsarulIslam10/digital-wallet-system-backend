import express from 'express';
import { TransactionController } from './transaction.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';
import { validateRequest } from '../../middlewares/validateRequest';
import {
  addMoneyValidation,
  sendMoneyValidation,
  agentCashInValidation,
  agentCashOutValidation,
  withdrawMoneyValidation,
} from './transaction.validation';

const router = express.Router();

// USER routes
router.post('/add', checkAuth(Role.USER), validateRequest(addMoneyValidation), TransactionController.addMoney);
router.post('/withdraw', checkAuth(Role.USER), validateRequest(withdrawMoneyValidation), TransactionController.withdrawMoney);
router.post('/send', checkAuth(Role.USER), validateRequest(sendMoneyValidation), TransactionController.sendMoney);

// AGENT routes
router.post('/cash-in', checkAuth(Role.AGENT), validateRequest(agentCashInValidation), TransactionController.agentCashIn);
router.post('/cash-out', checkAuth(Role.AGENT), validateRequest(agentCashOutValidation), TransactionController.agentCashOut);
router.get('/agent-transactions',checkAuth(Role.AGENT), TransactionController.getAgentHandledTransactions
);
// Shared
router.get('/my-history', checkAuth(Role.USER, Role.AGENT), TransactionController.getMyHistory);

// ADMIN routes
router.get('/', checkAuth(Role.ADMIN), TransactionController.getAll);
router.get('/my-commissions', checkAuth(Role.AGENT), TransactionController.getAgentCommissions);

export const TransactionRoutes = router;
