import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';

import ListingModel, { IListingInput } from '../models/listing.model';

const createListing = async (input: Omit<IListingInput, 'createdAt' | 'updatedAt'>) => {
  return ListingModel.create(input);
};

const findAllListings = async () => {
  return ListingModel.find().populate('createdBy').populate('listedUnder');
};

const findListing = async (query: FilterQuery<IListingInput>, options: QueryOptions = { lean: true }) => {
  return ListingModel.findOne(query, {}, options);
};

const findListings = async (query: FilterQuery<IListingInput>, options: QueryOptions = { lean: true }) => {
  return ListingModel.find(query, {}, options);
};

const findAndUpdateListing = async (query: FilterQuery<IListingInput>, update: UpdateQuery<IListingInput>, options: QueryOptions) => {
  return ListingModel.findOneAndUpdate(query, update, options);
};

const deleteListing = async (query: FilterQuery<IListingInput>) => {
  return ListingModel.deleteOne(query);
};

export { createListing, deleteListing, findAllListings, findAndUpdateListing, findListing, findListings };
