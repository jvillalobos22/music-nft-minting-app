/* eslint-disable @next/next/no-img-element */
/* eslint-disable no-else-return */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Box, Button, Modal } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import CircularProgress from '@mui/material/CircularProgress';
import MetamaskIcon from '../../assets/images/metamask.png';
import CoinbaseIcon from '../../assets/images/coinbaseWalletIcon.svg';
import WalletConnectIcon from '../../assets/images/walletConnectIcon.svg';
import EthereumIcon from '../../assets/images/ethereum-logo.png';

import { connectorsByName } from '../../connectors/connectors';

const ProviderButton = styled(Button)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconWrapper = styled.div`
  margin-right: 8px;
  img {
    font-size: 24px;
    max-width: 24px;
  }
`;

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

const getConnectorName = name => {
  if (name === 'Injected') {
    return 'Metamask';
  } else if (name === 'WalletLink') {
    return 'Coinbase';
  }

  return name;
};

const getConnectorIcon = name => {
  if (name === 'Injected') {
    return <img src={MetamaskIcon.src} alt="metamask wallet icon" />;
  } else if (name === 'WalletLink') {
    return <img src={CoinbaseIcon.src} alt="coinbase wallet icon" />;
  } else if (name === 'WalletConnect') {
    return <img src={WalletConnectIcon.src} alt="wallet connect icon" />;
  }

  return <img src={EthereumIcon.src} alt="eth network icon" />;
};

const WalletModal = ({
  className,
  activatingConnector,
  setActivatingConnector,
  triedEager
}) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const context = useWeb3React();
  const { connector, activate, error } = context;

  console.log('MetamaskIcon', MetamaskIcon);

  return (
    <>
      <Button
        size="small"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleOpen}
        className={`${className} mr-2`}
        variant="outlined"
        color="primary"
      >
        Connect Wallet
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {Object.keys(connectorsByName).map(name => {
            const currentConnector = connectorsByName[name];
            const activating = currentConnector === activatingConnector;
            const connected = currentConnector === connector;
            const disabled =
              !triedEager || !!activatingConnector || connected || !!error;
            const connectorName = getConnectorName(name);
            const connectorIcon = getConnectorIcon(name);
            return (
              <ProviderButton
                key={name}
                type="button"
                size="large"
                disabled={disabled}
                onClick={() => {
                  setActivatingConnector(currentConnector);
                  activate(connectorsByName[name]);
                }}
              >
                <div>
                  {activating && <CircularProgress />}
                  {connected && (
                    <span role="img" aria-label="check">
                      ✅
                    </span>
                  )}
                  {connectorIcon && <IconWrapper>{connectorIcon}</IconWrapper>}
                </div>
                {connectorName}
              </ProviderButton>
            );
          })}
        </Box>
      </Modal>
    </>
  );
};

WalletModal.propTypes = {
  className: PropTypes.string,
  activatingConnector: PropTypes.object.isRequired,
  triedEager: PropTypes.bool.isRequired,
  setActivatingConnector: PropTypes.func.isRequired
};

WalletModal.defaultProps = {
  className: ''
};

export default WalletModal;
