import mongoose from 'mongoose';
import { customAlphabet } from 'nanoid';

import { IUser } from './user.model';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10);

export interface IListingInput {
  createdBy: IUser['_id'];
  updatedBy: IUser['_id'];
  title: string;
  description: string;
  price: number;
  location: string;
  photos: string[];
  listingType: 'rent' | 'sale' | 'lease';
  // propertyType: 'apartment' | 'house' | 'office' | 'land' | 'commercial';
  listedUnder: IUser['_id'];
  isAccepted: boolean;
  isPublished: boolean;
}

export interface IListing extends IListingInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  detailClicks: number;
}

const ListingSchema = new mongoose.Schema(
  {
    listingId: {
      type: String,
      required: true,
      unique: true,
      default: () => nanoid(),
    },
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
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    photos: {
      type: [String],
      required: true,
    },
    listingType: {
      type: String,
      enum: ['rent', 'sale', 'lease'],
      required: true,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
    listedUnder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // make sure other person accepts the listing
    isAccepted: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const ListingModel = mongoose.model<IListing>('Listing', ListingSchema);

export default ListingModel;
