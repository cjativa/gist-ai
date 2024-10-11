import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

import * as Config from '../../config';
import { INTENT_SYSTEM_MESSAGES, IntentTypes } from './intentSystemMessages';
import { SummarizationResponse } from './intentServiceFixtureResponses';

const openai = new OpenAI({
  organization: Config.EnvironmentConfig.openAi.organizationId,
  project: Config.EnvironmentConfig.openAi.projectId,
});

const LOG_PREFIX = `[IntentService]`;

const IntentResponseSchema = z.object({
  title: z.string(),
  keyPoints: z.array(
    z.object({
      title: z.string(),
      detailSentences: z.array(z.string()),
    })
  ),
});
type StructuredIntentResponse = z.infer<typeof IntentResponseSchema>;

export class IntentService {
  /**
   * Handles performing API request to OpenAI for processing the provided content
   * @param intentType - The intent type for which to make the request
   * @param userIntentContent - The content that needs to be processed using the intent type
   */
  private static async performIntentRequest(
    intentType: IntentTypes,
    userIntentContent: string
  ): Promise<{
    pureContent: string;
    parsedContent: StructuredIntentResponse;
  }> {
    const systemMessageContent = IntentService.getSystemMessage(intentType);
    const response = await openai.beta.chat.completions.parse({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemMessageContent },
        {
          role: 'user',
          content: userIntentContent,
        },
      ],
      response_format: zodResponseFormat(
        IntentResponseSchema,
        'intentResponse'
      ),
    });

    // Get the pure content and parsed content
    const pureContent = response.choices[0].message.content || '';
    const parsedContent = response.choices[0].message.parsed;

    // Handle the structured response content being nullish
    if (parsedContent === null) {
      throw new Error(
        `${LOG_PREFIX} Could not properly structure the intent response content`
      );
    }

    return {
      pureContent,
      parsedContent,
    };
  }

  /** Method for safely retrieving our defined system-message for this specific intent
   * It will throw an error if there does not exist a system-message for the intent type
   * @param intentType - The intent type for which to generate the system message
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

  public static async performSummarization(
    content: string
  ): Promise<StructuredIntentResponse> {
    // return SummarizationResponse;

    const response = await this.performIntentRequest(
      IntentTypes.summarizer,
      content
    );

    return response.parsedContent;
  }

  public static async performExplanation(content: string) {
    const response = await this.performIntentRequest(
      IntentTypes.explainer,
      content
    );
  }
}
