/**
 * EchoKey Wallet Integration Service
 * 
 * Handles MetaMask/WalletConnect integration for signing transactions.
 * Provides wallet connection, address retrieval, and transaction signing.
 */

// Extend Window interface for ethereum provider
declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  chainId: string | null;
  balance: string | null;
}

/**
 * Check if MetaMask is installed and ready
 */
export function isMetaMaskInstalled(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  // Check if ethereum provider exists and is ready
  return (
    typeof window.ethereum !== 'undefined' && 
    window.ethereum !== null &&
    typeof window.ethereum.request === 'function'
  );
}

/**
 * Connect to MetaMask wallet
 * @returns Wallet state with address and chain info
 */
export async function connectWallet(): Promise<WalletState> {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
  }
  
  try {
    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    
    // Get chain ID
    const chainId = await window.ethereum.request({
      method: 'eth_chainId',
    });
    
    // Get balance
    const balance = await window.ethereum.request({
      method: 'eth_getBalance',
      params: [accounts[0], 'latest'],
    });
    
    // Convert balance from wei to ETH
    const balanceInEth = (parseInt(balance, 16) / 1e18).toFixed(4);
    
    return {
      connected: true,
      address: accounts[0],
      chainId,
      balance: balanceInEth,
    };
  } catch (error: any) {
    // User rejected the request - don't log as error
    if (error?.code === 4001) {
      throw error; // Re-throw to let the component handle it
    }
    
    // Pending request - don't log as error
    if (error?.code === -32002) {
      throw error; // Re-throw to let the component handle it
    }
    
    // Log other errors
    console.error('Wallet connection error:', error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Failed to connect wallet. Please try again.'
    );
  }
}

/**
 * Disconnect wallet (clear local state)
 */
export function disconnectWallet(): WalletState {
  return {
    connected: false,
    address: null,
    chainId: null,
    balance: null,
  };
}

/**
 * Get current wallet state
 */
export async function getWalletState(): Promise<WalletState> {
  if (!isMetaMaskInstalled()) {
    return disconnectWallet();
  }
  
  // Check if ethereum provider is ready
  if (!window.ethereum || !window.ethereum.request) {
    return disconnectWallet();
  }
  
  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    });
    
    if (accounts.length === 0) {
      return disconnectWallet();
    }
    
    const chainId = await window.ethereum.request({
      method: 'eth_chainId',
    });
    
    const balance = await window.ethereum.request({
      method: 'eth_getBalance',
      params: [accounts[0], 'latest'],
    });
    
    const balanceInEth = (parseInt(balance, 16) / 1e18).toFixed(4);
    
    return {
      connected: true,
      address: accounts[0],
      chainId,
      balance: balanceInEth,
    };
  } catch (error: any) {
    // Silently handle common errors when MetaMask is not available or not ready
    // Only log actual unexpected errors
    if (error?.code !== -32603 && error?.message !== 'Failed to fetch') {
      console.error('Error getting wallet state:', error);
    }
    return disconnectWallet();
  }
}

/**
 * Sign a message with the connected wallet
 * @param message Message to sign
 * @param address Wallet address
 * @returns Signature string
 */
export async function signMessage(message: string, address: string): Promise<string> {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }
  
  try {
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [message, address],
    });
    
    return signature;
  } catch (error: any) {
    // User rejected the request - don't log as error
    if (error?.code === 4001) {
      throw error; // Re-throw to let the component handle it
    }
    
    // Log other errors
    console.error('Signature error:', error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Failed to sign message'
    );
  }
}

/**
 * Listen for account changes
 * @param callback Function to call when accounts change
 */
export function onAccountsChanged(callback: (accounts: string[]) => void): () => void {
  if (!isMetaMaskInstalled()) {
    return () => {};
  }
  
  const handler = (accounts: string[]) => {
    callback(accounts);
  };
  
  window.ethereum.on('accountsChanged', handler);
  
  // Return cleanup function
  return () => {
    window.ethereum.removeListener('accountsChanged', handler);
  };
}

/**
 * Listen for chain changes
 * @param callback Function to call when chain changes
 */
export function onChainChanged(callback: (chainId: string) => void): () => void {
  if (!isMetaMaskInstalled()) {
    return () => {};
  }
  
  const handler = (chainId: string) => {
    callback(chainId);
  };
  
  window.ethereum.on('chainChanged', handler);
  
  // Return cleanup function
  return () => {
    window.ethereum.removeListener('chainChanged', handler);
  };
}

/**
 * Format wallet address for display (0x1234...5678)
 */
export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Map MetaMask chainId to EchoKey chain symbols
 */
export function getChainSymbol(chainId: string): string {
  // Normalize chainId to lowercase hex format
  let normalizedChainId = chainId;
  
  // If it's a decimal number, convert to hex
  if (!/^0x/.test(chainId)) {
    normalizedChainId = '0x' + parseInt(chainId, 10).toString(16);
  }
  
  // Ensure lowercase for consistent comparison
  normalizedChainId = normalizedChainId.toLowerCase();
  
  console.log('Detecting chain for chainId:', chainId, '-> normalized:', normalizedChainId);
  
  const chainMap: Record<string, string> = {
    // Ethereum
    '0x1': 'ETH',
    '0x5': 'ETH',        // Goerli
    '0xaa36a7': 'ETH',   // Sepolia
    '0x11155111': 'ETH', // Sepolia (alternative)
    
    // Polygon
    '0x89': 'MATIC',
    '0x13881': 'MATIC',  // Mumbai
    
    // Avalanche
    '0xa86a': 'AVAX',
    '0xa869': 'AVAX',    // Fuji testnet
    
    // BNB Chain
    '0x38': 'BNB',
    '0x61': 'BNB',       // Testnet
    
    // Solana doesn't use MetaMask, but keeping for completeness
    'solana': 'SOL',
  };
  
  const result = chainMap[normalizedChainId] || 'ETH';
  console.log('Chain detected:', result);
  
  return result;
}

/**
 * Get chain name from chain ID
 */
export function getChainName(chainId: string): string {
  const chains: Record<string, string> = {
    '0x1': 'Ethereum Mainnet',
    '0x5': 'Goerli Testnet',
    '0xaa36a7': 'Sepolia Testnet',
    '0x89': 'Polygon Mainnet',
    '0x13881': 'Mumbai Testnet',
    '0xa86a': 'Avalanche C-Chain',
    '0x38': 'BNB Chain',
  };
  
  return chains[chainId] || `Chain ${chainId}`;
}
