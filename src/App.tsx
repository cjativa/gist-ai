import React from 'react';
import {
  styled,
  TextField,
  Box,
  Typography,
  Button,
  ButtonGroup,
  type BoxProps,
} from '@mui/material';

import logo from './logo.svg';

import { IntentMessage, IntentTypes } from './types';

const IntentInformationMap: {
  [key in keyof typeof IntentTypes]: {
    actionOperationLabel: string;
    actionButtonLabel: string;
  };
} = {
  [IntentTypes.summarizer]: {
    actionOperationLabel: 'Summarizing this for you...',
    actionButtonLabel: 'Summarize it',
  },
  [IntentTypes.explainer]: {
    actionOperationLabel: 'Explaining it better for you...',
    actionButtonLabel: 'Explain it',
  },
  [IntentTypes.actioner]: {
    actionOperationLabel:
      'Coming up with an action plan for you based off this...',
    actionButtonLabel: 'Build an action plan',
  },
  [IntentTypes.rephraser]: {
    actionOperationLabel: 'Rephrasing this in a way you might say it...',
    actionButtonLabel: 'Rephrase this',
  },
};

const StyledAppContainer = styled(Box)<BoxProps>(({ theme }) => ({
  width: '40em',
  height: '40em',
  padding: '1em',
}));

const StyledHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

const StyledIntentContainer = styled(Box)(({ theme }) => ({
  marginTop: '1em',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  rowGap: '1em',
}));

enum IntentSources {
  ContextMenu = 'ContextMenu',
  ExtensionEntrypoint = 'ExtensionEntrypoint',
}

const RenderForMessageIntent = () => {};

const RenderForPopupIntent = () => {};

export function Application() {
  const [intentConent, setIntentContent] = React.useState('');
  const [intentId, setIntentId] = React.useState<null | IntentTypes>(null);
  const [intentSource, setIntentSource] = React.useState<null | IntentSources>(
    null
  );

  const intentInformation = intentId ? IntentInformationMap[intentId] : null;

  function handleMessageFromBackground(
    message: IntentMessage,
    sender: chrome.runtime.MessageSender
  ): boolean {
    setIntentSource(IntentSources.ContextMenu);
    setIntentId(message.intentTypeId);
    setIntentContent(message.content);

    return true;
  }

  /** Set-up the runtime message handler once */
  React.useEffect(() => {
    // Configure our listener from our content script to the main application
    if (chrome?.runtime) {
      chrome.runtime.onMessage.addListener(handleMessageFromBackground);
    }

    // Otherwise, the extension application was opened directly from the extension
    // toolbar entrypoint. Let's allow the end-user to add some input text and select their intent
    else {
      setIntentSource(IntentSources.ExtensionEntrypoint);
    }
  }, []);

  return (
    <StyledAppContainer>
      <div className="App">
        <StyledHeader>
          <img src={logo} className="App-logo" alt="logo" />
          <Typography variant="h5" component="h1">
            Welcome to Gist AI!
          </Typography>
          <Typography variant="subtitle1">
            Your go-to tool for quick content help using Artifical Intelligence
          </Typography>
        </StyledHeader>

        {/** When the intent source is the extension entrypoint itself, we'll render the input field
         * and the button group for the end-user to make a selection of intent
         */}
        {intentSource === IntentSources.ExtensionEntrypoint ? (
          <StyledIntentContainer>
            <Typography variant="body2">
              Choose one of the actions below
            </Typography>

            <ButtonGroup variant="contained" aria-label="Gist action buttons">
              {Object.entries(IntentInformationMap).map(
                ([intentId, intentItem]) => {
                  return (
                    <Button key={intentId}>
                      {intentItem.actionButtonLabel}
                    </Button>
                  );
                }
              )}
            </ButtonGroup>

            <TextField
              id="outlined-read-only-input"
              label="Content"
              value={intentConent}
              multiline
              fullWidth
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />
          </StyledIntentContainer>
        ) : null}

        {/** Once we have a desired intent and intent content, we can render the below */}
        {intentInformation ? (
          <StyledIntentContainer>
            <p>Current Intent</p>
            <p>{intentInformation.actionOperationLabel}</p>

            <p>Content being used</p>
            <TextField
              id="outlined-read-only-input"
              label="Content"
              value={intentConent}
              multiline
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />
          </StyledIntentContainer>
        ) : null}
      </div>
    </StyledAppContainer>
  );
}
