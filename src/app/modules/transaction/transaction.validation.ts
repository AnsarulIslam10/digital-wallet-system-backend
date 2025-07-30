import z from "zod";

export const addMoneyValidation = z.object({
  amount: z.number().positive("Amount must be a positive number"),
});

export const sendMoneyValidation = z.object({
  amount: z.number().positive("Amount must be a positive number"),
  receiverPhone: z.string().min(10, "Receiver phone number must be at least 10 digits"),
});

export const cashOutValidation = z.object({
  amount: z.number().positive("Amount must be a positive number"),
  userPhone: z.string().min(10, "User phone number must be at least 10 digits"),
});

export const agentCashInValidation = z.object({
  amount: z.number().positive("Amount must be a positive number"),
  receiverPhone: z.string().min(10, "User phone number must be at least 10 digits"),
});

export const agentCashOutValidation = z.object({
  amount: z.number().positive("Amount must be a positive number"),
  userPhone: z.string().min(10, "User phone number must be at least 10 digits"),
});
