import { z } from 'zod';

export const amountSchema = z.object({
  amount: z.number().positive(),
});

export const sendMoneySchema = z.object({
  amount: z.number().positive(),
  receiverEmail: z.string().email(),
});
