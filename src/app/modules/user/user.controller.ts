/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import { UserServices } from './user.service';

import httpStatus from 'http-status-codes';
import { sendResponse } from '../../utils/sendResponse';
import { catchAsync } from '../../utils/catchAsync';
import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../errorHelpers/AppError';


const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const result = await UserServices.createUser(req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'User created successfully',
      data: result,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'All users retrieved successfully',
      data: result.data,
      meta: result.meta,
    });
  }
);

const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized: No token provided");
  }

  const decodedToken = req.user as JwtPayload;

  if (!decodedToken.userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized: Invalid token payload");
  }

  const result = await UserServices.getMe(decodedToken.userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile retrieved successfully",
    data: result.data,
  });
});


const approveAgent = catchAsync(async (req: Request, res: Response) => {
  const { agentId } = req.params;
  const result = await UserServices.updateApprovalStatus(agentId, true);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Agent approved",
    data: result,
  });
});

const suspendAgent = catchAsync(async (req: Request, res: Response) => {
  const { agentId } = req.params;
  const result = await UserServices.updateApprovalStatus(agentId, false);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Agent suspended",
    data: result,
  });
});
export const UserControllers = {
  createUser,
  getAllUsers,
  getMe,
  approveAgent,
  suspendAgent
};