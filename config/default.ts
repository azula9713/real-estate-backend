export default {
  port: ``,
  saltWorkFactor: 10,
  accessTokenTTL: '30m',
  refreshTokenTTL: '30d',
  redis: {
    port: 'redis://77.68.33.34:6379',
    host: 'localhost',
    password: 'secret',
  },
  session: {
    secret: 'secretkey',
    resave: false,
    name: 'sid',
    idleTimeout: 1000 * 60 * 30,
  },
  mongo: {
    username: ``,
    password: ``,
    dbName: ``,
    host: ``,
  },
  token: ``,
  host: 'localhost',
  jwtPublicKey: 'secretPublic',
  jwtPrivateKey: 'secretPrivate',
};
