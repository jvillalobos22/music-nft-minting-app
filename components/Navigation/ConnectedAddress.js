/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
import { PropTypes } from 'prop-types';
import { useWeb3React } from '@web3-react/core';
import React from 'react';

const ConnectedAddress = ({ className }) => {
  const context = useWeb3React();
  const { account } = context;

  return (
    <span className={className}>
      {account === undefined
        ? '...'
        : account === null
        ? 'None'
        : `${account.substring(0, 6)}...${account.substring(
            account.length - 4
          )}`}
    </span>
  );
};

ConnectedAddress.propTypes = {
  className: PropTypes.string
};

ConnectedAddress.defaultProps = {
  className: ''
};

export default ConnectedAddress;
