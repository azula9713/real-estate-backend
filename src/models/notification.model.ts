import mongoose from 'mongoose';

import { IUser } from './user.model';

export interface INotificationInput {
  createdBy: IUser['_id'];
  updatedBy: IUser['_id'];
  recipient: IUser['_id'];
  message: string;
  read: boolean;
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
    message: {
      type: String,
      required: true,
      trim: true,
    },
    read: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true },
);

const NotificationModel = mongoose.model<INotification>('Notification', NotificationSchema);

export default NotificationModel;
