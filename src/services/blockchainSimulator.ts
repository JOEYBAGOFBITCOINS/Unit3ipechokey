/**
 * Mock Blockchain Confirmation Simulator
 * ---------------------------------------
 * Simulates delayed blockchain confirmations for EchoKey demo.
 * No UI changes — runs silently in the background.
 */

import { getTransactions } from "./api";

export interface ConfirmationEvent {
  txHash: string;
  confirmed: boolean;
  blockNumber: number;
  timestamp: string;
}

let listeners: ((event: ConfirmationEvent) => void)[] = [];

/**
 * Register a listener for blockchain confirmation events
 * @param listener Callback function to invoke when a block is confirmed
 * @returns Unsubscribe function
 */
export function onBlockConfirmed(listener: (event: ConfirmationEvent) => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

/**
 * Simulate blockchain confirmation with random delay
 * Mimics real-world blockchain latency and unpredictability
 * Delay varies based on blockchain network characteristics
 * @param txHash Transaction hash to confirm
 * @param chain Blockchain network (affects confirmation time)
 */
export function simulateConfirmation(txHash: string, chain: string = 'ETH') {
  // Chain-specific confirmation times (in seconds)
  const confirmationTimes: Record<string, { min: number; max: number }> = {
    ETH: { min: 10, max: 120 },
    BTC: { min: 60, max: 600 },
    SOL: { min: 5, max: 30 },
    MATIC: { min: 5, max: 60 },
    AVAX: { min: 5, max: 30 },
    BNB: { min: 5, max: 60 },
    ADA: { min: 20, max: 120 },
    DOT: { min: 10, max: 60 }
  };
  
  const times = confirmationTimes[chain] || { min: 10, max: 120 };
  const delay = Math.floor(Math.random() * (times.max - times.min) + times.min) * 1000;
  console.log(`⏳ Simulating ${chain} blockchain confirmation for ${txHash} (~${delay / 1000}s)`);

  setTimeout(async () => {
    const blockNumber = Math.floor(Math.random() * 1_000_000);
    const event: ConfirmationEvent = {
      txHash,
      confirmed: true,
      blockNumber,
      timestamp: new Date().toISOString(),
    };

    // Update transaction status in local storage
    const txs = await getTransactions();
    const tx = txs.find((t) => t.txHash === txHash);
    if (tx) {
      tx.status = "validated";
      // Update localStorage
      localStorage.setItem("echokey_transactions", JSON.stringify(txs));
    }

    console.log(`✅ Block ${blockNumber} confirmed for ${txHash}`);
    
    // Notify all listeners
    listeners.forEach((l) => l(event));
  }, delay);
}
