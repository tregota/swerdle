import PropTypes from 'prop-types';
import { ThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';

import darkTheme from '../styles/theme/darkTheme';
import lightTheme from '../styles/theme/lightTheme';
import '../styles/globals.css';

const SwerdleApp = ({ Component, pageProps }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  return (
    <ThemeProvider theme={prefersDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default SwerdleApp;

SwerdleApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};