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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone, password, email } = payload, rest = __rest(payload, ["phone", "password", "email"]);
    const isUserExist = yield user_model_1.User.findOne({ phone });
    if (isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User Already Exist");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const userData = Object.assign({ phone, password: hashedPassword }, rest);
    if (email) {
        userData.email = email;
    }
    const user = yield user_model_1.User.create(userData);
    return user;
});
const getAllUsers = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10, search) {
    const skip = (page - 1) * limit;
    const query = {};
    if (search) {
        query.$or = [
            { phone: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { name: { $regex: search, $options: "i" } },
        ];
    }
    // Debug: log the query
    console.log("Mongo query:", JSON.stringify(query));
    const [users, totalUsers] = yield Promise.all([
        user_model_1.User.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        user_model_1.User.countDocuments(query),
    ]);
    const totalPages = Math.ceil(totalUsers / limit);
    return {
        data: users,
        meta: {
            page,
            limit,
            total: totalUsers,
            totalPages,
        },
    };
});
const getMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).select("-password");
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    return { data: user };
});
const updateApprovalStatus = (agentId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(agentId);
    if (!user)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Agent not found');
    if (user.role !== user_interface_1.Role.AGENT)
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'User is not an agent');
    user.isApproved = status;
    yield user.save();
    return user;
});
const updateUser = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    const { name, phone, currentPassword, newPassword } = payload;
    if (name)
        user.name = name;
    if (phone) {
        const isPhoneTaken = yield user_model_1.User.findOne({ phone, _id: { $ne: userId } });
        if (isPhoneTaken)
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Phone number already in use");
        user.phone = phone;
    }
    if (currentPassword && newPassword) {
        const isMatch = yield bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isMatch)
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Current password is incorrect");
        user.password = yield bcryptjs_1.default.hash(newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    }
    yield user.save();
    return user;
});
const blockUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    user.isBlocked = true;
    yield user.save();
    return user;
});
const unblockUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    user.isBlocked = false;
    yield user.save();
    return user;
});
exports.UserServices = {
    createUser,
    getAllUsers,
    getMe,
    updateUser,
    updateApprovalStatus,
    blockUser,
    unblockUser
};
