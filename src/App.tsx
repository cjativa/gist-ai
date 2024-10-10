import React from 'react';
import {
  styled,
  TextField,
  Box,
  Typography,
  Button,
  ButtonGroup,
  CircularProgress,
  Paper,
  Card,
  CardContent,
  type BoxProps,
} from '@mui/material';

import logo from './logo.svg';
import { IntentMessage, IntentTypes } from './types';
import { ApiService, StructuredIntentResponse } from './services';

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

const StyledAppContainer = styled(Paper)<BoxProps>(({}) => ({
  minWidth: '45em',
  minHeight: '45em',
  backgroundColor: 'white',
  padding: '1em',
}));

const StyledAppBackground = styled(Box)<BoxProps>(({}) => ({
  padding: '2em',
  backgroundColor: '#96d396',
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
const StyledLoadingCircle = styled(CircularProgress)(({}) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  marginTop: '-12px',
  marginLeft: '-12px',

  height: '24px',
  width: '24px',
}));
const StyledContentContainer = styled(Box)(({}) => ({
  display: 'flex',
  position: 'relative',
  width: '100%',
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
  const [intentInProgress, setIntentInProgress] = React.useState(false);
  const [intentResponse, setIntentResponse] = React.useState<
    | {
        intentContent: StructuredIntentResponse;
        intentSuccess: true;
      }
    | { intentContent: null; intentSuccess: false }
    | null
  >(null);

  const intentInformation = intentId ? IntentInformationMap[intentId] : null;

  function handleMessageFromBackground(
    message: IntentMessage,
    sender: chrome.runtime.MessageSender
  ): boolean {
    setIntentSource(IntentSources.ContextMenu);
    setIntentId(message.intentTypeId);
    setIntentContent(message.content);

    // When we're handling the message from the background context menu action
    // we'll want to fire the intent action request as soon as we can
    performIntentRequest(message.intentTypeId);

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
  async function onHandleIntentButtonClick(intentId: IntentTypes) {
    setIntentId(intentId);
    performIntentRequest(intentId);
  }

  /** Handles updating state with the input typed into the content text field */
  function onHandleContentInputChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setIntentContent(event.target.value);
  }

  /** Handles encapsulating the logic for triggering the intent request */
  async function performIntentRequest(intentId: IntentTypes) {
    setIntentInProgress(true);

    // Perform the desired intent action
    try {
      const response = await ApiService.sendIntentRequest({
        intentTypeId: intentId,
        intentContent,
      });
      setIntentResponse({
        intentContent: response,
        intentSuccess: true,
      });
    } catch (error) {
      console.error(
        `[Application] Encountered error performing intent request`
      );
      setIntentResponse({
        intentContent: null,
        intentSuccess: false,
      });
    }

    // Regardless, end the request
    setIntentInProgress(false);
  }

  return (
    <StyledAppBackground>
      <StyledAppContainer>
        <StyledHeader>
          <img
            src={logo}
            className="App-logo"
            alt="logo"
            height={256}
            width={256}
          />
          <Typography variant="h5" component="h1">
            Welcome to Gist AI!
          </Typography>
          <Typography variant="subtitle1">
            Your go-to tool for quick content help using Artifical Intelligence
          </Typography>
        </StyledHeader>

        <StyledIntentContainer>
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

          {/** Text field with the intent content. We'll show a loading animation as the request is in-progress */}
          <StyledContentContainer>
            <TextField
              id="outlined-read-only-input"
              label="Content"
              value={intentContent}
              multiline
              fullWidth
              placeholder={'Enter a bit of content to perform actions on it'}
              minRows={3}
              maxRows={10}
              slotProps={{
                input: {
                  readOnly: intentInProgress,
                },
              }}
              disabled={intentInProgress}
              onChange={onHandleContentInputChange}
            />

            {/** Display the loading animation while request in progress */}
            {intentInProgress ? <StyledLoadingCircle /> : null}
          </StyledContentContainer>

          {/** Display the intent response when available */}
          {intentResponse?.intentSuccess ? (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5" fontWeight={'bolder'} color="#007800">
                  {intentResponse.intentContent.title}
                </Typography>
                <br />
                {intentResponse.intentContent.keyPoints.map((keyPoint) => {
                  return (
                    <div>
                      <Typography variant="h6" color="#0084a9">
                        {keyPoint.title}
                      </Typography>
                      <Typography variant="body2">
                        {keyPoint.detailSentences.join(' ')}
                      </Typography>
                      <br />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ) : null}
        </StyledIntentContainer>
      </StyledAppContainer>
    </StyledAppBackground>
  );
}
