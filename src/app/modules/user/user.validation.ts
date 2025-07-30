import z from "zod";
import { Role } from "./user.interface";

export const createUserZodSchema = z.object({
    name: z
        .string({ invalid_type_error: "Name must be string" })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }),
    email: z
        .string({ invalid_type_error: "Email must be string" })
        .email({ message: "Invalid email address format." })
        .min(5, { message: "Email must be at least 5 characters long." })
        .max(100, { message: "Email cannot exceed 100 characters." }).optional(),
    password: z
        .string({ invalid_type_error: "Password must be a string" })
        .min(6, { message: "Password must be at least 6 digits." })
        .max(6, { message: "Password must be exactly 6 digits." })
        .regex(/^\d{6}$/, {
            message: "Password must be a 6-digit number.",
        }),

    phone: z
        .string({ invalid_type_error: "Phone Number must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
            message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
        }),
    role: z.enum([Role.USER, Role.AGENT, Role.ADMIN]).optional()
})