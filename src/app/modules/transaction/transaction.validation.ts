import { z } from 'zod';

export const addMoneyValidation = z.object({
  body: z.object({
    amount: z.number().positive(),
  }),
});

export const sendMoneyValidation = z.object({
  body: z.object({
    amount: z.number().positive(),
    receiverPhone: z.string().min(10),
  }),
});

export const cashOutValidation = z.object({
  body: z.object({
    amount: z.number().positive(),
    userPhone: z.string().min(10),
  }),
});
