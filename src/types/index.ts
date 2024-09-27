export enum IntentTypes {
  summarizer = 'summarizer',
  explainer = 'explainer',
  actioner = 'actioner',
  rephraser = 'rephraser',
}

export type IntentMessage = {
  intentTypeId: IntentTypes;
  content: string;
};
