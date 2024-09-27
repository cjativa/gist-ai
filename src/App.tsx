import React from 'react';
import {
  TextField,
  Box,
  styled,
  Typography,
  type BoxProps,
} from '@mui/material';

import logo from './logo.svg';

import { IntentMessage, IntentTypes } from './types';

const IntentInformationMap: {
  [key in keyof typeof IntentTypes]: {
    label: string;
  };
} = {
  [IntentTypes.summarizer]: {
    label: 'Summarizing this for you...',
  },
  [IntentTypes.explainer]: {
    label: 'Explaining it better for you...',
  },
  [IntentTypes.actioner]: {
    label: 'Coming up with an action plan for you based off this...',
  },
  [IntentTypes.rephraser]: {
    label: 'Rephrasing this in a way you might say it...',
  },
};

const StyledAppContainer = styled(Box)<BoxProps>(({ theme }) => ({
  width: '40em',
  height: '40em',
}));

const StyledHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

export function Application() {
  const [intentConent, setIntentContent] = React.useState('');
  const [intentId, setIntentId] = React.useState<null | IntentTypes>(null);

  const intentInformation = intentId ? IntentInformationMap[intentId] : null;

  function handleMessageFromBackground(
    message: IntentMessage,
    sender: chrome.runtime.MessageSender
  ): boolean {
    setIntentId(message.intentTypeId);
    setIntentContent(message.content);

    return true;
  }

  /** Set-up the runtime message handler once */
  React.useEffect(() => {
    /** Configure our listener from our content script to the main application */
    chrome?.runtime?.onMessage.addListener(handleMessageFromBackground);
  }, []);

  return (
    <StyledAppContainer height={'30em'} width={'30em'}>
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

        {intentInformation ? (
          <div>
            <p>Current Intent</p>
            <p>{intentInformation.label}</p>

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
          </div>
        ) : null}
      </div>
    </StyledAppContainer>
  );
}
