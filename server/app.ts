import express from 'express';
import bodyParser from 'body-parser';

import { ApiRouter } from './api/routes';
import { Config } from './config';

const LOG_PREFIX = '[Application]';

const application = express();

// Configure our API router
application.use(express.urlencoded({ extended: true }));
application.use(bodyParser.json());
application.use('/api', ApiRouter);

// Configure the server start
application.listen(Config.port, () => {
  console.log(`${LOG_PREFIX} Server listening on port ${Config.port}`);
});

export { application };
