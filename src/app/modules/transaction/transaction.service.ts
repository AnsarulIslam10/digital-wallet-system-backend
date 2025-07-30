import AppError from '../../errorHelpers/AppError';
import { User } from '../user/user.model';
import { Wallet } from '../wallet/wallet.model';
import { Transaction } from './transaction.model';


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

const withdrawMoney = async (userId: string, amount: number) => {
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
}

const sendMoney = async (senderId: string, receiverPhone: string, amount: number) => {
  const sender = await User.findById(senderId);
  const receiver = await User.findOne({ phone: receiverPhone });

  if (!sender || !receiver) throw new AppError(404, 'Sender or receiver not found');

  const senderWallet = await Wallet.findOne({ user: sender._id });
  const receiverWallet = await Wallet.findOne({ user: receiver._id });

  if (!senderWallet || senderWallet.isBlocked) throw new AppError(403, 'Sender wallet is blocked');
  if (!receiverWallet || receiverWallet.isBlocked) throw new AppError(403, 'Receiver wallet is blocked');
  if (senderWallet.balance < amount) throw new AppError(400, 'Insufficient balance');

  senderWallet.balance -= amount;
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

  if (!receiverWallet || receiverWallet.isBlocked) throw new AppError(403, 'Receiver wallet is blocked');

  receiverWallet.balance += amount;
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

const getMyTransactions = async (userId: string, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const transactions = await Transaction.find({
    $or: [{ from: userId }, { to: userId }],
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Transaction.countDocuments({
    $or: [{ from: userId }, { to: userId }],
  });

  return {
    data: transactions,
    meta: { page, limit, total },
  };
};

const getAllTransactions = async () => {
  return Transaction.find().sort({ createdAt: -1 });
}
const getAgentCommission = async (agentId: string) => {
  return Transaction.find({
    from: agentId,
    commission: { $gt: 0 },
  }).sort({ createdAt: -1 });
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
