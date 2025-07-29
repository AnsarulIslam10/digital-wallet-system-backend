import { Schema, model } from 'mongoose';
import { IUser, Role, IsActive } from './user.interface';

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model<IUser>('User', userSchema);