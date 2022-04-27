/* eslint-disable react/forbid-prop-types */
/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Box, Button, Modal } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import CircularProgress from '@mui/material/CircularProgress';

import { connectorsByName } from '../../connectors/connectors';

const ProviderButton = styled(Button)`
  width: 100%;
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
                </div>
                {name}
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
