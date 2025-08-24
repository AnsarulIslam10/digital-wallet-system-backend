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
/* eslint-disable @typescript-eslint/no-explicit-any */
const bcryptjs_1 = __importDefault(require("bcryptjs"));
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
const withdrawMoney = (userId, amount, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).select("+password"); // make sure password field is selected
    if (!user)
        throw new AppError_1.default(404, 'User not found');
    const isMatch = yield bcryptjs_1.default.compare(password, user.password);
    if (!isMatch)
        throw new AppError_1.default(400, 'Invalid password');
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
    return { balance: wallet.balance };
});
const sendMoney = (senderId, receiverPhone, amount, password) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const sender = yield user_model_1.User.findById(senderId).select("+password");
    if (!sender)
        throw new AppError_1.default(404, 'Sender not found');
    // Password verification
    const isMatch = yield bcryptjs_1.default.compare(password, sender.password);
    if (!isMatch)
        throw new AppError_1.default(400, 'Invalid password');
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
    const receiver = yield user_model_1.User.findOne({ phone: receiverPhone });
    if (!receiver)
        throw new AppError_1.default(404, 'Receiver not found');
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
    return { balance: senderWallet.balance };
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
    if (!receiverWallet) {
        throw new AppError_1.default(404, 'Receiver wallet not found');
    }
    if (receiverWallet.isBlocked) {
        throw new AppError_1.default(403, 'Receiver wallet is blocked');
    }
    ;
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
const agentCashOut = (agentId, userPhone, amount, password // <-- added password
) => __awaiter(void 0, void 0, void 0, function* () {
    const agent = yield user_model_1.User.findById(agentId);
    if (!agent || agent.role !== 'agent') {
        throw new AppError_1.default(400, 'Only agents can perform cash-out');
    }
    if (!agent.isApproved) {
        throw new AppError_1.default(403, 'Agent is not approved yet');
    }
    // Find the user
    const sender = yield user_model_1.User.findOne({ phone: userPhone }).select("+password");
    if (!sender)
        throw new AppError_1.default(404, 'User not found');
    // Verify user password
    const isPasswordValid = yield bcryptjs_1.default.compare(password, sender.password);
    if (!isPasswordValid)
        throw new AppError_1.default(400, 'Invalid password');
    const senderWallet = yield wallet_model_1.Wallet.findOne({ user: sender._id });
    if (!senderWallet)
        throw new AppError_1.default(404, 'User wallet not found');
    if (senderWallet.isBlocked)
        throw new AppError_1.default(403, 'User wallet is blocked');
    if (senderWallet.balance < amount)
        throw new AppError_1.default(400, 'Insufficient balance');
    // Deduct amount
    senderWallet.balance -= amount;
    yield senderWallet.save();
    // Record transaction
    yield transaction_model_1.Transaction.create({
        from: sender._id,
        to: agentId,
        amount,
        type: 'cash-out',
        description: 'Agent cash-out',
    });
    return { balance: senderWallet.balance };
});
const getMyTransactions = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, page = 1, limit = 10, type) {
    const skip = (page - 1) * limit;
    const filter = {
        $or: [{ from: userId }, { to: userId }],
    };
    if (type) {
        filter.type = type; // assumes your Transaction model has a "type" field
    }
    const transactions = yield transaction_model_1.Transaction.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    const total = yield transaction_model_1.Transaction.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    return {
        data: transactions,
        meta: {
            page,
            limit,
            total,
            totalPages,
        },
    };
});
const getAgentTransactions = (agentId_1, ...args_1) => __awaiter(void 0, [agentId_1, ...args_1], void 0, function* (agentId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const filter = {
        type: { $in: ['cash-in', 'cash-out'] },
        $or: [{ from: agentId }, { to: agentId }],
    };
    const transactions = yield transaction_model_1.Transaction.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    const total = yield transaction_model_1.Transaction.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    return {
        data: transactions,
        meta: { page, limit, total, totalPages },
    };
});
const getAllTransactions = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10, sort = "desc", search, type, minAmount, maxAmount) {
    const skip = (page - 1) * limit;
    const query = {};
    // Filter by type
    if (type)
        query.type = type;
    // Filter by amount
    if (minAmount !== undefined || maxAmount !== undefined) {
        query.amount = {};
        if (minAmount !== undefined)
            query.amount.$gte = minAmount;
        if (maxAmount !== undefined)
            query.amount.$lte = maxAmount;
    }
    // Filter by description only
    if (search) {
        query.description = { $regex: search, $options: "i" };
    }
    const transactions = yield transaction_model_1.Transaction.find(query)
        .populate("from", "phone role")
        .populate("to", "phone role")
        .sort({ createdAt: sort })
        .skip(skip)
        .limit(limit);
    const total = yield transaction_model_1.Transaction.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    return {
        data: transactions,
        meta: { page, limit, total, totalPages },
    };
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
    getAgentTransactions,
    getAllTransactions,
    getAgentCommission
};
