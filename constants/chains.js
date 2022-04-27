/**
 * List of all the networks supported by the Uniswap Interface
 */
export const SupportedChainId = {
  MAINNET: 1,
  // ROPSTEN: 3,
  RINKEBY: 4,
  // GOERLI: 5,
  // KOVAN: 42,
  // ARBITRUM_ONE: 42161,
  // ARBITRUM_RINKEBY: 421611,
  // OPTIMISM: 10,
  // OPTIMISTIC_KOVAN: 69,
  POLYGON: 137,
  POLYGON_MUMBAI: 80001,
  LOCALHOST: 31337
};

export const CHAIN_IDS_TO_NAMES = {
  [SupportedChainId.MAINNET]: 'mainnet',
  [SupportedChainId.ROPSTEN]: 'ropsten',
  [SupportedChainId.RINKEBY]: 'rinkeby',
  [SupportedChainId.GOERLI]: 'goerli',
  [SupportedChainId.KOVAN]: 'kovan',
  [SupportedChainId.POLYGON]: 'polygon',
  [SupportedChainId.POLYGON_MUMBAI]: 'polygon_mumbai',
  [SupportedChainId.ARBITRUM_ONE]: 'arbitrum',
  [SupportedChainId.ARBITRUM_RINKEBY]: 'arbitrum_rinkeby',
  [SupportedChainId.OPTIMISM]: 'optimism',
  [SupportedChainId.OPTIMISTIC_KOVAN]: 'optimistic_kovan',
  [SupportedChainId.LOCALHOST]: 'localhost'
};

export const CHAIN_IDS_TO_DISPLAY_NAMES = {
  [SupportedChainId.MAINNET]: 'Ethereum Mainnet',
  [SupportedChainId.ROPSTEN]: 'Ropsten (Testnet)',
  [SupportedChainId.RINKEBY]: 'Rinkeby (Testnet)',
  [SupportedChainId.GOERLI]: 'Goerli (Testnet)',
  [SupportedChainId.KOVAN]: 'Kovan (Testnet)',
  [SupportedChainId.POLYGON]: 'Polygon Mainnet',
  [SupportedChainId.POLYGON_MUMBAI]: 'Polygon Mumbai (Testnet)',
  [SupportedChainId.ARBITRUM_ONE]: 'Arbitrum',
  [SupportedChainId.ARBITRUM_RINKEBY]: 'Arbitrum Rinkeby (Testnet)',
  [SupportedChainId.OPTIMISM]: 'Optimism',
  [SupportedChainId.OPTIMISTIC_KOVAN]: 'Optimistic Kovan (Testnet)',
  [SupportedChainId.LOCALHOST]: 'Localhost (Testnet)'
};

/**
 * Array of all the supported chain IDs
 */
export const ALL_SUPPORTED_CHAIN_IDS = Object.values(SupportedChainId).filter(
  id => typeof id === 'number'
);

export const SUPPORTED_GAS_ESTIMATE_CHAIN_IDS = [
  SupportedChainId.MAINNET,
  SupportedChainId.POLYGON,
  SupportedChainId.OPTIMISM,
  SupportedChainId.ARBITRUM_ONE
];

/**
 * All the chain IDs that are running the Ethereum protocol.
 */
export const L1_CHAIN_IDS = [
  SupportedChainId.MAINNET,
  SupportedChainId.ROPSTEN,
  SupportedChainId.RINKEBY,
  SupportedChainId.GOERLI,
  SupportedChainId.KOVAN,
  SupportedChainId.POLYGON,
  SupportedChainId.POLYGON_MUMBAI
];

/**
 * Controls some L2 specific behavior, e.g. slippage tolerance, special UI behavior.
 * The expectation is that all of these networks have immediate transaction confirmation.
 */
export const L2_CHAIN_IDS = [
  SupportedChainId.ARBITRUM_ONE,
  SupportedChainId.ARBITRUM_RINKEBY,
  SupportedChainId.OPTIMISM,
  SupportedChainId.OPTIMISTIC_KOVAN
];

export const SUPPORTED_NETWORK_OBJECTS = {
  polygon: {
    chainId: `0x${Number(137).toString(16)}`,
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrls: [
      'https://polygon-mainnet.infura.io/v3/e4a9743e44cc4c229016e4766985ae01'
    ],
    blockExplorerUrls: ['https://mumbai.polygonscan.com/']
  },
  polygon_mumbai: {
    chainId: `0x${Number(80001).toString(16)}`,
    chainName: 'Mumbai',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrls: [
      'https://matic-mumbai.chainstacklabs.com',
      'https://rpc-mumbai.maticvigil.com',
      'https://matic-testnet-archive-rpc.bwarelabs.com'
    ],
    blockExplorerUrls: ['https://mumbai.polygonscan.com']
  },
  localhost: {
    chainId: `0x${Number(31337).toString(16)}`,
    chainName: 'Lcoalhost 7545',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrls: ['https://localhost:8545']
  }
};
