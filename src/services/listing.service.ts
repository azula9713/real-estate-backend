import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';

import ListingModel, { IListingInput } from '../models/listing.model';

const createListing = async (input: Omit<IListingInput, 'createdAt' | 'updatedAt'>) => {
  return ListingModel.create(input);
};

const findAllListings = async () => {
  // populate is used to get the createdBy user details but hide the password and saved listings

  return ListingModel.find()
    .populate('createdBy', '-password -savedListings -createdAt -updatedAt')
    .populate('listedUnder', '-password -savedListings -createdAt -updatedAt')
    .lean();
};

const findListing = async (query: FilterQuery<IListingInput>, options: QueryOptions = { lean: true }) => {
  return ListingModel.findOne(query, {}, options)
    .populate('createdBy', '-password -savedListings -createdAt -updatedAt')
    .populate('listedUnder', '-password -savedListings -createdAt -updatedAt');
};

const findListings = async (query: FilterQuery<IListingInput>, options: QueryOptions = { lean: true }) => {
  return ListingModel.find(query, {}, options)
    .populate('createdBy', '-password -savedListings -createdAt -updatedAt')
    .populate('listedUnder', '-password -savedListings -createdAt -updatedAt');
};

const findAndUpdateListing = async (query: FilterQuery<IListingInput>, update: UpdateQuery<IListingInput>, options: QueryOptions) => {
  return ListingModel.findOneAndUpdate(query, update, options);
};

const deleteListing = async (query: FilterQuery<IListingInput>) => {
  return ListingModel.deleteOne(query);
};

export { createListing, deleteListing, findAllListings, findAndUpdateListing, findListing, findListings };
