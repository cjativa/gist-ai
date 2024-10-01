import { Router } from 'express';

import { IntentController } from '../controllers';

const IntentRouter = Router();

IntentRouter.post('/summarize', IntentController.handleSummarize);
IntentRouter.post('/explain', IntentController.handleExplain);
IntentRouter.post('/rephrase', IntentController.handleRephrase);
IntentRouter.post('/actionPlan', IntentController.handleActionPlan);

export { IntentRouter };
