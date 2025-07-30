import { Types, Document } from 'mongoose';

export type TransactionType = 'add' | 'withdraw' | 'send' | 'cash-in' | 'cash-out' | 'fee';

export interface ITransaction extends Document {
  from?: Types.ObjectId;
  to?: Types.ObjectId;
  amount: number;
  type: TransactionType;
  commission?: number;
  description?: string;
  createdAt: Date;
}
