import { Router } from 'express';

import {
  createSessionHandler,
  getUserSessionsHandler,
  logoutSessionHandler,
  validateSessionHandler,
} from '../controllers/session.controller';
import requireUser from '../middlewares/requireUser';
import validate from '../middlewares/validateResource';
import createSessionSchema from '../schemas/session.schema';

const router = Router();

router.route('/').get(requireUser, getUserSessionsHandler);
router.route('/validate').get(requireUser, validateSessionHandler);
router.route('/logout').patch(requireUser, logoutSessionHandler);
router.route('/login').post(validate(createSessionSchema), createSessionHandler);

export default router;
