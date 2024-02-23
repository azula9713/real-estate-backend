import { TypeOf, object, string } from 'zod';

const params = {
  params: object({
    notificationId: string({
      required_error: 'Notification ID is required',
    }),
  }),
};

const deleteNotificationSchema = object({
  ...params,
});

const updateNotificationSchema = object({
  ...params,
});

type DeleteNotificationInput = TypeOf<typeof deleteNotificationSchema>;
type UpdateNotificationInput = TypeOf<typeof updateNotificationSchema>;

export { DeleteNotificationInput, UpdateNotificationInput, deleteNotificationSchema, updateNotificationSchema };
