import { Express } from 'express';

import connectionRoutes from './connection.routes';
import listingRoutes from './listing.routes';
import notificationRoutes from './notification.routes';
import sessionRoutes from './session.routes';
import userRoutes from './user.routes';

const routes = (app: Express): void => {
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/auth', sessionRoutes);
  app.use('/api/v1/listings', listingRoutes);
  app.use('/api/v1/connections', connectionRoutes);
  app.use('/api/v1/notifications', notificationRoutes);
};

export default routes;
