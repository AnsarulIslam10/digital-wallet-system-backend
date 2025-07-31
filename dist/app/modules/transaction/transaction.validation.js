"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentCashOutValidation = exports.agentCashInValidation = exports.withdrawMoneyValidation = exports.sendMoneyValidation = exports.addMoneyValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const passwordField = zod_1.default
    .string({ invalid_type_error: "Password must be a string" })
    .length(6, { message: "Password must be exactly 6 digits." })
    .regex(/^\d{6}$/, { message: "Password must contain only numbers." });
exports.addMoneyValidation = zod_1.default.object({
    amount: zod_1.default.number().positive("Amount must be a positive number"),
});
exports.sendMoneyValidation = zod_1.default.object({
    amount: zod_1.default.number().positive("Amount must be a positive number"),
    receiverPhone: zod_1.default
        .string()
        .min(11, "Receiver phone number must be at least 11 digits"),
    password: passwordField,
});
exports.withdrawMoneyValidation = zod_1.default.object({
    amount: zod_1.default.number().positive("Amount must be a positive number"),
    password: passwordField,
});
exports.agentCashInValidation = zod_1.default.object({
    amount: zod_1.default.number().positive("Amount must be a positive number"),
    receiverPhone: zod_1.default
        .string()
        .min(11, "User phone number must be at least 11 digits"),
});
exports.agentCashOutValidation = zod_1.default.object({
    amount: zod_1.default.number().positive("Amount must be a positive number"),
    userPhone: zod_1.default
        .string()
        .min(11, "User phone number must be at least 11 digits"),
    password: passwordField,
});
