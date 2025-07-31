"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
const zod_1 = require("zod");
const env_1 = require("../config/env");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = 'Something went wrong';
    let errorDetails = err;
    // Handle custom AppError
    if (err instanceof AppError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
    }
    // Handle Zod Validation Errors
    else if (err instanceof zod_1.ZodError) {
        statusCode = 400;
        message = 'Validation Error';
        errorDetails = err.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
        }));
    }
    // Handle generic Error
    else if (err instanceof Error) {
        message = err.message;
    }
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors: errorDetails,
        stack: env_1.envVars.NODE_ENV === 'development' ? err.stack : undefined,
    });
};
exports.globalErrorHandler = globalErrorHandler;
