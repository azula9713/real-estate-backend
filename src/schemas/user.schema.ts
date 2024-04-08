import { TypeOf, array, number, object, string } from 'zod';

//validate min < max
const savedFiltersSchema = object({
  location: object({
    district: string().optional(),
    city: string().optional(),
  }),
  priceRange: object({
    min: number({ invalid_type_error: 'Minimum price must be a number' }),
    max: number({ invalid_type_error: 'Maximum price must be a number' }),
  }).refine((data) => data.min < data.max, {
    message: 'Minimum price must be less than maximum price',
    path: ['priceRange'],
  }),
  propertyType: string().optional(),
  listingType: string().optional(),
});

const createUserSchema = object({
  body: object({
    firstName: string({ required_error: 'First name is required' }),
    lastName: string({ required_error: 'Last name is required' }),
    password: string({ required_error: 'Password is required' }).min(8, 'Password must be at least 8 characters long'),
    confirmPassword: string({ required_error: 'Confirm password is required' }),
    email: string({ required_error: 'Email is required' }).email('Email is invalid'),
    phoneNum: string({ required_error: 'Phone number is required' }),
    location: string({ required_error: 'Location is required' }),
    profilePic: string({ required_error: 'Profile picture is required' }),
    userType: number({ required_error: 'User type is required', invalid_type_error: 'User type must be a number' }),
    savedListings: array(string()),
    savedFilters: array(savedFiltersSchema),
    rating: number().optional(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }),
});

const updateUserSchema = object({
  body: object({
    firstName: string({ required_error: 'First name is required' }),
    lastName: string({ required_error: 'Last name is required' }),
    email: string({ required_error: 'Email is required' }).email('Email is invalid'),
    phoneNum: string({ required_error: 'Phone number is required' }),
    location: string({ required_error: 'Location is required' }),
    profilePic: string({ required_error: 'Profile picture is required' }),
    userType: number({ required_error: 'User type is required', invalid_type_error: 'User type must be a number' }),
    savedListings: array(string()),
    savedFilters: array(savedFiltersSchema),
    rating: number().optional(),
  }),
});

const singleUserParam = {
  params: object({
    userId: string({
      required_error: 'User ID is required',
    }),
  }),
};

const userTypeParam = {
  params: object({
    userType: string({
      required_error: 'User type is required',
      invalid_type_error: 'User type must be a number',
    }),
  }),
};

const getUserSchema = object({
  ...singleUserParam,
});

const getAllUsersSchema = object({
  ...userTypeParam,
});

type CreateUserInput = Omit<TypeOf<typeof createUserSchema>, 'body.confirmPassword'>;
type UpdateUserInput = TypeOf<typeof updateUserSchema>;
type GetSingleUserInput = TypeOf<typeof getUserSchema>;
type GetAllUsersInput = TypeOf<typeof getAllUsersSchema>;

export {
  CreateUserInput,
  GetAllUsersInput,
  GetSingleUserInput,
  UpdateUserInput,
  createUserSchema,
  getAllUsersSchema,
  getUserSchema,
  updateUserSchema,
};
