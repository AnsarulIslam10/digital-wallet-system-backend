"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const jwt_1 = require("../utils/jwt");
const env_1 = require("../config/env");
const checkAuth = (...authRoles) => (req, _res, next) => {
    var _a;
    try {
        // 🔑 Get token from cookies instead of headers
        const accessToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken;
        if (!accessToken) {
            throw new AppError_1.default(403, "No access token provided");
        }
        // 🔑 Verify token
        const verifiedToken = (0, jwt_1.verifyToken)(accessToken, env_1.envVars.JWT_ACCESS_SECRET);
        // 🔑 Role check (if roles provided)
        if (authRoles.length > 0 && !authRoles.includes(verifiedToken.role)) {
            throw new AppError_1.default(403, "You are not permitted to view this route");
        }
        // Attach user to request for later use
        req.user = verifiedToken;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.checkAuth = checkAuth;
