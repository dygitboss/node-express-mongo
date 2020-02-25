import dotenv from 'dotenv';

const env = dotenv.config({ path: '.env' }).parsed || process.env;

export default ({
  app: {
    frontUrl: env.FRONT_URL || 'http://localhost:8080',
    domain: process.env.APP_URL || env.APP_URL || 'http://localhost',
    port: process.env.PORT || env.PORT || 3003,
    url: env.FRONT_URL || `http://localhost:${process.env.PORT || env.PORT || 3003}`,
    salt: env.SALT || 'keyboard cat$$',
  },
  db: {
    url: env.DATABASE_URL || 'mongodb://localhost/test-node-app',
  },
  logging: {
    level: env.LOGGING_LEVEL || 'debug',
    sentryDSN: env.SENTRY_DSN || '',
  },
});
