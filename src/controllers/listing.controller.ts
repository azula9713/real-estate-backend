import { Request, Response } from 'express';

import { CreateListingInput, DeleteListingInput, GetListingInput, UpdateListingInput } from '../schemas/listing.schema';
import {
  createListing,
  deleteListing,
  findAllListings,
  findAndUpdateListing,
  findListing,
  findListings,
} from '../services/listing.service';
import { createNotification } from '../services/notification.service';
import { findUser } from '../services/user.service';
import logger from '../utils/logger';

const createListingHandler = async (req: Request<{}, {}, CreateListingInput['body']>, res: Response) => {
  const userId = res.locals.user._id;
  const userType = res.locals.user.userType;

  // only userType 1 or 2 can create listing
  if (userType !== 1 && userType !== 2) {
    console.log('userType: ', userType);
    return res.status(403).send('You are not authorized to create listing');
  }

  try {
    const listing = await createListing({ ...req.body, createdBy: userId, updatedBy: userId });

    // if createdBy and listedUnder are different, create notification for listedUnder
    if (listing.createdBy.toString() !== listing.listedUnder.toString()) {
      console.log('listedUnder', listing.listedUnder);
      console.log('createdBy', listing.createdBy);
      const user = await findUser({ _id: userId });
      // create notification
      await createNotification({
        createdBy: userId,
        updatedBy: userId,
        recipient: listing.listedUnder,
        beneficiary: listing.createdBy,
        type: 'listing',
        message: `You have a new listing from ${user?.firstName} ${user?.lastName}`,
        read: false,
      });
    }
    return res.send(listing);
  } catch (error) {
    logger.error('Error creating listing: ', error);
    return res.status(500).send(error);
  }
};

const getAllListingsHandler = async (_req: Request, res: Response) => {
  try {
    const listings = await findAllListings();
    return res.send(listings);
  } catch (error) {
    logger.error('Error getting all listings: ', error);
    return res.status(500).send(error);
  }
};

const getMyListingsHandler = async (_req: Request, res: Response) => {
  const userId = res.locals.user._id;
  try {
    // created by or listedUnder
    const listings = await findListings({ $or: [{ createdBy: userId }, { listedUnder: userId }] });

    return res.send(listings);
  } catch (error) {
    logger.error('Error getting all listings: ', error);
    return res.status(500).send(error);
  }
};

const getListingHandler = async (req: Request<GetListingInput['params']>, res: Response) => {
  const { listingId } = req.params;
  try {
    const listing = await findListing({ _id: listingId });
    return res.send(listing);
  } catch (error) {
    logger.error('Error getting listing: ', error);
    return res.status(500).send(error);
  }
};

const updateListingHandler = async (req: Request<UpdateListingInput['params']>, res: Response) => {
  const userId = res.locals.user._id;
  const userType = res.locals.user.userType;

  // only userType 1 or 2 can update listing
  if (userType !== 1 && userType !== 2) {
    return res.sendStatus(403);
  }

  const listingId = req.params.listingId;
  const update = req.body;
  try {
    const listing = await findAndUpdateListing({ _id: listingId }, { ...update, updatedBy: userId }, { new: true });
    return res.send(listing);
  } catch (error) {
    logger.error('Error updating listing: ', error);
    return res.status(500).send(error);
  }
};

const deleteListingHandler = async (req: Request<DeleteListingInput['params']>, res: Response) => {
  const userType = res.locals.user.userType;

  // only userType 1 or 2 can delete listing
  if (userType !== 1 && userType !== 2) {
    return res.sendStatus(403);
  }

  const listingId = req.params.listingId;
  try {
    await deleteListing({ _id: listingId });
    return res.sendStatus(200);
  } catch (error) {
    logger.error('Error deleting listing: ', error);
    return res.status(500).send(error);
  }
};

export { createListingHandler, deleteListingHandler, getAllListingsHandler, getListingHandler, getMyListingsHandler, updateListingHandler };
