import { Request, Response } from 'express';

import { CreateUserInput, GetAllUsersInput, UpdateUserInput } from '../schemas/user.schema';
import { createUser, findUserSavedListings, findUsers, updateUser } from '../services/user.service';

import logger from '../utils/logger';

const createUserHandler = async (req: Request<{}, {}, CreateUserInput['body']>, res: Response) => {
  try {
    const user = await createUser(req.body);
    return res.send(user);
  } catch (e) {
    logger.error(e);
    return res.status(409).send((e as Error).message); //Same email already exists
  }
};

const getUserSavedListingsHandler = async (req: Request<{}, {}, {}>, res: Response) => {
  const userId = res.locals.user._id;
  try {
    const user = await findUserSavedListings(userId);
    return res.send(user);
  } catch (error) {
    logger.error('Error getting user saved listings: ', error);
    return res.status(500).send(error);
  }
};

// get all users with a specific userType
const getAllUsersHandler = async (req: Request<GetAllUsersInput['params']>, res: Response) => {
  const { userType } = req.params;
  try {
    const users = await findUsers({ userType: Number(userType) });
    return res.send(users);
  } catch (error) {
    logger.error('Error getting all users: ', error);
    return res.status(500).send(error);
  }
};

const updateUserHandler = async (req: Request<{}, {}, UpdateUserInput['body']>, res: Response) => {
  try {
    const userId = res.locals.user._id;
    const user = await updateUser(userId, req.body);
    return res.send(user);
  } catch (e) {
    logger.error(e);
    return res.status(409).send((e as Error).message); //Same email already exists
  }
};

export { createUserHandler, getAllUsersHandler, getUserSavedListingsHandler, updateUserHandler };
