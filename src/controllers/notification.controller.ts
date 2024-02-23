import { Request, Response } from 'express';

import { DeleteNotificationInput, UpdateNotificationInput } from '../schemas/notification.schema';
import { findNotification, findNotificationsForUser, updateNotification } from '../services/notification.service';
import logger from '../utils/logger';

const getAllNotificationsHandler = async (_req: Request, res: Response) => {
  const userId = res.locals.user._id;
  try {
    const notifications = await findNotificationsForUser({ recipient: userId });
    return res.send(notifications);
  } catch (error) {
    logger.error('Error getting all notifications: ', error);
    return res.status(500).send(error);
  }
};

const updateNotificationStatusHandler = async (req: Request<UpdateNotificationInput['params']>, res: Response) => {
  const userId = res.locals.user._id;
  const notificationId = req.params.notificationId;

  // check if notification receipient is the same as the user
  const notification = await findNotification({ _id: notificationId });
  if (!notification) {
    return res.status(404).send('Notification not found');
  }

  if (notification.recipient.toString() !== userId) {
    return res.status(403).send('You are not authorized to update this notification');
  }

  try {
    const updatedNotification = await updateNotification(
      { _id: notificationId },
      {
        read: true,
        updatedBy: userId,
      },
    );
    return res.send(updatedNotification);
  } catch (error) {
    logger.error('Error updating notification: ', error);
    return res.status(500).send(error);
  }
};

const deleteNotificationHandler = async (req: Request<DeleteNotificationInput['params']>, res: Response) => {
  const userId = res.locals.user._id;

  // check if notification receipient is the same as the user
  const notification = await findNotification({ _id: req.params.notificationId });
  if (!notification) {
    return res.status(404).send('Notification not found');
  }

  if (notification.recipient.toString() !== userId) {
    return res.status(403).send('You are not authorized to delete this notification');
  }

  try {
    await updateNotification(
      { _id: req.params.notificationId },
      {
        deleted: true,
        updatedBy: userId,
      },
    );
    return res.send('Notification deleted successfully');
  } catch (error) {
    logger.error('Error deleting notification: ', error);
    return res.status(500).send(error);
  }
};

export { deleteNotificationHandler, getAllNotificationsHandler, updateNotificationStatusHandler };
