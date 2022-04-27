import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { PropTypes } from 'prop-types';

import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useWeb3React } from '@web3-react/core';
import {
  CHAIN_IDS_TO_DISPLAY_NAMES,
  SUPPORTED_NETWORK_OBJECTS
} from '../../constants/chains';

const changeNetwork = async ({ networkName, setNetworkError }) => {
  try {
    if (!window.ethereum) throw new Error('No crypto wallet found');
    console.log('networkName', networkName);
    console.log('SUPPORTED_NETWORK_OBJECTS', SUPPORTED_NETWORK_OBJECTS);
    const params = { ...SUPPORTED_NETWORK_OBJECTS[networkName] };
    console.log('params', params);

    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [params]
    });
  } catch (err) {
    setNetworkError(err.message);
  }
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
        {currentNetwork}
      </Button>

      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleSelectChange('polygon')}>
          Polygon Mainnet
        </MenuItem>
        <MenuItem
          value="polygonMumbai"
          onClick={() => handleSelectChange('polygon_mumbai')}
        >
          Polygon Mumbai
        </MenuItem>
        <MenuItem
          value="localhost"
          onClick={() => handleSelectChange('localhost')}
        >
          Localhost
        </MenuItem>
      </Menu>
    </>
  );
};

NetworkSelector.propTypes = { className: PropTypes.string };

NetworkSelector.defaultProps = { className: '' };

export default NetworkSelector;
