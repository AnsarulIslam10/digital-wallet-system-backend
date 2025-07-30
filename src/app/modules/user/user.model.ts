import { model, Schema } from "mongoose";
import { Wallet } from "../wallet/wallet.model";
import { IUser, Role } from "./user.interface";


const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: Object.values(Role),
    default: Role.USER
  },
  isBlocked: { type: Boolean, default: false },
  isApproved: {
    type: Boolean,
    default: function (this: IUser) {
      return this.role !== Role.AGENT;
    }
  },

}, {
  timestamps: true,
  versionKey: false,
})

// Auto create wallet
userSchema.post('save', async function (user) {
  await Wallet.create({
    user: user._id,
    userInfo: {
      name: user.name,
      phone: user.phone,
    },
    balance: 50,
  });
});

export const User = model<IUser>("User", userSchema)