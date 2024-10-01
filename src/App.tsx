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

const StyledAppContainer = styled(Box)<BoxProps>(({}) => ({
  width: '45em',
  height: '45em',
  padding: '1em',
}));

const StyledHeader = styled(Box)(({}) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

const StyledIntentContainer = styled(Box)(({}) => ({
  marginTop: '.5em',

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

export function Application() {
  const [intentContent, setIntentContent] = React.useState<string>('');
  const [intentId, setIntentId] = React.useState<null | IntentTypes>(null);
  const [intentSource, setIntentSource] = React.useState<IntentSources>(
    IntentSources.ExtensionEntrypoint
  );

  const intentInformation = intentId ? IntentInformationMap[intentId] : null;

  function handleMessageFromBackground(
    message: IntentMessage,
    sender: chrome.runtime.MessageSender
  ): boolean {
    setIntentSource(IntentSources.ContextMenu);
    setIntentId(message.intentTypeId);
    setIntentContent(message.content);

    return false;
  }

  // Configure our listener from our content script to the main application
  // TODO - Figure out how to move this into `React.useEffect`
  chrome?.runtime?.onMessage.addListener(handleMessageFromBackground);

  /** Set-up the runtime message handler once */
  React.useEffect(() => {
    // Clean up the listener when the component unmounts
    return () =>
      chrome?.runtime?.onMessage.removeListener(handleMessageFromBackground);
  }, []);

  /** Handles the on-click event from our intent buttons */
  function onHandleIntentButtonClick(intentId: IntentTypes) {
    setIntentId(intentId);
  }

  /** Handles updating state with the input typed into the content text field */
  function onHandleContentInputChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setIntentContent(event.target.value);
  }

  /** Handles executing the API request to the backend for process the input content */
  function performIntentActionRequest() {}

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

        <StyledIntentContainer>
          {/** When the intent source is the extension entrypoint itself, we'll render the input field
           * and the button group for the end-user to make a selection of intent
           */}
          {intentSource === IntentSources.ExtensionEntrypoint ? (
            <StyledIntentContainer>
              <Typography variant="body2">
                Choose one of the actions below
              </Typography>

              {/** Render our available intent actions */}
              <ButtonGroup variant="contained" aria-label="Gist action buttons">
                {Object.entries(IntentInformationMap).map(
                  ([intentId, intentItem]) => {
                    return (
                      <Button
                        key={intentId}
                        onClick={() =>
                          onHandleIntentButtonClick(intentId as IntentTypes)
                        }
                      >
                        {intentItem.actionButtonLabel}
                      </Button>
                    );
                  }
                )}
              </ButtonGroup>
            </StyledIntentContainer>
          ) : null}

          <TextField
            id="outlined-read-only-input"
            label="Content"
            value={intentContent}
            multiline
            fullWidth
            placeholder={'Enter a bit of content to perform actions on it'}
            rows={3}
            slotProps={{
              input: {
                readOnly: false,
              },
            }}
            onChange={onHandleContentInputChange}
          />
        </StyledIntentContainer>
      </div>
    </StyledAppContainer>
  );
}
