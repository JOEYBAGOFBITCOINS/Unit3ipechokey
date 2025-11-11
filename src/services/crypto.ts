/**
 * EchoKey Cryptographic Utilities
 * 
 * Implements HMAC-based signal generation and validation
 * for the split-signal authentication mechanism.
 */

/**
 * Generate a secure HMAC-based signal code
 * @param txHash Transaction hash from blockchain
 * @param timestamp ISO timestamp of signal generation
 * @param secret Shared secret key (in production, stored securely server-side)
 * @returns Signal code (hex string)
 */
export async function generateSignalCode(
  txHash: string,
  timestamp: string,
  secret: string = 'ECHOKEY_SECRET_2025'
): Promise<string> {
  const encoder = new TextEncoder();
  const data = `${txHash}:${timestamp}`;
  
  // Import secret as crypto key
  const keyData = encoder.encode(secret);
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  // Generate HMAC signature
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(data)
  );
  
  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(signature));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Return first 16 characters for user-friendly display
  return hashHex.substring(0, 16).toUpperCase();
}

/**
 * Validate signal code against transaction hash and timestamp
 * @param txHash Transaction hash
 * @param signalCode Code to validate
 * @param timestamp Original timestamp
 * @param windowSeconds Time window in seconds (default 60s)
 * @returns Validation result with approval status and reason
 */
export async function validateSignal(
  txHash: string,
  signalCode: string,
  timestamp: string,
  windowSeconds: number = 60
): Promise<{ approved: boolean; reason: string }> {
  try {
    // Check if signal is within time window
    const signalTime = new Date(timestamp).getTime();
    const currentTime = Date.now();
    const elapsedSeconds = (currentTime - signalTime) / 1000;
    
    if (elapsedSeconds > windowSeconds) {
      return {
        approved: false,
        reason: `Signal expired. Elapsed: ${elapsedSeconds.toFixed(1)}s / ${windowSeconds}s`
      };
    }
    
    // Regenerate expected signal code
    const expectedCode = await generateSignalCode(txHash, timestamp);
    
    // Compare codes (case-insensitive)
    if (signalCode.toUpperCase() !== expectedCode.toUpperCase()) {
      return {
        approved: false,
        reason: 'Signal code mismatch. Invalid signature.'
      };
    }
    
    return {
      approved: true,
      reason: `Valid signal. Verified in ${elapsedSeconds.toFixed(1)}s`
    };
  } catch (error) {
    return {
      approved: false,
      reason: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Generate a mock transaction hash (simulates blockchain transaction)
 * @param from Sender address
 * @param to Recipient address
 * @param amount Transaction amount
 * @param chain Blockchain network
 * @returns Mock transaction hash
 */
export async function generateMockTxHash(
  from: string,
  to: string,
  amount: string,
  chain: string = 'ETH'
): Promise<string> {
  const data = `${from}:${to}:${amount}:${Date.now()}`;
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Add chain-specific prefix
  const evmChains = ['ETH', 'MATIC', 'AVAX', 'BNB'];
  if (evmChains.includes(chain)) {
    return '0x' + hash;
  }
  
  // Non-EVM chains use hash without prefix
  return hash;
}
