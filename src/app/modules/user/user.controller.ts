/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import { UserServices } from './user.service';

import httpStatus from 'http-status-codes';
import { sendResponse } from '../../utils/sendResponst';
import { catchAsync } from '../../utils/catchAsync';


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

export const UserControllers = {
  createUser,
  getAllUsers,
};