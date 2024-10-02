import { Router } from 'express';
import { IntentRouter } from './intentRouter';

const ApiRouter = Router();

ApiRouter.use('/intent', IntentRouter);

export { ApiRouter };
