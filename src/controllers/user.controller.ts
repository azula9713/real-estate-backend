import { Request, Response } from 'express';

import { CreateUserInput, GetAllUsersInput, UpdateUserInput } from '../schemas/user.schema';
import { createUser, findUsers, updateUser } from '../services/user.service';

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

export { createUserHandler, getAllUsersHandler, updateUserHandler };
