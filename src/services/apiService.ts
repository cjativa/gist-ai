import { IntentTypes } from '../types';

type IntentInformation = {
  intentType: IntentTypes;
  content: string;
};

export class ApiService {
  /** Handles propagating an intent message with its payload to our server
   * @param - intentInformation - Input object containing the intent information to be sent to server
   */
  public static async sendIntentRequest(intentInformation: IntentInformation) {
    console.log(`Intent Information`, JSON.stringify(intentInformation));
  }
}
