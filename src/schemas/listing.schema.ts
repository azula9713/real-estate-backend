import { TypeOf, array, boolean, number, object, string, z } from 'zod';

const ListingType = z.enum(['rent', 'sale', 'lease']).superRefine((val, ctx) => {
  if (!['rent', 'sale', 'lease'].includes(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Listing type must be either "rent", "sale", or "lease"',
    });
  }
});

const listingPayload = {
  body: object({
    title: string({
      required_error: 'Title is required',
    }),
    description: string({
      required_error: 'Description is required',
    }),
    price: number({
      required_error: 'Price is required',
    }),
    location: string({
      required_error: 'Location is required',
    }),
    // photos string array
    photos: array(
      string({
        required_error: 'Photos is required',
      }),
    ),
    listingType: ListingType,
    clickCount: number({
      required_error: 'Listing count is required',
    }),
    listedUnder: string({
      required_error: 'Listed under is required',
    }),
    isAccepted: boolean({
      required_error: 'isAccepted is required',
    }),
    isPublished: boolean({
      required_error: 'isPublished is required',
    }),
  }),
};

const params = {
  params: object({
    listingId: string({
      required_error: 'Listing ID is required',
    }),
  }),
};

const createListingSchema = object({
  ...listingPayload,
});

const updateListingSchema = object({
  ...listingPayload,
  ...params,
});

const deleteListingSchema = object({
  ...params,
});

const getListingSchema = object({
  ...params,
});

type CreateListingInput = TypeOf<typeof createListingSchema>;
type UpdateListingInput = TypeOf<typeof updateListingSchema>;
type DeleteListingInput = TypeOf<typeof deleteListingSchema>;
type GetListingInput = TypeOf<typeof getListingSchema>;

export {
  CreateListingInput,
  DeleteListingInput,
  GetListingInput,
  UpdateListingInput,
  createListingSchema,
  deleteListingSchema,
  getListingSchema,
  updateListingSchema,
};
