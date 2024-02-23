import { omit } from 'lodash';
import { FilterQuery } from 'mongoose';

import UserModel, { IUser, UserInput } from '../models/user.model';
import logger from '../utils/logger';

const createUser = async (input: UserInput) => {
  try {
    const user = await UserModel.create(input);
    return omit(user.toJSON(), 'password');
  } catch (error) {
    logger.error(error);
    throw new Error(error as string);
  }
};

const validateUser = async ({ email, password }: { email: string; password: string }) => {
  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return false;
    }

    const isValid = await user.comparePassword(password);

    if (!isValid) {
      return false;
    }

    return omit(user.toJSON(), 'password');
  } catch (error) {
    logger.error(error);
    throw new Error(error as string);
  }
};

const findUser = async (query: FilterQuery<IUser>) => {
  return UserModel.findOne(query, { password: 0 }).lean();
};

const findUsers = async (query: FilterQuery<IUser>) => {
  return UserModel.find(query, { password: 0 }).lean();
};

const updateUser = async (id: string, update: Partial<IUser>) => {
  return UserModel.findByIdAndUpdate(id, update, { new: true }).lean();
};

export { createUser, findUser, findUsers, updateUser, validateUser };
