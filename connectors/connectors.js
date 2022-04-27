/* eslint-disable import/prefer-default-export */
import { InjectedConnector } from '@web3-react/injected-connector';
import { NetworkConnector } from '@web3-react/network-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { LedgerConnector } from '@web3-react/ledger-connector';
// import { TrezorConnector } from '@web3-react/trezor-connector';

import { ALL_SUPPORTED_CHAIN_IDS } from '../constants/chains';
import { INFURA_NETWORK_URLS } from '../constants/infura';

const POLLING_INTERVAL = 12000;

export const injected = new InjectedConnector({
  supportedChainIds: ALL_SUPPORTED_CHAIN_IDS
});

export const network = new NetworkConnector({
  urls: { ...INFURA_NETWORK_URLS },
  defaultChainId: 1,
  pollingInterval: POLLING_INTERVAL
});

export const walletconnect = new WalletConnectConnector({
  supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
  rpc: { 1: INFURA_NETWORK_URLS[1] },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL
});

export const walletlink = new WalletLinkConnector({
  url: INFURA_NETWORK_URLS[1],
  appName: 'web3-react example'
});

export const ledger = new LedgerConnector({
  chainId: 1,
  url: INFURA_NETWORK_URLS[1],
  pollingInterval: POLLING_INTERVAL
});

export const connectorsByName = {
  Injected: injected,
  Network: network,
  WalletConnect: walletconnect,
  WalletLink: walletlink,
  Ledger: ledger
};

// export const trezor = new TrezorConnector({
//   chainId: 1,
//   url: RPC_URLS[1],
//   pollingInterval: POLLING_INTERVAL,
//   manifestEmail: 'dummy@abc.xyz',
//   manifestAppUrl: 'https://8rg3h.csb.app/'
// });
