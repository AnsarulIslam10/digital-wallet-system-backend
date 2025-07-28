import { IUser } from './user.interface';
import { User } from './user.model';

const createUser = async (payload: Partial<IUser>) => {
  const user = await User.create(payload);
  return user;
};

const getAllUsers = async () => {
  const users = await User.find().select('-password');
  const total = await User.countDocuments();

  return {
    data: users,
    meta: {
      total,
    },
  };
};

export const UserServices = {
  createUser,
  getAllUsers,
};
