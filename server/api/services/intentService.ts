import OpenAI from 'openai';

import { Config } from '../../config';
import { INTENT_SYSTEM_MESSAGES, IntentTypes } from './intentSystemMessages';

const openai = new OpenAI({
  organization: Config.openAi.organizationId,
  project: Config.openAi.projectId,
});

const LOG_PREFIX = `[IntentService]`;

export class IntentService {
  private static async performIntentRequest(
    intentType: IntentTypes,
    userIntentContent: string
  ) {
    const systemMessageContent = IntentService.getSystemMessage(intentType);
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemMessageContent },
        {
          role: 'user',
          content: userIntentContent,
        },
      ],
    });

    return response.choices[0];
  }

  /** Method for safely retrieving our defined system-message for this specific intent
   * It will throw an error if there does not exist a system-message for the intent type
   */
  private static getSystemMessage(intentType: IntentTypes): string {
    const systemMessageForIntent = INTENT_SYSTEM_MESSAGES[intentType];

    // It's an unexpected scenario if we retrieve an undefined system message
    if (systemMessageForIntent === undefined) {
      throw new Error(
        `${LOG_PREFIX} Unexpected system message error for intent type "${intentType}"`
      );
    }

    // Join the system message object into a single sentence
    const systemMessageText =
      systemMessageForIntent.description +
      '\n' +
      systemMessageForIntent.steps
        .map((step, index) => `Step ${index + 1}. ${step.stepContent}`)
        .join('\n\n');

    return systemMessageText;
  }

  public static async performSummarization(content: string) {
    const response = await this.performIntentRequest(
      IntentTypes.summarizer,
      content
    );
  }

  public static async performExplanation(content: string) {
    const response = await this.performIntentRequest(
      IntentTypes.explainer,
      content
    );
  }
}
