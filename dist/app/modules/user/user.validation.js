"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "Name must be string" })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }),
    email: zod_1.default
        .string({ invalid_type_error: "Email must be string" })
        .email({ message: "Invalid email address format." })
        .min(5, { message: "Email must be at least 5 characters long." })
        .max(100, { message: "Email cannot exceed 100 characters." }).optional(),
    password: zod_1.default
        .string({ invalid_type_error: "Password must be a string" })
        .min(6, { message: "Password must be at least 6 digits." })
        .max(6, { message: "Password must be exactly 6 digits." })
        .regex(/^\d{6}$/, {
        message: "Password must be a 6-digit number.",
    }),
    phone: zod_1.default
        .string({ invalid_type_error: "Phone Number must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    }),
    role: zod_1.default.enum([user_interface_1.Role.USER, user_interface_1.Role.AGENT, user_interface_1.Role.ADMIN]).optional()
});
exports.updateUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "Name must be string" })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." })
        .optional(),
    phone: zod_1.default
        .string({ invalid_type_error: "Phone must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
        .optional(),
    currentPassword: zod_1.default.string().optional(),
    newPassword: zod_1.default
        .string()
        .min(6, { message: "New password must be 6 digits" })
        .max(6, { message: "New password must be 6 digits" })
        .regex(/^\d{6}$/, { message: "New password must be a 6-digit number." })
        .optional(),
});
