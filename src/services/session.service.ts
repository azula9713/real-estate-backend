import config from 'config';
import { get } from 'lodash';
import { FilterQuery, UpdateQuery } from 'mongoose';

import SessionModel, { ISession } from '../models/session.model';
import { signJWT, verifyJWT } from '../utils/jwt.utils';
import { findUser } from './user.service';

const createSession = async (userId: string, userAgent: string) => {
  const session = await SessionModel.create({ user: userId, userAgent });

  return session.toJSON();
};

const findSessionsByUser = async (query: FilterQuery<ISession>) => {
  return SessionModel.find(query).lean();
};

const updateSession = async (query: FilterQuery<ISession>, update: UpdateQuery<ISession>) => {
  return SessionModel.updateOne(query, update);
};

const reIssueAccessToken = async (refreshToken: string) => {
  const { decoded } = verifyJWT(refreshToken);

  if (!decoded || !get(decoded, 'session')) return false;

  const session = await SessionModel.findById(get(decoded, 'session'));

  if (!session?.valid) return false;

  const user = await findUser({ _id: session.user });

  if (!user) return false;

  return signJWT(
    { ...user, session: session._id },
    { expiresIn: config.get('accessTokenTTL') }, // 15 minutes
  );
};

export { createSession, findSessionsByUser, reIssueAccessToken, updateSession };
