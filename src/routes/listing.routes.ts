import { Router } from 'express';

import {
  createListingHandler,
  deleteListingHandler,
  getAllListingsHandler,
  getListingHandler,
  getMyListingsHandler,
  updateListingHandler,
} from '../controllers/listing.controller';
import requireUser from '../middlewares/requireUser';
import validate from '../middlewares/validateResource';
import { createListingSchema, deleteListingSchema, getListingSchema, updateListingSchema } from '../schemas/listing.schema';

const router = Router();

router.route('/all').get(getAllListingsHandler);
router.route('/my').get(requireUser, getMyListingsHandler);
router.route('/view/:listingId').get(validate(getListingSchema), getListingHandler);
router.route('/create').post([requireUser, validate(createListingSchema)], createListingHandler);
router.route('/update/:listingId').put([requireUser, validate(updateListingSchema)], updateListingHandler);
router.route('/delete/:listingId').delete([requireUser, validate(deleteListingSchema)], deleteListingHandler);

export default router;
