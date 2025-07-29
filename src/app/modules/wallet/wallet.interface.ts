import { Types, Document } from 'mongoose';

export interface IWallet extends Document {
  user: Types.ObjectId;
  balance: number;
  isBlocked: boolean;
}
