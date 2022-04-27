/* eslint-disable no-alert */
/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector';
import {
  URI_AVAILABLE,
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect
} from '@web3-react/walletconnect-connector';
import { formatEther } from '@ethersproject/units';
import CircularProgress from '@mui/material/CircularProgress';

import {
  network,
  walletconnect,
  connectorsByName
} from '../connectors/connectors';
import { useEagerConnect, useInactiveListener } from '../hooks/connector';

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

const MyComponent = () => {
  const context = useWeb3React();
  const {
    connector,
    library,
    chainId,
    account,
    activate,
    deactivate,
    active,
    error
  } = context;

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = useState();

  useEffect(() => {
    console.log('running');
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  useEffect(() => {}, [connector]);

  // handle logic to eagerly connect to the injected ethereum provider,
  // if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected
  // ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  // fetch eth balance of the connected account
  const [ethBalance, setEthBalance] = useState();
  useEffect(() => {
    console.log('running');
    if (library && account) {
      let stale = false;

      library
        .getBalance(account)
        .then(balance => {
          if (!stale) {
            setEthBalance(balance);
          }
        })
        .catch(() => {
          if (!stale) {
            setEthBalance(null);
          }
        });

      return () => {
        stale = true;
        setEthBalance(undefined);
      };
    }
    return undefined;
  }, [library, account, chainId]);

  // log the walletconnect URI
  useEffect(() => {
    console.log('running');
    const logURI = uri => {
      console.log('WalletConnect URI', uri);
    };
    walletconnect.on(URI_AVAILABLE, logURI);

    return () => {
      walletconnect.off(URI_AVAILABLE, logURI);
    };
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <div className="flex justify-between align-start">
        <div>
          <span>Chain Id</span>
          <span>{chainId === undefined ? '...' : chainId}</span>
        </div>

        <div>
          <span>Network Status</span>
          <span style={{ margin: '0', textAlign: 'right' }}>
            {active ? '🟢' : error ? '🔴' : '🟠'}
          </span>
        </div>

        <div>
          <span>Account</span>
          <span>
            {account === undefined
              ? '...'
              : account === null
              ? 'None'
              : `${account.substring(0, 6)}...${account.substring(
                  account.length - 4
                )}`}
          </span>
        </div>

        <div>
          <span>Balance</span>
          <span>
            {ethBalance === undefined
              ? '...'
              : ethBalance === null
              ? 'Error'
              : `Ξ${parseFloat(formatEther(ethBalance)).toPrecision(4)}`}
          </span>
        </div>
      </div>
      <hr style={{ margin: '2rem' }} />
      <div
        style={{
          display: 'grid',
          gridGap: '1rem',
          gridTemplateColumns: '1fr 1fr',
          maxWidth: '20rem',
          margin: 'auto'
        }}
      >
        {Object.keys(connectorsByName).map(name => {
          const currentConnector = connectorsByName[name];
          const activating = currentConnector === activatingConnector;
          const connected = currentConnector === connector;
          const disabled =
            !triedEager || !!activatingConnector || connected || !!error;

          return (
            <button
              type="button"
              style={{
                height: '3rem',
                borderRadius: '1rem',
                borderColor: activating
                  ? 'orange'
                  : connected
                  ? 'green'
                  : 'unset',
                cursor: disabled ? 'unset' : 'pointer',
                position: 'relative'
              }}
              disabled={disabled}
              key={name}
              onClick={() => {
                setActivatingConnector(currentConnector);
                activate(connectorsByName[name]);
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'black',
                  margin: '0 0 0 1rem'
                }}
              >
                {activating && <CircularProgress />}
                {connected && (
                  <span role="img" aria-label="check">
                    ✅
                  </span>
                )}
              </div>
              {name}
            </button>
          );
        })}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {(active || error) && (
          <button
            type="button"
            style={{
              height: '3rem',
              marginTop: '2rem',
              borderRadius: '1rem',
              borderColor: 'red',
              cursor: 'pointer'
            }}
            onClick={() => {
              deactivate();
            }}
          >
            Deactivate
          </button>
        )}

        {!!error && (
          <h4 style={{ marginTop: '1rem', marginBottom: '0' }}>
            {getErrorMessage(error)}
          </h4>
        )}
      </div>

      <hr style={{ margin: '2rem' }} />

      <div
        style={{
          display: 'grid',
          gridGap: '1rem',
          gridTemplateColumns: 'fit-content',
          maxWidth: '20rem',
          margin: 'auto'
        }}
      >
        {!!(library && account) && (
          <button
            type="button"
            style={{
              height: '3rem',
              borderRadius: '1rem',
              cursor: 'pointer'
            }}
            onClick={() => {
              library
                .getSigner(account)
                .signMessage('👋')
                .then(signature => {
                  window.alert(`Success!\n\n${signature}`);
                })
                .catch(err => {
                  window.alert(
                    `Failure!${err && err.message ? `\n\n${err.message}` : ''}`
                  );
                });
            }}
          >
            Sign Message
          </button>
        )}
        {!!(connector === network && chainId) && (
          <button
            type="button"
            style={{
              height: '3rem',
              borderRadius: '1rem',
              cursor: 'pointer'
            }}
            onClick={() => {
              connector.changeChainId(chainId === 1 ? 4 : 1);
            }}
          >
            Switch Networks
          </button>
        )}
        {connector === walletconnect && (
          <button
            type="button"
            style={{
              height: '3rem',
              borderRadius: '1rem',
              cursor: 'pointer'
            }}
            onClick={() => {
              connector.close();
            }}
          >
            Kill WalletConnect Session
          </button>
        )}
      </div>
    </div>
  );
};

export default MyComponent;
