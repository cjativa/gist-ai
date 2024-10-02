import express from 'express';

import { ApiRouter } from './api/routes';
import { Config } from './config';

const LOG_PREFIX = '[Application]';

const application = express();

// Configure our API router
application.use('/api', ApiRouter);

// Configure the server start
application.listen(Config.port, () => {
  console.log(`${LOG_PREFIX} Server listening on port ${Config.port}`);
});

export { application };
