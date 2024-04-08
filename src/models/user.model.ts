import bcrypt from 'bcrypt';
import config from 'config';
import mongoose from 'mongoose';

import { IListing } from './listing.model';

export interface SavedFilter {
  location: {
    city?: string;
    district?: string;
  };
  priceRange: {
    min: number;
    max: number;
  };
  propertyType?: string;
}

export interface UserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: number;
  phoneNum: string;
  profilePic: string;
  savedListings: IListing['_id'][];
  savedFilters: SavedFilter[];
  location: string;
  rating?: number;
}

export interface IUser extends UserInput, mongoose.Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, minlength: 3, maxlength: 50 },
    lastName: { type: String, required: true, minlength: 3, maxlength: 50 },
    email: { type: String, required: true, minlength: 5, maxlength: 255, unique: true },
    password: { type: String, required: true, minlength: 8, maxlength: 1024 },
    userType: { type: Number, required: true, default: 0 }, //0:buyer, 1:seller 2:broker 3:admin
    phoneNum: { type: String, required: true, minlength: 10 },
    location: { type: String, required: true },
    savedListings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing', default: [] }],
    profilePic: { type: String, required: true },
    savedFilters: {
      type: [
        {
          location: {
            city: { type: String, required: false },
            district: { type: String, required: false },
          },
          priceRange: {
            min: { type: Number, required: false },
            max: { type: Number, required: false },
          },
          propertyType: { type: String, required: false },
          listingType: { type: String, required: false },
        },
      ],
      default: [],
    },
    rating: { type: Number, required: false, default: 0 },
  },
  { timestamps: true },
);

userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(config.get('saltWorkFactor'));
  const hash = await bcrypt.hash(this.password, salt);

  this.password = hash;

  return next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

const UserModel = mongoose.model<IUser>('User', userSchema);

export default UserModel;
