/**
 * EchoKey API Service Layer — Post-Quantum Adaptive Edition
 * 
 * Simulates backend API using localStorage for data persistence.
 * Features adaptive expiration windows and auto-refreshing signal tokens.
 * In production, this would connect to a real backend server.
 */

import { generateSignalCode, validateSignal as cryptoValidateSignal, generateMockTxHash } from './crypto';

export interface Transaction {
  txHash: string;
  from: string;
  to: string;
  amount: string;
  timestamp: string;
  status: 'pending' | 'validated' | 'expired' | 'failed';
  chain: string; // Blockchain network (ETH, BTC, SOL, etc.)
}

export interface Signal {
  txHash: string;
  signalCode: string;
  timestamp: string;
  expiresAt: string;
}

export interface ValidationLog {
  id: string;
  txHash: string;
  signalCode: string;
  timestamp: string;
  result: {
    approved: boolean;
    reason: string;
  };
  validatedAt: string;
  chain?: string; // Blockchain network
}

// Local storage keys
const STORAGE_KEYS = {
  TRANSACTIONS: 'echokey_transactions',
  SIGNALS: 'echokey_signals',
  LOGS: 'echokey_logs',
};

// Helper to get data from localStorage
function getStorageData<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Helper to set data in localStorage
function setStorageData<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

/**
 * Get average block time for different blockchains (in seconds)
 * Used for adaptive expiration window calculation
 */
function getAverageBlockTime(chain: string = "ETH"): number {
  const map: Record<string, number> = {
    ETH: 15,
    MATIC: 2,
    BTC: 600,
    SOL: 0.4,
    BNB: 3,
    AVAX: 2,
    ADA: 20,
    DOT: 6,
  };
  return map[chain.toUpperCase()] || 30;
}

/**
 * POST /api/generate_tx
 * Generate a new transaction and return transaction hash
 */
export async function generateTransaction(
  from: string,
  to: string,
  amount: string,
  chain: string = 'ETH'
): Promise<{ txHash: string; timestamp: string; chain: string }> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate mock transaction hash
  const txHash = await generateMockTxHash(from, to, amount, chain);
  const timestamp = new Date().toISOString();
  
  // Store transaction
  const transactions = getStorageData<Transaction>(STORAGE_KEYS.TRANSACTIONS);
  transactions.push({
    txHash,
    from,
    to,
    amount,
    timestamp,
    status: 'pending',
    chain,
  });
  setStorageData(STORAGE_KEYS.TRANSACTIONS, transactions);
  
  return { txHash, timestamp, chain };
}

/**
 * POST /api/generate_signal
 * Generate hidden signal for a transaction with adaptive expiration
 * Uses blockchain-specific average block time to calculate optimal TTL
 */
export async function generateSignal(
  txHash: string,
  chain: string = "ethereum"
): Promise<{ signalCode: string; timestamp: string; expiresAt: string }> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Calculate adaptive TTL based on blockchain latency
  // Minimum 60 seconds, or 4x the average block time
  const avgBlockTime = getAverageBlockTime(chain);
  const dynamicTTL = Math.max(60, avgBlockTime * 4) * 1000; // Convert to milliseconds
  
  const timestamp = new Date().toISOString();
  const expiresAt = new Date(Date.now() + dynamicTTL).toISOString();
  
  // Generate signal code using post-quantum resistant HMAC
  const signalCode = await generateSignalCode(txHash, timestamp);
  
  // Store signal (replace any existing signal for this txHash)
  const signals = getStorageData<Signal>(STORAGE_KEYS.SIGNALS);
  const filtered = signals.filter(s => s.txHash !== txHash);
  filtered.push({
    txHash,
    signalCode,
    timestamp,
    expiresAt,
  });
  setStorageData(STORAGE_KEYS.SIGNALS, filtered);
  
  console.log(`🔐 Signal generated for ${txHash} (TTL: ${dynamicTTL / 1000}s, chain: ${chain})`);
  
  return { signalCode, timestamp, expiresAt };
}

/**
 * POST /api/validate
 * Validate transaction with signal code
 */
export async function validateTransaction(
  txHash: string,
  signalCode: string,
  timestamp: string
): Promise<{ approved: boolean; reason: string }> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Perform cryptographic validation
  const result = await cryptoValidateSignal(txHash, signalCode, timestamp);
  
  // Update transaction status
  const transactions = getStorageData<Transaction>(STORAGE_KEYS.TRANSACTIONS);
  const txIndex = transactions.findIndex(tx => tx.txHash === txHash);
  if (txIndex !== -1) {
    transactions[txIndex].status = result.approved ? 'validated' : 'failed';
    setStorageData(STORAGE_KEYS.TRANSACTIONS, transactions);
  }
  
  // Log validation event with chain info
  const logs = getStorageData<ValidationLog>(STORAGE_KEYS.LOGS);
  const tx = transactions.find(t => t.txHash === txHash);
  logs.push({
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    txHash,
    signalCode,
    timestamp,
    result,
    validatedAt: new Date().toISOString(),
    chain: tx?.chain || 'ETH',
  });
  setStorageData(STORAGE_KEYS.LOGS, logs);
  
  return result;
}

/**
 * GET /api/logs
 * Retrieve all validation logs
 */
export async function getLogs(): Promise<ValidationLog[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const logs = getStorageData<ValidationLog>(STORAGE_KEYS.LOGS);
  return logs.reverse(); // Most recent first
}

/**
 * GET /api/transactions
 * Retrieve all transactions
 */
export async function getTransactions(): Promise<Transaction[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const transactions = getStorageData<Transaction>(STORAGE_KEYS.TRANSACTIONS);
  return transactions.reverse(); // Most recent first
}

/**
 * DELETE /api/logs
 * Clear all logs (admin function)
 */
export async function clearLogs(): Promise<{ success: boolean }> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  setStorageData(STORAGE_KEYS.LOGS, []);
  return { success: true };
}

/**
 * DELETE /api/transactions
 * Clear all transactions (admin function)
 */
export async function clearTransactions(): Promise<{ success: boolean }> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  setStorageData(STORAGE_KEYS.TRANSACTIONS, []);
  setStorageData(STORAGE_KEYS.SIGNALS, []);
  return { success: true };
}

/**
 * GET /api/signal/:txHash
 * Get signal for a specific transaction
 */
export async function getSignalForTransaction(txHash: string): Promise<Signal | null> {
  const signals = getStorageData<Signal>(STORAGE_KEYS.SIGNALS);
  return signals.find(s => s.txHash === txHash) || null;
}

/**
 * Auto-refresh signal tokens to keep them alive during blockchain confirmation
 * Automatically renews signals when they're close to expiring
 * @param txHash Transaction hash to monitor
 * @param chain Blockchain network (affects refresh timing)
 * @returns Cleanup function to stop the refresh cycle
 */
export function startSignalRefresh(txHash: string, chain: string = "ethereum"): () => void {
  const refreshInterval = 5000; // Check every 5 seconds
  
  const timer = setInterval(async () => {
    const signals = getStorageData<Signal>(STORAGE_KEYS.SIGNALS);
    const signal = signals.find((s) => s.txHash === txHash);
    
    if (!signal) {
      console.log(`⚠️ No signal found for ${txHash}, stopping refresh`);
      clearInterval(timer);
      return;
    }
    
    // Check time remaining
    const timeLeft = new Date(signal.expiresAt).getTime() - Date.now();
    
    // Refresh if less than 10 seconds remaining
    if (timeLeft < 10000 && timeLeft > 0) {
      const newSignal = await generateSignal(txHash, chain);
      console.log(`🔄 Signal auto-refreshed for ${txHash}:`, newSignal.signalCode.substring(0, 16) + '...');
    }
    
    // Stop if expired
    if (timeLeft <= 0) {
      console.log(`⏱️ Signal expired for ${txHash}, stopping refresh`);
      clearInterval(timer);
    }
  }, refreshInterval);
  
  // Return cleanup function
  return () => {
    console.log(`🛑 Stopping signal refresh for ${txHash}`);
    clearInterval(timer);
  };
}
