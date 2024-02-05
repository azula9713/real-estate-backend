import config from 'config';
import mongoose from 'mongoose';
import logger from './logger';

type connectMode = 'local' | 'cloud';

const getConnectionString = (mode: connectMode) => {
  const dbName = config.get<string>('mongo.dbName');
  const dbHost = config.get<string>('mongo.host');

  if (mode === 'local') {
    return `mongodb://${dbHost}:27017/${dbName}`;
  }

  const dbUser = config.get<string>('mongo.username');
  const dbPassword = config.get<string>('mongo.password');

  return `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority`;
};

const dbConnect = async (mode: connectMode) => {
  try {
    await mongoose.connect(getConnectionString(mode));
    logger.info(`Connected to ${mode} database`);
  } catch (error) {
    console.log('error', error);
    logger.error('Error connecting to MongoDB', error);
    process.exit(1);
  }
};

export default dbConnect;
