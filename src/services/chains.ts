/**
 * Multi-Chain Configuration
 * 
 * Defines supported blockchain networks and their properties
 */

export interface ChainConfig {
  id: string;
  name: string;
  symbol: string;
  icon: string; // Emoji or symbol
  addressPattern: RegExp;
  exampleAddress: string;
  confirmationTime: { min: number; max: number }; // seconds
}

export const SUPPORTED_CHAINS: Record<string, ChainConfig> = {
  ETH: {
    id: 'ETH',
    name: 'Ethereum',
    symbol: 'ETH',
    icon: '⟠',
    addressPattern: /^0x[a-fA-F0-9]{40}$/,
    exampleAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    confirmationTime: { min: 10, max: 120 }
  },
  BTC: {
    id: 'BTC',
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: '₿',
    addressPattern: /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/,
    exampleAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
    confirmationTime: { min: 60, max: 600 }
  },
  SOL: {
    id: 'SOL',
    name: 'Solana',
    symbol: 'SOL',
    icon: '◎',
    addressPattern: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
    exampleAddress: '7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV',
    confirmationTime: { min: 5, max: 30 }
  },
  MATIC: {
    id: 'MATIC',
    name: 'Polygon',
    symbol: 'MATIC',
    icon: '⬡',
    addressPattern: /^0x[a-fA-F0-9]{40}$/,
    exampleAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    confirmationTime: { min: 5, max: 60 }
  },
  AVAX: {
    id: 'AVAX',
    name: 'Avalanche',
    symbol: 'AVAX',
    icon: '🔺',
    exampleAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    addressPattern: /^0x[a-fA-F0-9]{40}$/,
    confirmationTime: { min: 5, max: 30 }
  },
  BNB: {
    id: 'BNB',
    name: 'BNB Chain',
    symbol: 'BNB',
    icon: '◆',
    addressPattern: /^0x[a-fA-F0-9]{40}$/,
    exampleAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    confirmationTime: { min: 5, max: 60 }
  },
  ADA: {
    id: 'ADA',
    name: 'Cardano',
    symbol: 'ADA',
    icon: '₳',
    addressPattern: /^addr1[a-z0-9]{58,}$/,
    exampleAddress: 'addr1qxy3w7j9q4kxv8zmqx8vq7x8xm9q8zm9xq8zm9xq8zm9xq',
    confirmationTime: { min: 20, max: 120 }
  },
  DOT: {
    id: 'DOT',
    name: 'Polkadot',
    symbol: 'DOT',
    icon: '●',
    addressPattern: /^1[a-zA-Z0-9]{47}$/,
    exampleAddress: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
    confirmationTime: { min: 10, max: 60 }
  }
};

export const CHAIN_LIST = Object.values(SUPPORTED_CHAINS);

/**
 * Validate address format for a specific chain
 */
export function isValidChainAddress(address: string, chainId: string): boolean {
  const chain = SUPPORTED_CHAINS[chainId];
  if (!chain) return false;
  return chain.addressPattern.test(address);
}

/**
 * Get chain configuration by ID
 */
export function getChain(chainId: string): ChainConfig | undefined {
  return SUPPORTED_CHAINS[chainId];
}

/**
 * Format chain-specific transaction hash
 */
export function formatTxHash(chain: string): string {
  const prefixes: Record<string, string> = {
    ETH: '0x',
    MATIC: '0x',
    AVAX: '0x',
    BNB: '0x',
    BTC: '',
    SOL: '',
    ADA: '',
    DOT: ''
  };
  
  const prefix = prefixes[chain] || '';
  const hash = Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
  
  return prefix + hash;
}
