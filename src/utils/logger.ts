import pino from 'pino';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      timestampKey: 'time',
      translateTime: 'SYS: yyyy-mm-dd HH:MM',
    },
  },
  base: { pid: false },
});

export default logger;
