import dotenv from 'dotenv';

const env = dotenv.config({ path: '.env' }).parsed || process.env;

export default ({
  app: {
    frontUrl: env.FRONT_URL || 'http://localhost:8080',
    domain: process.env.APP_URL || env.APP_URL || 'http://localhost',
    port: process.env.PORT || env.PORT || 3003,
    url: env.FRONT_URL || `http://localhost:${process.env.PORT || env.PORT || 3003}`,
    salt: env.SALT || '$2b$10$LJujhSUWlVyJf6JoSuVyQ.',
  },
  db: {
    username: env.DB_USER || 'root',
    password: env.DB_PASSWORD || 'root',
    database: env.DB_NAME || 'database_test',
    host: env.DB_HOST || '127.0.0.1',
    dialect: env.DB_DIALECT || 'mysql',
    operatorsAliases: false,
  },
  logging: {
    level: env.LOGGING_LEVEL || 'debug',
    sentryDSN: env.SENTRY_DSN || '',
  },
});
