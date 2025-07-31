/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ZodError } from 'zod';
import { NextFunction, Request, Response } from 'express';
import { envVars } from '../config/env';
import AppError from '../errorHelpers/AppError';

export const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    let statusCode = 500;
    let message = 'Something went wrong';
    let errors = undefined;

    // Handle custom AppError
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    // Handle Zod Validation Errors
    else if (err instanceof ZodError) {
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
    const responsePayload: Record<string, any> = {
        success: false,
        statusCode,
        message,
    };

    if (errors) responsePayload.errors = errors;
    if (envVars.NODE_ENV === 'development') responsePayload.stack = err.stack;

    res.status(statusCode).json(responsePayload);
};
