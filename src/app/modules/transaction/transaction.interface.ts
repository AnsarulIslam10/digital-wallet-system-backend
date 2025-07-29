import { Types, Document } from 'mongoose';

export type TransactionType = 'add' | 'withdraw' | 'send' | 'cash-in' | 'cash-out';

export interface ITransaction extends Document {
  from?: Types.ObjectId;
  to?: Types.ObjectId;
  amount: number;
  type: TransactionType;
  description?: string;
  createdAt: Date;
}
