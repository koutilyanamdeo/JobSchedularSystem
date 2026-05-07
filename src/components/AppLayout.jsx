import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiTheme from './MuiTheme.js';

export default function AppLayout({ children }) {
  return (
    <ThemeProvider theme={MuiTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

