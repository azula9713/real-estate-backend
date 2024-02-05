import { TypeOf, object, string, z } from 'zod';

const connectionStatusType = z.enum(['pending', 'accepted', 'rejected']).superRefine((val, ctx) => {
  if (!['pending', 'accepted', 'rejected'].includes(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Connection status must be either "pending", "accepted", or "rejected"',
    });
  }
});

const connectionPayload = {
  body: object({
    requester: string({
      required_error: 'Requestor is required',
    }),
    requestee: string({
      required_error: 'Requestee is required',
    }),
    status: connectionStatusType,
  }),
};

const params = {
  params: object({
    connectionId: string({
      required_error: 'Connection ID is required',
    }),
  }),
};

const createConnectionSchema = object({
  ...connectionPayload,
});

const updateConnectionSchema = object({
  ...connectionPayload,
  ...params,
});

const getConnectionSchema = object({
  ...params,
});

const deleteConnectionSchema = object({
  ...params,
});

type CreateConnectionInput = TypeOf<typeof createConnectionSchema>;
type UpdateConnectionInput = TypeOf<typeof updateConnectionSchema>;
type GetConnectionInput = TypeOf<typeof getConnectionSchema>;
type DeleteConnectionInput = TypeOf<typeof deleteConnectionSchema>;

export {
  CreateConnectionInput,
  DeleteConnectionInput,
  GetConnectionInput,
  UpdateConnectionInput,
  createConnectionSchema,
  deleteConnectionSchema,
  getConnectionSchema,
  updateConnectionSchema,
};
