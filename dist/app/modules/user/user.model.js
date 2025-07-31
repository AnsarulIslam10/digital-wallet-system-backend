"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const wallet_model_1 = require("../wallet/wallet.model");
const user_interface_1 = require("./user.interface");
const userSchema = new mongoose_1.Schema({
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
        enum: Object.values(user_interface_1.Role),
        default: user_interface_1.Role.USER
    },
    isBlocked: { type: Boolean, default: false },
    isApproved: {
        type: Boolean,
        default: function () {
            return this.role !== user_interface_1.Role.AGENT;
        }
    },
}, {
    timestamps: true,
    versionKey: false,
});
userSchema.post('save', function (user) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingWallet = yield wallet_model_1.Wallet.findOne({ user: user._id });
        if (!existingWallet) {
            yield wallet_model_1.Wallet.create({
                user: user._id,
                userInfo: {
                    name: user.name,
                    phone: user.phone,
                },
                balance: 50,
            });
        }
    });
});
exports.User = (0, mongoose_1.model)("User", userSchema);
