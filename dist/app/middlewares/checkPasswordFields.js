"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPasswordFields = void 0;
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const checkPasswordFields = (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    if ((currentPassword && !newPassword) || (!currentPassword && newPassword)) {
        return next(new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "To change password, both currentPassword and newPassword must be provided"));
    }
    next();
};
exports.checkPasswordFields = checkPasswordFields;
