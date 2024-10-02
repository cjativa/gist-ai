import { Router } from 'express';

import { IntentController } from '../controllers';

const IntentRouter = Router();

IntentRouter.post('/summarizer', IntentController.handleSummarize);
IntentRouter.post('/explainer', IntentController.handleExplain);
IntentRouter.post('/rephraser', IntentController.handleRephrase);
IntentRouter.post('/actioner', IntentController.handleActionPlan);

export { IntentRouter };
