import { Router } from 'express';

import {
  deleteNotificationHandler,
  getAllNotificationsHandler,
  updateNotificationStatusHandler,
} from '../controllers/notification.controller';
import requireUser from '../middlewares/requireUser';
import validate from '../middlewares/validateResource';

import { deleteNotificationSchema, updateNotificationSchema } from '../schemas/notification.schema';

const router = Router();

router.route('/all').get(requireUser, getAllNotificationsHandler);
router.route('/update/:notificationId').put([requireUser, validate(updateNotificationSchema)], updateNotificationStatusHandler);
router.route('/delete/:notificationId').delete([requireUser, validate(deleteNotificationSchema)], deleteNotificationHandler);

export default router;
