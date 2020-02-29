import express from 'express';
import cors from 'cors';
import * as Sentry from '@sentry/node';
import bodyParser from 'body-parser';
import multer from 'multer';
import helmet from 'helmet';
import { wrap } from '@hapi/joi';

// split your internal and external deps with new line for good readability
import router from './router';
import config from './config';
import { errorStatusCodes } from './config/constants';
import createLogger from './services/createLogger';

export const appLogger = createLogger('app');
export const httpLogger = createLogger('http', 'magenta');

// Sentry initialize
Sentry.init({ dsn: config.logging.sentryDSN });

process.on('unhandledRejection', (error) => {
  appLogger.error(error);
  appLogger.debug('%o', error);
});

const initApp = () => {
  appLogger.info('⏳  Initializing app...');
  const app = express();

  // use helmet and cors middlewares as simple security
  app.use(helmet());
  app.use(cors({ credentials: true, origin: config.app.frontUrl }));

  // parse application/x-www-form-urlencoded and application/json content types
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
  app.use(bodyParser.json());

  // parse any multipart/form-data
  app.use(multer().any());

  // log all http requests
  app.use((req, res, next) => {
    httpLogger.info(`${req.method} ${req.url}`);
    next();
  });

  // set routers before error handler
  app.use('/api', router);

  // error handling
  app.use((err, req, res, next) => {
    appLogger.debug('%o', err);

    // capture server errors
    if (!err.status || err.status === 500 || err.statusCode === 500) {
      Sentry.captureException(err);
    }

    // handle default errors if they are wasn't thrown via boom
    if (errorStatusCodes[err.constructor]) {
      wrap(err, errorStatusCodes[err.constructor]);
    }

    // handle boom errors
    if (err.isBoom) {
      const boomError = err.output;
      return res
        .status(boomError.statusCode || 500)
        .json(Object.assign(
          boomError.payload,
          err.data ? { details: err.data } : null,
        ));
    }

    // handle server errors
    res.status(err.status || 500).json({
      statusCode: err.status || 500,
      error: err.name,
      message: err.message,
    });
  });

  // 404 route
  app.use((req, res) => {
    res.status(404).json({
      statusCode: 404,
      error: 'Not Found',
      message: 'No such route',
    });
  });

  return app;
};

const checkDB = async () => {
  appLogger.info('🔗 Checking DB connection...');
  const db = await import('./models').then((module) => module.sequelize);
  return db.sync();
};

if (!module.parent) { // Don't allow child process spawning
  checkDB()
    .then(() => {
      const app = initApp();
      app.listen(config.app.port, () => {
        appLogger.info(`🚀 App is ready for use. Port: ${config.app.port}; PID: ${process.pid}`);
      });
    })
    .catch(() => appLogger.error('❌  DB connection failed'));
}
