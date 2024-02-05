import { FilterQuery, QueryOptions } from 'mongoose';

import ConnectionModel, { IConnectionInput } from '../models/connection.model';

const createConnection = async (input: Omit<IConnectionInput, 'createdAt' | 'updatedAt'>) => {
  return ConnectionModel.create(input);
};

const findConnection = async (query: FilterQuery<IConnectionInput>, options: QueryOptions = { lean: true }) => {
  return ConnectionModel.findOne(query, {}, options);
};

const findConnectionsForUser = async (query: FilterQuery<IConnectionInput>, options: QueryOptions = { lean: true }) => {
  // populate requestee and requester
  return ConnectionModel.find(query, {}, options).populate('requestee').populate('requester');
};

const updateConnection = async (
  query: FilterQuery<IConnectionInput>,
  update: FilterQuery<IConnectionInput>,
  options: QueryOptions = { lean: true },
) => {
  return ConnectionModel.findOneAndUpdate(query, update, options);
};

const checkConnectionExists = async (query: FilterQuery<IConnectionInput>) => {
  return ConnectionModel.exists(query);
};

const cancelConnection = async (query: FilterQuery<IConnectionInput>) => {
  return ConnectionModel.deleteOne(query);
};

export { cancelConnection, checkConnectionExists, createConnection, findConnection, findConnectionsForUser, updateConnection };
