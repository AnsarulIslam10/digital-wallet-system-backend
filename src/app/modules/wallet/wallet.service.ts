import AppError from '../../errorHelpers/AppError';
import { Wallet } from './wallet.model';


const getMyWallet = async (userId: string) => {
    const wallet = await Wallet.findOne({ user: userId }).populate('user', 'email role');
    if (!wallet) throw new AppError(404, 'Wallet not found');
    return wallet;
}

const getAllWallets = async () => {
    return Wallet.find().populate('user', 'email role');
}

const blockWallet = async (walletId: string) => {
    const wallet = await Wallet.findById(walletId);
    if (!wallet) throw new AppError(404, 'Wallet not found');
    wallet.isBlocked = true;
    await wallet.save();
    return wallet;
}

const unblockWallet = async (walletId: string) => {
    const wallet = await Wallet.findById(walletId);
    if (!wallet) throw new AppError(404, 'Wallet not found');
    wallet.isBlocked = false;
    await wallet.save();
    return wallet;
}
export const WalletServices = {
    getAllWallets,
    getMyWallet,
    blockWallet,
    unblockWallet
};
