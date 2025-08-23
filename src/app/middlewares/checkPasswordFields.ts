import { Request, Response, NextFunction } from "express";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";

export const checkPasswordFields = (req: Request, res: Response, next: NextFunction) => {
  const { currentPassword, newPassword } = req.body;
  if ((currentPassword && !newPassword) || (!currentPassword && newPassword)) {
    return next(new AppError(httpStatus.BAD_REQUEST, "To change password, both currentPassword and newPassword must be provided"));
  }
  next();
};
