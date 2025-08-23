import mongoose from 'mongoose';
import { envVars } from '../../config/env';
import AppError from '../../errorHelpers/AppError';
import { User } from '../user/user.model';
import { Wallet } from '../wallet/wallet.model';
import { Transaction } from './transaction.model';
import bcrypt from 'bcryptjs';

const addMoney = async (userId: string, amount: number) => {
  const wallet = await Wallet.findOne({ user: userId });
  if (!wallet || wallet.isBlocked) throw new AppError(403, 'Wallet is blocked or not found');

  wallet.balance += amount;
  await wallet.save();

  await Transaction.create({
    to: userId,
    amount,
    type: 'add',
    description: 'Wallet top-up',
  });
}

const withdrawMoney = async (userId: string, amount: number, password: string) => {
  const user = await User.findById(userId).select("+password"); // make sure password field is selected
  if (!user) throw new AppError(404, 'User not found');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError(400, 'Invalid password');

  const wallet = await Wallet.findOne({ user: userId });
  if (!wallet || wallet.isBlocked) throw new AppError(403, 'Wallet is blocked or not found');
  if (wallet.balance < amount) throw new AppError(400, 'Insufficient balance');

  wallet.balance -= amount;
  await wallet.save();

  await Transaction.create({
    from: userId,
    amount,
    type: 'withdraw',
    description: 'Wallet withdrawal',
  });

  return { balance: wallet.balance };
};

const sendMoney = async (senderId: string, receiverPhone: string, amount: number, password: string) => {
  const sender = await User.findById(senderId).select("+password");
  if (!sender) throw new AppError(404, 'Sender not found');

  // Password verification
  const isMatch = await bcrypt.compare(password, sender.password);
  if (!isMatch) throw new AppError(400, 'Invalid password');

  const feeRate = envVars.TRANSACTION_FEE_PERCENT || 0;
  const fee = (amount * feeRate) / 100;
  const totalAmount = amount + fee;

  // Check daily limit
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sentToday = await Transaction.aggregate([
    {
      $match: {
        from: new mongoose.Types.ObjectId(senderId),
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

  const totalSent = sentToday[0]?.total || 0;
  if (totalSent + amount > envVars.DAILY_SEND_LIMIT) {
    throw new AppError(400, 'Daily send limit exceeded');
  }

  const receiver = await User.findOne({ phone: receiverPhone });
  if (!receiver) throw new AppError(404, 'Receiver not found');

  const senderWallet = await Wallet.findOne({ user: sender._id });
  const receiverWallet = await Wallet.findOne({ user: receiver._id });

  if (!senderWallet || senderWallet.isBlocked) throw new AppError(403, 'Sender wallet is blocked');
  if (!receiverWallet || receiverWallet.isBlocked) throw new AppError(403, 'Receiver wallet is blocked');
  if (senderWallet.balance < totalAmount) throw new AppError(400, 'Insufficient balance with fee');

  senderWallet.balance -= totalAmount;
  receiverWallet.balance += amount;

  await senderWallet.save();
  await receiverWallet.save();

  await Transaction.create({
    from: sender._id,
    to: receiver._id,
    amount,
    type: 'send',
    description: `Sent to ${receiver.phone}`,
  });

  if (fee > 0) {
    await Transaction.create({
      from: sender._id,
      to: null,
      amount: fee,
      type: 'fee',
      description: 'Transaction fee',
    });
  }

  return { balance: senderWallet.balance };
};



const agentCashIn = async (agentId: string, receiverPhone: string, amount: number) => {
  const agent = await User.findById(agentId);
  if (!agent || agent.role !== 'agent') {
    throw new AppError(400, 'Only agents can perform cash-in');
  }
  if (!agent.isApproved) {
    throw new AppError(403, 'Agent is not approved yet');
  }

  const commission = amount * 0.02;

  const receiver = await User.findOne({ phone: receiverPhone });
  const receiverWallet = await Wallet.findOne({ user: receiver?._id });

  if (!receiverWallet) {
    throw new AppError(404, 'Receiver wallet not found');
  }

  if (receiverWallet.isBlocked) {
    throw new AppError(403, 'Receiver wallet is blocked');
  };
  await receiverWallet.save();

  await Transaction.create({
    from: agentId,
    to: receiver?._id,
    amount,
    type: 'cash-in',
    commission,
    description: 'Agent cash-in',
  });
};

const agentCashOut = async (agentId: string, userPhone: string, amount: number) => {
  const agent = await User.findById(agentId);
  if (!agent || agent.role !== 'agent') {
    throw new AppError(400, 'Only agents can perform cash-out');
  }
  if (!agent.isApproved) {
    throw new AppError(403, 'Agent is not approved yet');
  }

  const sender = await User.findOne({ phone: userPhone });
  const senderWallet = await Wallet.findOne({ user: sender?._id });

  if (!senderWallet || senderWallet.isBlocked) throw new AppError(403, 'Sender wallet is blocked');
  if (senderWallet.balance < amount) throw new AppError(400, 'Insufficient balance');

  senderWallet.balance -= amount;
  await senderWallet.save();

  await Transaction.create({
    from: sender?._id,
    to: agentId,
    amount,
    type: 'cash-out',
    description: 'Agent cash-out',
  });
};

const getMyTransactions = async (
  userId: string,
  page = 1,
  limit = 10,
  type?: string
) => {
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {
    $or: [{ from: userId }, { to: userId }],
  };

  if (type) {
    filter.type = type; // assumes your Transaction model has a "type" field
  }

  const transactions = await Transaction.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Transaction.countDocuments(filter);

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
};



const getAllTransactions = async () => {
  return Transaction.find().sort({ createdAt: -1 });
}
const getAgentCommission = async (agentId: string) => {
  const commissions = await Transaction.find({
    from: agentId,
    commission: { $gt: 0 },
  }).sort({ createdAt: -1 });

  const total = commissions.reduce((sum, tx) => sum + (tx.commission || 0), 0);

  return {
    totalCommission: total,
    data: commissions
  };
};


export const TransactionService = {
  addMoney,
  withdrawMoney,
  sendMoney,
  agentCashIn,
  agentCashOut,
  getMyTransactions,
  getAllTransactions,
  getAgentCommission
}
