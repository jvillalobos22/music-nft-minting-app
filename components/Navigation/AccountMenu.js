/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { useWeb3React } from '@web3-react/core';
import { Button, Chip, Divider, Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import styled from 'styled-components';
import { CHAIN_IDS_TO_DISPLAY_NAMES } from '../../constants/chains';
import NetworkBalanceIndicator from './NetworkBalanceIndicator';
import { network, walletconnect } from '../../connectors/connectors';
import WalletModal from './WalletModal';
// import { ReactComponent as WalletIcon } from '../../assets/svg/wallet.svg';
import WalletIcon from '../../assets/svg/wallet_white.svg';

// export const Wallet = styled(WalletIcon)`
//   clip-path: stroke-box;
//   height: 1em;
//   ${'' /* stroke: ${({ color = 'currentColor', theme }) => theme[color]}; */}
//   stroke: #fff;
//   width: 1em;
// `;

const WalletButton = styled(Button)`
  img {
    margin-right: 8px;
  }
`;

const StyledMenu = styled(Menu)`
  width: 100%;
  min-width: 450px;
`;

const MenuTopBar = styled.div`
  width: 100%;
  min-width: 350px;
  margin-bottom: 8px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
`;

const MenuSection = styled.div`
  width: 100%;
  padding: 0 16px;
  margin-bottom: 16px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: flex-end;
`;

const MenuBottom = styled.div`
  width: 100%;
  padding: 0 16px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
`;

const NetworkBox = styled.div`
  width: 100%;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
`;

const StatusIndicator = styled.span`
  font-size: 6px;
`;

const BigStatusIndicator = styled.span`
  font-size: 12px;
`;

const getAddressDisplay = account => {
  let display;

  if (account === undefined) {
    display = 'Not Connected';
  } else if (account === null) {
    display = 'Error Connecting';
  } else {
    display = `${account.substring(0, 6)}...${account.substring(
      account.length - 4
    )}`;
  }

  return display;
};

const AccountMenu = ({
  className,
  currentConnectorName,
  activatingConnector,
  setActivatingConnector,
  triedEager
}) => {
  const context = useWeb3React();
  const { active, chainId, connector, account, deactivate, error } = context;

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // const handleSelectChange = selection => {
  //   console.log(selection);
  //   handleClose();
  // };

  const addressDisplay = getAddressDisplay(account);

  const currentNetwork = chainId
    ? CHAIN_IDS_TO_DISPLAY_NAMES[chainId]
    : 'Not Connected';

  return active || error ? (
    <>
      <WalletButton
        size="small"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
        className={className}
      >
        <img fill="red" stroke="red" src={WalletIcon.src} alt="wallet icon" />
        <span>{addressDisplay}</span>
        <BigStatusIndicator className="ml-2">
          {active ? '🟢' : error ? '🔴' : '🟠'}
        </BigStatusIndicator>
      </WalletButton>
      <StyledMenu
        id="menu-appbar"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuTopBar className="pl-4 pr-4">
          <Typography variant="overline">Account Settings</Typography>
          {(active || error) && (
            <Chip
              color="primary"
              label="Disconnect"
              variant="outlined"
              onClick={() => {
                deactivate();
                handleClose();
              }}
            />
          )}
        </MenuTopBar>
        <MenuSection>
          <div>
            <Typography variant="caption" display="block" width="100%">
              Connector
            </Typography>
            <Typography variant="body2" display="block">
              {currentConnectorName}
            </Typography>
          </div>

          <NetworkBalanceIndicator />
        </MenuSection>
        <Divider />
        {!!(connector === network && chainId) && (
          <MenuItem
            onClick={() => {
              handleClose();
              connector.changeChainId(chainId === 1 ? 4 : 1);
            }}
          >
            Switch Networks
          </MenuItem>
        )}
        {connector === walletconnect && (
          <MenuItem
            onClick={() => {
              handleClose();
              connector.close();
            }}
          >
            Kill WalletConnect Session
          </MenuItem>
        )}
        <Divider />
        <MenuBottom>
          <Typography
            variant="caption"
            display="block"
            width="100%"
            className="mt-3"
          >
            Network
          </Typography>
          <NetworkBox>
            <StatusIndicator className="mr-2">
              {active ? '🟢' : error ? '🔴' : '🟠'}
            </StatusIndicator>
            <Typography variant="body2" display="block">
              {currentNetwork}
            </Typography>
          </NetworkBox>
        </MenuBottom>
      </StyledMenu>
    </>
  ) : (
    <WalletModal
      activatingConnector={activatingConnector}
      setActivatingConnector={setActivatingConnector}
      triedEager={triedEager}
    />
  );
};

AccountMenu.propTypes = {
  className: PropTypes.string,
  currentConnectorName: PropTypes.string,
  triedEager: PropTypes.bool.isRequired,
  activatingConnector: PropTypes.object,
  setActivatingConnector: PropTypes.func.isRequired
};

AccountMenu.defaultProps = {
  className: '',
  currentConnectorName: '',
  activatingConnector: undefined
};

export default AccountMenu;
