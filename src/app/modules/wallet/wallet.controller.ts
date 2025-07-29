import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { WalletServices } from './wallet.service';


const getMyWallet = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const wallet = await WalletServices.getMyWallet(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Wallet fetched successfully',
        data: wallet,
    });
})

const getAllWallets = catchAsync(async (_req: Request, res: Response) => {
    const wallets = await WalletServices.getAllWallets();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All wallets fetched successfully',
        data: wallets,
    });
})

const blockWallet = catchAsync(async (req: Request, res: Response) => {
    const walletId = req.params.walletId;
    const result = await WalletServices.blockWallet(walletId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Wallet blocked successfully',
        data: result,
    });
})

const unblockWallet = catchAsync(async (req: Request, res: Response) => {
    const walletId = req.params.walletId;
    const result = await WalletServices.unblockWallet(walletId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Wallet unblocked successfully',
        data: result,
    });
})
export const WalletController = {
    getAllWallets,
    getMyWallet,
    blockWallet,
    unblockWallet
}
