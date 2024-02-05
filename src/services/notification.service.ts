import { FilterQuery, QueryOptions } from 'mongoose';

import NotificationModel, { INotificationInput } from '../models/notification.model';

const createNotification = async (input: Omit<INotificationInput, 'createdAt' | 'updatedAt'>) => {
  return NotificationModel.create(input);
};

const findNotification = async (query: FilterQuery<INotificationInput>, options: QueryOptions = { lean: true }) => {
  return NotificationModel.findOne(query, {}, options);
};

const findNotificationsForUser = async (query: FilterQuery<INotificationInput>, options: QueryOptions = { lean: true }) => {
  return NotificationModel.find(query, {}, options).populate('recipient');
};

const updateNotification = async (
  query: FilterQuery<INotificationInput>,
  update: FilterQuery<INotificationInput>,
  options: QueryOptions = { lean: true },
) => {
  return NotificationModel.findOneAndUpdate(query, update, options);
};

const deleteNotification = async (query: FilterQuery<INotificationInput>) => {
  return NotificationModel.deleteOne(query);
};

export { createNotification, deleteNotification, findNotification, findNotificationsForUser, updateNotification };
