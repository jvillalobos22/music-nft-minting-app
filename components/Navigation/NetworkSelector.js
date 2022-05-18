/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { PropTypes } from 'prop-types';

import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useWeb3React } from '@web3-react/core';
import styled from '@emotion/styled';
import {
  SupportedChainId,
  CHAIN_IDS_TO_DISPLAY_NAMES,
  SUPPORTED_NETWORK_OBJECTS
} from '../../constants/chains';
import PolygonMaticLogo from '../../assets/svg/polygon-matic-logo.svg';
import EthereumIcon from '../../assets/images/ethereum-logo.png';

const IconWrapper = styled.div`
  margin-right: 8px;
  img {
    max-width: 20px;
  }
`;

const PolygonIcon = styled.img`
  margin-right: 8px;
`;

const changeNetwork = async ({ networkName, setNetworkError }) => {
  try {
    if (!window.ethereum) throw new Error('No crypto wallet found');
    const params = { ...SUPPORTED_NETWORK_OBJECTS[networkName] };

    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [params]
    });
  } catch (err) {
    setNetworkError(err.message);
  }
};

const getNetworkIcon = chainId => {
  if (
    chainId === SupportedChainId.POLYGON ||
    chainId === SupportedChainId.POLYGON_MUMBAI
  ) {
    return (
      <PolygonIcon
        width="18px"
        src={PolygonMaticLogo.src}
        alt="polygon matic icon"
      />
    );
  }

  return (
    <IconWrapper>
      <img src={EthereumIcon.src} alt="eth network icon" />
    </IconWrapper>
  );
};

const NetworkSelector = ({ className }) => {
  const context = useWeb3React();
  const { chainId } = context;

  const [anchorEl, setAnchorEl] = useState(null);
  const [networkError, setNetworkError] = useState();

  const handleNetworkSwitch = async networkName => {
    setNetworkError();
    await changeNetwork({ networkName, setNetworkError });
  };

  const networkChanged = newChainId => {
    console.log({ newChainId });
  };

  useEffect(() => {
    window.ethereum.on('chainChanged', networkChanged);

    return () => {
      window.ethereum.removeListener('chainChanged', networkChanged);
    };
  }, []);

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectChange = networkName => {
    handleNetworkSwitch(networkName);
    handleClose();
  };

  if (networkError) console.log('networkError', networkError);

  const currentNetwork = chainId
    ? CHAIN_IDS_TO_DISPLAY_NAMES[chainId]
    : 'Select Network';

  const currentNetworkIcon = getNetworkIcon(chainId);
  return (
    <>
      <Button
        size="small"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
        className={className}
      >
        {currentNetworkIcon} {currentNetwork}
      </Button>

      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleSelectChange('polygon')}>
          <PolygonIcon
            width="20px"
            src={PolygonMaticLogo.src}
            alt="polygon matic icon"
          />
          Polygon Mainnet
        </MenuItem>
        <MenuItem
          value="polygonMumbai"
          onClick={() => handleSelectChange('polygon_mumbai')}
        >
          <PolygonIcon
            width="20px"
            src={PolygonMaticLogo.src}
            alt="polygon matic icon"
          />
          Polygon Mumbai
        </MenuItem>
        <MenuItem
          value="localhost"
          onClick={() => handleSelectChange('localhost')}
        >
          <IconWrapper>
            <img src={EthereumIcon.src} alt="polygon matic icon" />{' '}
          </IconWrapper>
          Localhost
        </MenuItem>
      </Menu>
    </>
  );
};

NetworkSelector.propTypes = { className: PropTypes.string };

NetworkSelector.defaultProps = { className: '' };

export default NetworkSelector;
