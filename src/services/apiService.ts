import axios from 'axios';
import { IntentTypes } from '../types';

type IntentRequest = {
  intentTypeId: IntentTypes;
  intentContent: string;
};

export class ApiService {
  /** Handles propagating an intent message with its payload to our server
   * @param - intentInformation - Input object containing the intent information to be sent to server
   */
  public static async sendIntentRequest(
    intentInformation: IntentRequest
  ): Promise<string> {
    const response = await axios({
      method: 'POST',
      baseURL: '/api/intent',
      url: intentInformation.intentTypeId.toString(),
      data: {
        content: intentInformation.intentContent,
      },
    });

    return response.data;
  }
}
