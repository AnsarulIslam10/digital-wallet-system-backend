"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transactionSchema = new mongoose_1.Schema({
    from: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    to: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    type: { type: String, required: true, enum: ['add', 'withdraw', 'send', 'cash-in', 'cash-out', 'fee'] },
    commission: { type: Number, default: 0 },
    description: { type: String },
}, { timestamps: true });
exports.Transaction = (0, mongoose_1.model)('Transaction', transactionSchema);
