import dotenv from 'dotenv';
dotenv.config();

import compression from 'compression';
import config from 'config';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import deserializeUser from './middlewares/deserializeUser';
import routes from './routes/routes.index';
import dbConnect from './utils/dbConnect';
import logger from './utils/logger';

const port = config.get<number>('port');

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(deserializeUser);

app.listen(port, async () => {
  logger.info(`Server is listening on port at localhost:${port}`);
  await dbConnect('local');
  routes(app);
});
