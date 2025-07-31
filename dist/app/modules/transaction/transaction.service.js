"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_model_1 = require("../user/user.model");
const wallet_model_1 = require("../wallet/wallet.model");
const transaction_model_1 = require("./transaction.model");
const addMoney = (userId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOne({ user: userId });
    if (!wallet || wallet.isBlocked)
        throw new AppError_1.default(403, 'Wallet is blocked or not found');
    wallet.balance += amount;
    yield wallet.save();
    yield transaction_model_1.Transaction.create({
        to: userId,
        amount,
        type: 'add',
        description: 'Wallet top-up',
    });
});
const withdrawMoney = (userId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOne({ user: userId });
    if (!wallet || wallet.isBlocked)
        throw new AppError_1.default(403, 'Wallet is blocked or not found');
    if (wallet.balance < amount)
        throw new AppError_1.default(400, 'Insufficient balance');
    wallet.balance -= amount;
    yield wallet.save();
    yield transaction_model_1.Transaction.create({
        from: userId,
        amount,
        type: 'withdraw',
        description: 'Wallet withdrawal',
    });
});
const sendMoney = (senderId, receiverPhone, amount) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const feeRate = env_1.envVars.TRANSACTION_FEE_PERCENT || 0;
    const fee = (amount * feeRate) / 100;
    const totalAmount = amount + fee;
    // Check daily limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sentToday = yield transaction_model_1.Transaction.aggregate([
        {
            $match: {
                from: new mongoose_1.default.Types.ObjectId(senderId),
                type: 'send',
                createdAt: { $gte: today }
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$amount' }
            }
        }
    ]);
    const totalSent = ((_a = sentToday[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
    if (totalSent + amount > env_1.envVars.DAILY_SEND_LIMIT) {
        throw new AppError_1.default(400, 'Daily send limit exceeded');
    }
    const sender = yield user_model_1.User.findById(senderId);
    const receiver = yield user_model_1.User.findOne({ phone: receiverPhone });
    if (!sender || !receiver)
        throw new AppError_1.default(404, 'Sender or receiver not found');
    const senderWallet = yield wallet_model_1.Wallet.findOne({ user: sender._id });
    const receiverWallet = yield wallet_model_1.Wallet.findOne({ user: receiver._id });
    if (!senderWallet || senderWallet.isBlocked)
        throw new AppError_1.default(403, 'Sender wallet is blocked');
    if (!receiverWallet || receiverWallet.isBlocked)
        throw new AppError_1.default(403, 'Receiver wallet is blocked');
    if (senderWallet.balance < totalAmount)
        throw new AppError_1.default(400, 'Insufficient balance with fee');
    senderWallet.balance -= totalAmount;
    receiverWallet.balance += amount;
    yield senderWallet.save();
    yield receiverWallet.save();
    yield transaction_model_1.Transaction.create({
        from: sender._id,
        to: receiver._id,
        amount,
        type: 'send',
        description: `Sent to ${receiver.phone}`,
    });
    if (fee > 0) {
        yield transaction_model_1.Transaction.create({
            from: sender._id,
            to: null,
            amount: fee,
            type: 'fee',
            description: 'Transaction fee',
        });
    }
});
const agentCashIn = (agentId, receiverPhone, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const agent = yield user_model_1.User.findById(agentId);
    if (!agent || agent.role !== 'agent') {
        throw new AppError_1.default(400, 'Only agents can perform cash-in');
    }
    if (!agent.isApproved) {
        throw new AppError_1.default(403, 'Agent is not approved yet');
    }
    const commission = amount * 0.02;
    const receiver = yield user_model_1.User.findOne({ phone: receiverPhone });
    const receiverWallet = yield wallet_model_1.Wallet.findOne({ user: receiver === null || receiver === void 0 ? void 0 : receiver._id });
    if (!receiverWallet || receiverWallet.isBlocked)
        throw new AppError_1.default(403, 'Receiver wallet is blocked');
    receiverWallet.balance += amount;
    yield receiverWallet.save();
    yield transaction_model_1.Transaction.create({
        from: agentId,
        to: receiver === null || receiver === void 0 ? void 0 : receiver._id,
        amount,
        type: 'cash-in',
        commission,
        description: 'Agent cash-in',
    });
});
const agentCashOut = (agentId, userPhone, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const agent = yield user_model_1.User.findById(agentId);
    if (!agent || agent.role !== 'agent') {
        throw new AppError_1.default(400, 'Only agents can perform cash-out');
    }
    if (!agent.isApproved) {
        throw new AppError_1.default(403, 'Agent is not approved yet');
    }
    const sender = yield user_model_1.User.findOne({ phone: userPhone });
    const senderWallet = yield wallet_model_1.Wallet.findOne({ user: sender === null || sender === void 0 ? void 0 : sender._id });
    if (!senderWallet || senderWallet.isBlocked)
        throw new AppError_1.default(403, 'Sender wallet is blocked');
    if (senderWallet.balance < amount)
        throw new AppError_1.default(400, 'Insufficient balance');
    senderWallet.balance -= amount;
    yield senderWallet.save();
    yield transaction_model_1.Transaction.create({
        from: sender === null || sender === void 0 ? void 0 : sender._id,
        to: agentId,
        amount,
        type: 'cash-out',
        description: 'Agent cash-out',
    });
});
const getMyTransactions = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const transactions = yield transaction_model_1.Transaction.find({
        $or: [{ from: userId }, { to: userId }],
    })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    const total = yield transaction_model_1.Transaction.countDocuments({
        $or: [{ from: userId }, { to: userId }],
    });
    return {
        data: transactions,
        meta: { page, limit, total },
    };
});
const getAllTransactions = () => __awaiter(void 0, void 0, void 0, function* () {
    return transaction_model_1.Transaction.find().sort({ createdAt: -1 });
});
const getAgentCommission = (agentId) => __awaiter(void 0, void 0, void 0, function* () {
    const commissions = yield transaction_model_1.Transaction.find({
        from: agentId,
        commission: { $gt: 0 },
    }).sort({ createdAt: -1 });
    const total = commissions.reduce((sum, tx) => sum + (tx.commission || 0), 0);
    return {
        totalCommission: total,
        data: commissions
    };
});
exports.TransactionService = {
    addMoney,
    withdrawMoney,
    sendMoney,
    agentCashIn,
    agentCashOut,
    getMyTransactions,
    getAllTransactions,
    getAgentCommission
};
