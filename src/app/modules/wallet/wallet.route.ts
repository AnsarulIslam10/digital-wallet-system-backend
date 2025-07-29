import express from 'express';
import { WalletController } from './wallet.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';

const router = express.Router();

router.get('/my-wallet', checkAuth(...Object.values(Role)), WalletController.getMyWallet);
router.get('/all-wallets', checkAuth(Role.ADMIN), WalletController.getAllWallets);
router.patch('/block/:walletId', checkAuth(Role.ADMIN), WalletController.blockWallet);
router.patch('/unblock/:walletId', checkAuth(Role.ADMIN), WalletController.unblockWallet);

export const WalletRoutes = router;
