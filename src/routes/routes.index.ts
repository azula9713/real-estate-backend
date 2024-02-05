import { Express } from 'express';

import connectionRoutes from './connection.routes';
import listingRoutes from './listing.routes';
import sessionRoutes from './session.routes';
import userRoutes from './user.routes';

const routes = (app: Express): void => {
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/auth', sessionRoutes);
  app.use('/api/v1/listings', listingRoutes);
  app.use('/api/v1/connections', connectionRoutes);
};

export default routes;
