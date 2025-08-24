import bcriptjs from 'bcryptjs';
import httpStatus from 'http-status-codes';
import { envVars } from '../../config/env';
import AppError from '../../errorHelpers/AppError';
import { IUser, Role } from './user.interface';
import { User } from './user.model';

const createUser = async (payload: Partial<IUser>) => {
  const { phone, password, email, ...rest } = payload;

  const isUserExist = await User.findOne({ phone });
  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
  }

  const hashedPassword = await bcriptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const userData: Partial<IUser> = {
    phone,
    password: hashedPassword,
    ...rest,
  };

  if (email) {
    userData.email = email;
  }

  const user = await User.create(userData);

  return user;
};

const getAllUsers = async () => {
  const users = await User.find({})
  const totalUsers = await User.countDocuments();

  return {
    data: users,
    meta: {
      total: totalUsers
    },
  };
};
const getMe = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  return { data: user };
};

const updateApprovalStatus = async (agentId: string, status: boolean) => {
  const user = await User.findById(agentId);
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'Agent not found');
  if (user.role !== Role.AGENT) throw new AppError(httpStatus.BAD_REQUEST, 'User is not an agent');

  user.isApproved = status;
  await user.save();
  return user;
};

const updateUser = async (userId: string, payload: Partial<IUser> & { currentPassword?: string, newPassword?: string }) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

  const { name, phone, currentPassword, newPassword } = payload;

  if (name) user.name = name;
  if (phone) {
    const isPhoneTaken = await User.findOne({ phone, _id: { $ne: userId } });
    if (isPhoneTaken) throw new AppError(httpStatus.BAD_REQUEST, "Phone number already in use");
    user.phone = phone;
  }

  if (currentPassword && newPassword) {
    const isMatch = await bcriptjs.compare(currentPassword, user.password);
    if (!isMatch) throw new AppError(httpStatus.BAD_REQUEST, "Current password is incorrect");
    user.password = await bcriptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND));
  }

  await user.save();
  return user;
};

const blockUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");
  user.isBlocked = true;
  await user.save();
  return user;
};

const unblockUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");
  user.isBlocked = false;
  await user.save();
  return user;
};

export const UserServices = {
  createUser,
  getAllUsers,
  getMe,
  updateUser,
  updateApprovalStatus,
  blockUser,
  unblockUser
};