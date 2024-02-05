import { Router } from 'express';
import { cancelConnectionHandler, createConnectionHandler, getMyConnectionsHandler } from '../controllers/connection.controller';
import requireUser from '../middlewares/requireUser';
import validate from '../middlewares/validateResource';
import { createConnectionSchema, deleteConnectionSchema } from '../schemas/connection.schema';

const router = Router();

router.route('/create').post([requireUser, validate(createConnectionSchema)], createConnectionHandler);
router.route('/my').get([requireUser], getMyConnectionsHandler);
router.route('/cancel/:connectionId').delete([requireUser, validate(deleteConnectionSchema)], cancelConnectionHandler);

export default router;
