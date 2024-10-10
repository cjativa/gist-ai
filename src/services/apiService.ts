import axios from 'axios';
import { IntentTypes } from '../types';

type IntentRequest = {
  intentTypeId: IntentTypes;
  intentContent: string;
};

// TODO - Consolidate with the type `StructureIntentResponse` from backend IntentService
export type StructuredIntentResponse = {
  title: string;
  keyPoints: {
    title: string;
    detailSentences: string[];
  }[];
};

export class ApiService {
  /** Handles propagating an intent message with its payload to our server
   * @param - intentInformation - Input object containing the intent information to be sent to server
   */
  public static async sendIntentRequest(
    intentInformation: IntentRequest
  ): Promise<StructuredIntentResponse> {
    const response = await axios<StructuredIntentResponse>({
      method: 'POST',
      baseURL: '/api/intent',
      // baseURL: 'http://localhost:4004/api/intent',
      url: intentInformation.intentTypeId.toString(),
      data: {
        content: intentInformation.intentContent,
      },
    });

    return response.data;
  }
}
