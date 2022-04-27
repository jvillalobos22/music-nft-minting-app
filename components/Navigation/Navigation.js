import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import Link from 'next/link';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';

import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector';
import {
  URI_AVAILABLE,
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect
} from '@web3-react/walletconnect-connector';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';
// import MenuIcon from '@mui/icons-material/Menu';
import { useEagerConnect, useInactiveListener } from '../../hooks/connector';

import { walletconnect, connectorsByName } from '../../connectors/connectors';
import NetworkSelector from './NetworkSelector';
import AccountMenu from './AccountMenu';

function getErrorMessage(error) {
  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.';
  }
  if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network.";
  }
  if (
    error instanceof UserRejectedRequestErrorInjected ||
    error instanceof UserRejectedRequestErrorWalletConnect
  ) {
    return 'Please authorize this website to access your Ethereum account.';
  }
  console.error(error);
  return 'An unknown error occurred. Check the console for more details.';
}

const Navigation = () => {
  const context = useWeb3React();
  const { connector, error } = context;

  const [currentConnectorName, setCurrentConnectorName] = useState('');
  const [activatingConnector, setActivatingConnector] = useState();

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  // handle logic to eagerly connect to the injected ethereum provider,
  // if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected
  // ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  if (error) console.log('error', getErrorMessage(error));

  // log the walletconnect URI
  useEffect(() => {
    const logURI = uri => {
      console.log('WalletConnect URI', uri);
    };
    walletconnect.on(URI_AVAILABLE, logURI);

    return () => {
      walletconnect.off(URI_AVAILABLE, logURI);
    };
  }, []);

  useEffect(() => {
    Object.keys(connectorsByName).forEach(name => {
      const currentConnector = connectorsByName[name];
      const connected = currentConnector === connector;

      if (connected) {
        setCurrentConnectorName(name);
      }
    });
  }, [connector]);

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 0 }}>
            Minted Music
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'flex' },
              justifyContent: 'flex-start'
            }}
          >
            <div className="flex ml-8">
              <Typography variant="body2" color="primary" className="mr-6">
                <Link href="/" passHref>
                  Listen
                </Link>
              </Typography>
              <Typography variant="body2" color="primary" className="mr-6">
                <Link href="/create-track">Create Track NFT</Link>
              </Typography>
              <Typography variant="body2" color="primary" className="mr-6">
                <Link href="/my-tracks">My Tracks</Link>
              </Typography>
              <Typography variant="body2" color="primary" className="">
                <Link href="/sample-page">Wallet Sample</Link>
              </Typography>
            </div>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box
            sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}
          >
            <AccountMenu
              className="mr-4"
              currentConnectorName={currentConnectorName}
              activatingConnector={activatingConnector}
              setActivatingConnector={setActivatingConnector}
              triedEager={triedEager}
            />
            <NetworkSelector />
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  );
};

Navigation.propTypes = {};

Navigation.defaultProps = {};

export default Navigation;
