import z from "zod";

const passwordField = z
  .string({ invalid_type_error: "Password must be a string" })
  .length(6, { message: "Password must be exactly 6 digits." })
  .regex(/^\d{6}$/, { message: "Password must contain only numbers." });

export const addMoneyValidation = z.object({
  amount: z.number().positive("Amount must be a positive number"),
});

export const sendMoneyValidation = z.object({
  amount: z.number().positive("Amount must be a positive number"),
  receiverPhone: z
    .string()
    .min(11, "Receiver phone number must be at least 11 digits"),
  password: passwordField,
});


export const withdrawMoneyValidation = z.object({
  amount: z.number().positive("Amount must be a positive number"),
  password: passwordField,
});

export const agentCashInValidation = z.object({
  amount: z.number().positive("Amount must be a positive number"),
  receiverPhone: z
    .string()
    .min(11, "User phone number must be at least 11 digits"),
});

export const agentCashOutValidation = z.object({
  amount: z.number().positive("Amount must be a positive number"),
  userPhone: z
    .string()
    .min(11, "User phone number must be at least 11 digits"),
  password: passwordField,
});
