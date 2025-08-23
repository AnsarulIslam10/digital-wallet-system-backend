import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = req.headers.authorization || req.cookies.accessToken;

        if (!token) {
            throw new AppError(403, "No token received");
        }

        // Remove "Bearer " prefix if present
        if (token.startsWith("Bearer ")) {
            token = token.split(" ")[1];
        }

        const verifiedToken = verifyToken(token, envVars.JWT_ACCESS_SECRET) as JwtPayload;

        if (!verifiedToken || !verifiedToken.role) {
            throw new AppError(403, "Invalid token payload");
        }

        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(403, "You are not permitted to view this route");
        }

        req.user = verifiedToken; // attach decoded token to req.user
        next();
    } catch (error) {
        next(error);
    }
};
