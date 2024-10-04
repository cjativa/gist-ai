import { createTheme } from '@mui/material/styles';

// A custom theme for this app
export const MuiTheme = createTheme({
  typography: {
    button: {
      textTransform: 'none',
    },
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#00a925',
    },
    secondary: {
      main: '#1eabd9',
      contrastText: 'rgba(255,255,255,0.87)',
    },
  },
});
