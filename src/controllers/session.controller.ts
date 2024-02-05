import config from 'config';
import { Request, Response } from 'express';

import { createSession, findSessionsByUser, updateSession } from '../services/session.service';
import { findUser, validateUser } from '../services/user.service';
import { signJWT } from '../utils/jwt.utils';

const createSessionHandler = async (req: Request, res: Response) => {
  // Validate the password and username
  const user = await validateUser(req.body);

  if (!user) {
    return res.status(401).send('Invalid username or password');
  }
  // Create a session for the user

  const session = await createSession(user._id.toString(), req.get('User-Agent') ?? '');
  // Generate access token
  const accessToken = signJWT({ ...user, session: session._id }, { expiresIn: config.get<string>('accessTokenTTL') });
  //Generate refresh token
  const refreshToken = signJWT({ ...user, session: session._id }, { expiresIn: config.get<string>('refreshTokenTTL') });
  // Send the access token and refresh token to the client

  return res.send({ user, accessToken, refreshToken });
};

const getUserSessionsHandler = async (_req: Request, res: Response) => {
  const userId = res.locals.user._id;
  const sessions = await findSessionsByUser({ user: userId, valid: true });
  return res.send(sessions);
};

const validateSessionHandler = async (_req: Request, res: Response) => {
  const userId = res.locals.user._id;
  const user = await findUser({ _id: userId });

  return res.send(user);
};

const logoutSessionHandler = async (_req: Request, res: Response) => {
  const sessionId = res.locals.user.session;
  await updateSession({ _id: sessionId }, { valid: false });
  return res.send({
    accessToken: null,
    refreshToken: null,
  });
};

export { createSessionHandler, getUserSessionsHandler, logoutSessionHandler, validateSessionHandler };
