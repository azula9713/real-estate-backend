import mongoose from 'mongoose';
import { customAlphabet } from 'nanoid';

import { IUser } from './user.model';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10);

export interface IConnectionInput {
  createdBy: IUser['_id'];
  updatedBy: IUser['_id'];
  requester: IUser['_id'];
  requestee: IUser['_id'];
  status: 'pending' | 'accepted' | 'rejected';
}

export interface IConnection extends IConnectionInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const ConnectionSchema = new mongoose.Schema(
  {
    connectionId: {
      type: String,
      required: true,
      unique: true,
      default: () => nanoid(),
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    requestee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'pending',
    },
  },
  { timestamps: true },
);

const ConnectionModel = mongoose.model<IConnection>('Connection', ConnectionSchema);

export default ConnectionModel;
