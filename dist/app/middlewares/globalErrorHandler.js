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
const globalErrorHandler = (err, req, res, _next) => {
    let statusCode = 500;
    let message = 'Something went wrong';
    let errors = undefined;
    // Handle custom AppError
    if (err instanceof AppError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
    }
    // Handle Zod Validation Errors
    else if (err instanceof zod_1.ZodError) {
        statusCode = 400;
        message = 'Validation Error';
        errors = err.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
        }));
    }
    // Handle generic Error
    else if (err instanceof Error) {
        message = err.message;
    }
    // Build response
    const responsePayload = {
        success: false,
        statusCode,
        message,
    };
    if (errors)
        responsePayload.errors = errors;
    if (env_1.envVars.NODE_ENV === 'development')
        responsePayload.stack = err.stack;
    res.status(statusCode).json(responsePayload);
};
exports.globalErrorHandler = globalErrorHandler;
