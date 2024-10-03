export enum IntentTypes {
  summarizer = 'summarizer',
  explainer = 'explainer',
  actioner = 'actioner',
  rephraser = 'rephraser',
}

type SystemMessageStructure = {
  description: string;
  steps: Array<{ stepContent: string }>;
};

const SUMMARIZE_SYSTEM_MESSAGE: SystemMessageStructure = {
  description: `
  When I ask for a summary of the content I provide to you, you will respond with a summary of the content.
  Use the following step-by-step instructions to generate the summary of the content
  `,
  steps: [
    {
      stepContent:
        'Provide a title for the summary. The title should give the reader a good idea of the overall topic of the content that was provided',
    },
    {
      stepContent:
        'Identify and provide key points in the content. The key point should be straightforward but informative sentence. Prefix each key point with the text "Key Point #<INCREMENTED_NUMBER>" where the text "<INCREMENTED_NUMBER>" as a number that increases from the number 1 for each key point identified.',
    },
    {
      stepContent: `For each key point, please provide 2-3 additional sentences that expand further on the subject of the key point. Reference the information provided in the content for the details to include in these sentences.`,
    },
  ],
};

const ACTION_PLAN_SYSTEM_MESSAGE: SystemMessageStructure = {
  description: `
  When provide you with content, you will provide an explanation of the content. You will respond with a more simpler and straightforward explanation of the content and not a complex overly verbose explanation of the content.
  Use the following step-by-step instructions to generate the more simpler and straightforward explanation of the content.
  `,
  steps: [
    {
      stepContent:
        'Provide a title for the explanation of the content. The title should give the reader a good idea of the overall topic of the content that was provided but the title should be rather simple and use an analogy when possible.',
    },
    {
      stepContent: `Identify and provide key points in the content. The key point should be straightforward but informative sentence. Prefix each key point with the text "Key Point #<INCREMENTED_NUMBER>" where the text "<INCREMENTED_NUMBER>" as a number that increases from the number 1 for each key point identified. Use an analogy when it makes sense in the key point, but do not use it too much`,
    },
    {
      stepContent: `For each key point, please provide 1-2 sentences that expand further on the subject of the key point. Reference the information provided in the content for the details to include in these sentences. The sentences you generate should use more simpler day-to-day terms in the explanation, much like explaining it to a middle schooler`,
    },
  ],
};

const REPHRASE_SYSTEM_MESSAGE: SystemMessageStructure = {
  description: `
  When provide you with content, you will provide an explanation of the content. You will respond with a more simpler and straightforward explanation of the content and not a complex overly verbose explanation of the content.
  Use the following step-by-step instructions to generate the more simpler and straightforward explanation of the content.
  `,
  steps: [
    {
      stepContent:
        'Provide a title for the explanation of the content. The title should give the reader a good idea of the overall topic of the content that was provided but the title should be rather simple and use an analogy when possible.',
    },
    {
      stepContent: `Identify and provide key points in the content. The key point should be straightforward but informative sentence. Prefix each key point with the text "Key Point #<INCREMENTED_NUMBER>" where the text "<INCREMENTED_NUMBER>" as a number that increases from the number 1 for each key point identified. Use an analogy when it makes sense in the key point, but do not use it too much`,
    },
    {
      stepContent: `For each key point, please provide 1-2 sentences that expand further on the subject of the key point. Reference the information provided in the content for the details to include in these sentences. The sentences you generate should use more simpler day-to-day terms in the explanation, much like explaining it to a middle schooler`,
    },
  ],
};

const EXPLAIN_SYSTEM_MESSAGE: SystemMessageStructure = {
  description: `
  When provide you with content, you will provide an explanation of the content. You will respond with a more simpler and straightforward explanation of the content and not a complex overly verbose explanation of the content.
  Use the following step-by-step instructions to generate the more simpler and straightforward explanation of the content.
  `,
  steps: [
    {
      stepContent:
        'Provide a title for the explanation of the content. The title should give the reader a good idea of the overall topic of the content that was provided but the title should be rather simple and use an analogy when possible.',
    },
    {
      stepContent: `Identify the key points in the content. The key point should be straightforward but informative title. Use an analogy when it makes sense in the key point title, but do not use it too much.
      
      Prefix each key point with the text "Key Point" with the number that key point is, beginning from the number 0.`,
    },
    {
      stepContent: `For each key point, please provide 1-2 sentences that explain the subject of the key point in simpler more day-to-day common terms. The sentences you generate should be much like explaining it to a middle schooler. 
      
      You do not need to prefix the explanation with anything.`,
    },
  ],
};

export const INTENT_SYSTEM_MESSAGES: {
  [key in keyof typeof IntentTypes]: SystemMessageStructure;
} = {
  [IntentTypes.explainer]: EXPLAIN_SYSTEM_MESSAGE,
  [IntentTypes.summarizer]: SUMMARIZE_SYSTEM_MESSAGE,
  [IntentTypes.rephraser]: REPHRASE_SYSTEM_MESSAGE,
  [IntentTypes.actioner]: ACTION_PLAN_SYSTEM_MESSAGE,
};
