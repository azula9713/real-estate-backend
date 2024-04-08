import mongoose from 'mongoose';

import { IUser } from './user.model';

export interface INotificationInput {
  createdBy: IUser['_id'];
  updatedBy: IUser['_id'];
  recipient: IUser['_id'];
  beneficiary: IUser['_id'];
  type: 'connection' | 'listing';
  message: string;
  read: boolean;
  deleted: boolean;
}

export interface INotification extends INotificationInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new mongoose.Schema(
  {
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
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    beneficiary: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['connection', 'listing'],
    },
    read: {
      type: Boolean,
      required: true,
      default: false,
    },
    deleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true },
);

const NotificationModel = mongoose.model<INotification>('Notification', NotificationSchema);

export default NotificationModel;
