import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { TransactionService } from './transaction.service';

const addMoney = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionService.addMoney(req.user.userId, req.body.amount);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Money added successfully',
    data: result,
  });
})

const withdrawMoney = catchAsync(async (req: Request, res: Response) => {
  const { amount, password } = req.body;
  const result = await TransactionService.withdrawMoney(req.user.userId, amount, password);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Money withdrawn successfully',
    data: result,
  });
});


const sendMoney = catchAsync(async (req: Request, res: Response) => {
  const { receiverPhone, amount, password } = req.body;
  const result = await TransactionService.sendMoney(req.user.userId, receiverPhone, amount, password);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Money sent successfully',
    data: result
  });
});


const agentCashIn = catchAsync(async (req: Request, res: Response) => {
  const { receiverPhone, amount } = req.body;
  const result = await TransactionService.agentCashIn(req.user.userId, receiverPhone, amount);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cash-in successful',
    data: result
  });
});

const agentCashOut = catchAsync(async (req: Request, res: Response) => {
  const { userPhone, amount } = req.body;
  const result = await TransactionService.agentCashOut(req.user.userId, userPhone, amount);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cash-out successful',
    data: result
  });
});

const getMyHistory = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, type } = req.query;
  const userId = req.user?._id;

  const result = await TransactionService.getMyTransactions(
    userId,
    Number(page),
    Number(limit),
    type as string | undefined
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Transaction history retrieved",
    data: result,
  });
});


const getAll = catchAsync(async (_req: Request, res: Response) => {
  const result = await TransactionService.getAllTransactions();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All transactions retrieved',
    data: result,
  });
})
const getAgentCommissions = catchAsync(async (req: Request, res: Response) => {
  const agentId = req.user.userId;
  const result = await TransactionService.getAgentCommission(agentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Commission history retrieved',
    data: result,
  });
});
export const TransactionController = {
  addMoney,
  withdrawMoney,
  sendMoney,
  agentCashIn,
  agentCashOut,
  getMyHistory,
  getAll,
  getAgentCommissions

}