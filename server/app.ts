import express from 'express';
import bodyParser from 'body-parser';
// @ts-expect-error ignore type definition file
import cors from 'cors';

import { ApiRouter } from './api/routes';
import { EnvironmentConfig as Config } from './config';

const LOG_PREFIX = '[Application]';

const application = express();

// Configure our API router
application.use(express.urlencoded({ extended: true }));
application.use(bodyParser.json());
application.use('/api', ApiRouter);

// Enable CORS for all sites
// TODO - Allow only desired sites like localhost
application.use(cors());

// Configure the server start
application.listen(Config.port, () => {
  console.log(`${LOG_PREFIX} Server listening on port ${Config.port}`);
});

export { application };
