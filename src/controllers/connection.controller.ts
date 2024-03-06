import { Request, Response } from 'express';
import { CreateConnectionInput, GetConnectionInput, UpdateConnectionInput } from '../schemas/connection.schema';
import {
  cancelConnection,
  checkConnectionExists,
  createConnection,
  findConnection,
  findConnectionsForUser,
  updateConnection,
} from '../services/connection.service';
import { createNotification } from '../services/notification.service';
import { findUser } from '../services/user.service';
import logger from '../utils/logger';

const createConnectionHandler = async (req: Request<{}, {}, CreateConnectionInput['body']>, res: Response) => {
  const userId = res.locals.user._id;
  const userType = res.locals.user.userType;

  const { requestee, requester } = req.body;

  if (requestee === requester) {
    return res.status(400).send('You cannot connect with yourself');
  }

  // check if connection already exists
  const connectionExists = await checkConnectionExists({ requestee, requester });
  if (connectionExists) {
    return res.status(400).send('Connection already exists');
  }

  // either side should be userType 2 to create connection
  if (userType !== 2) {
    //   check if requestee is userType 2
    //   if not, return 403
    const requesteeUser = await findUser({ _id: requestee });
    if (requesteeUser && requesteeUser.userType !== 2) {
      return res.status(403).send('You are not authorized to create connection');
    }
  }

  try {
    const connection = await createConnection({ ...req.body, createdBy: userId, updatedBy: userId });

    const user = await findUser({ _id: requester });

    if (!user) return res.status(404).send('User not found');
    // create notification
    await createNotification({
      createdBy: userId,
      updatedBy: userId,
      recipient: requestee,
      beneficiary: requester,
      type: 'connection',
      message: `You have a new connection request from ${user?.firstName} ${user?.lastName}`,
      read: false,
    });
    return res.send(connection);
  } catch (error) {
    logger.error('Error creating connection: ', error);
    return res.status(500).send(error);
  }
};

const getMyConnectionsHandler = async (_req: Request, res: Response) => {
  const userId = res.locals.user._id;

  try {
    // get all connections where requestee or requester is userId
    const connections = await findConnectionsForUser({ $or: [{ requestee: userId }, { requester: userId }] });
    return res.send(connections);
  } catch (error) {
    logger.error('Error getting connections: ', error);
    return res.status(500).send(error);
  }
};

const updateConnectionHandler = async (req: Request<UpdateConnectionInput['params'], {}, UpdateConnectionInput['body']>, res: Response) => {
  const userId = res.locals.user._id;
  const { connectionId } = req.params;

  try {
    const connection = await findConnection({ _id: connectionId });
    if (!connection) {
      return res.status(404).send('Connection not found');
    }

    if (userId !== connection.requestee.toString()) {
      return res.status(403).send('You are not authorized to update this connection');
    }

    const updatedConnection = await updateConnection({ _id: connectionId }, { ...req.body, updatedBy: userId });
    return res.send(updatedConnection);
  } catch (error) {
    logger.error('Error updating connection: ', error);
    return res.status(500).send(error);
  }
};

const cancelConnectionHandler = async (req: Request<GetConnectionInput['params']>, res: Response) => {
  const userId = res.locals.user._id;
  const { connectionId } = req.params;

  try {
    const connection = await findConnection({ _id: connectionId });
    if (!connection) {
      return res.status(404).send('Connection not found');
    }

    if (userId !== connection.requester.toString()) {
      return res.status(403).send('You are not authorized to cancel this connection');
    }

    await cancelConnection({ _id: connectionId });
    return res.sendStatus(200);
  } catch (error) {
    logger.error('Error canceling connection: ', error);
    return res.status(500).send(error);
  }
};

export { cancelConnectionHandler, createConnectionHandler, getMyConnectionsHandler, updateConnectionHandler };
