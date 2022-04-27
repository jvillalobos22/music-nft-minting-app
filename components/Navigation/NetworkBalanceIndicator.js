import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useWeb3React } from '@web3-react/core';
import { Typography } from '@mui/material';
import { formatEther } from '@ethersproject/units';

const getBalanceDisplay = balanceInWei => {
  let valueInEth = Number(parseFloat(formatEther(balanceInWei)).toPrecision(6));
  if (valueInEth > 9999.99) {
    valueInEth = valueInEth.toFixed(2);
  } else if (valueInEth > 999.99) {
    valueInEth = valueInEth.toFixed(2);
  } else if (valueInEth > 99.99) {
    valueInEth = valueInEth.toFixed(3);
  } else if (valueInEth > 10) {
    valueInEth = valueInEth.toFixed(4);
  } else if (valueInEth > 1) {
    valueInEth = valueInEth.toFixed(5);
  } else if (valueInEth > 0 && valueInEth >= 0.0001) {
    valueInEth = valueInEth.toFixed(6);
  } else {
    valueInEth = valueInEth.toFixed(8);
  }
  return valueInEth;
};

const NetworkBalanceIndicator = ({ className }) => {
  const context = useWeb3React();
  const { library, chainId, account } = context;
  const [ethBalance, setEthBalance] = useState();

  useEffect(() => {
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

  const balanceDisplay = ethBalance ? getBalanceDisplay(ethBalance) : '0';
  console.log('balanceDisplay', balanceDisplay);
  return (
    <Typography variant="body2" component="p" className={className}>
      {ethBalance === undefined || ethBalance === null
        ? '...'
        : `Ξ ${balanceDisplay}`}
    </Typography>
  );
};

NetworkBalanceIndicator.propTypes = { className: PropTypes.string };

NetworkBalanceIndicator.defaultProps = { className: '' };

export default NetworkBalanceIndicator;
