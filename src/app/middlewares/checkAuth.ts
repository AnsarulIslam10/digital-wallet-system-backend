import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization;
        if (!accessToken) {
            throw new AppError(403, "No Token Recieved")
        }
        const vefiriedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload

        if (!authRoles.includes(vefiriedToken.role)) {
            throw new AppError(403, "You are not permitted to view this route")
        }

        req.user= vefiriedToken
        next()
    } catch (error) {
        next(error)
    }
}