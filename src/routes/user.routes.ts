import { Router } from 'express';
import { createUserHandler, getAllUsersHandler, updateUserHandler } from '../controllers/user.controller';

import requireUser from '../middlewares/requireUser';
import validate from '../middlewares/validateResource';
import { createUserSchema, updateUserSchema } from '../schemas/user.schema';

const router = Router();

router.route('/register').post(validate(createUserSchema), createUserHandler);
router.route('/all/:userType').get(getAllUsersHandler);
router.route('/update').put([requireUser, validate(updateUserSchema)], updateUserHandler);

export default router;
