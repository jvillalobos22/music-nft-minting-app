/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-props-no-spreading */

import { Web3ReactProvider } from '@web3-react/core';
import { PropTypes } from 'prop-types';
import { Web3Provider } from '@ethersproject/providers';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import '../styles/globals.css';
import { AudioPlayerProvider } from '../hooks/audio-player-context';

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 8000;
  return library;
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#01ff95'
    }
  },
  typography: {
    fontFamily: 'Anonymous Pro, Raleway, Arial, sans-serif, monospace'
  }
});

const MyApp = ({ Component, pageProps }) => (
  <ThemeProvider theme={darkTheme}>
    <Web3ReactProvider getLibrary={getLibrary}>
      <AudioPlayerProvider>
        <Component {...pageProps} />
      </AudioPlayerProvider>
    </Web3ReactProvider>
  </ThemeProvider>
);

MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired
};
MyApp.defaultProps = {};

export default MyApp;
