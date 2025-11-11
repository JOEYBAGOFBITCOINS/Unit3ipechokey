# EchoKey Architecture Documentation

## System Overview

EchoKey implements a split-signal authentication mechanism for cryptocurrency transactions using a dual-channel approach combined with time-bound HMAC verification.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         EchoKey Platform                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                     PRESENTATION LAYER                        │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │                                                               │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐            │  │
│  │  │    Home    │  │ Dashboard  │  │   Admin    │            │  │
│  │  │    Page    │  │    Page    │  │   Panel    │            │  │
│  │  └────────────┘  └────────────┘  └────────────┘            │  │
│  │                                                               │  │
│  │  ┌─────────────────────────────────────────────────────┐    │  │
│  │  │             UI Components                            │    │  │
│  │  ├─────────────────────────────────────────────────────┤    │  │
│  │  │ WalletConnect │ TransactionForm │ SignalGenerator │    │  │
│  │  │ ValidationDisplay │ AdminPanel │ shadcn/ui      │    │  │
│  │  └─────────────────────────────────────────────────────┘    │  │
│  │                                                               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                      SERVICE LAYER                            │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │                                                               │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │  │
│  │  │   API       │  │   Crypto    │  │   Wallet    │         │  │
│  │  │  Service    │  │  Service    │  │  Service    │         │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘         │  │
│  │         │                 │                 │                │  │
│  │         │                 │                 │                │  │
│  │         ▼                 ▼                 ▼                │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │  │
│  │  │ Transaction │  │    HMAC     │  │  MetaMask   │         │  │
│  │  │ Management  │  │  SHA-256    │  │   Web3 API  │         │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘         │  │
│  │                                                               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                      DATA LAYER                               │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │                                                               │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │              LocalStorage (Mock DB)                   │   │  │
│  │  ├──────────────────────────────────────────────────────┤   │  │
│  │  │  ▸ echokey_transactions                              │   │  │
│  │  │  ▸ echokey_signals                                   │   │  │
│  │  │  ▸ echokey_logs                                      │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  │                                                               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

### 1. Presentation Layer

#### Pages

**Home.tsx**
- Landing page with project introduction
- Feature highlights
- "How It Works" section
- Call-to-action for wallet connection

**Dashboard.tsx**
- Main transaction interface
- Two-column layout: Transaction Form | Signal & Validation
- Flow indicator showing progress
- Real-time status updates

**Admin.tsx**
- Validation logs display
- Statistics dashboard
- Admin controls (clear logs)

#### Components

**WalletConnect.tsx**
```
Responsibilities:
- Connect/disconnect MetaMask
- Display wallet address and balance
- Show connection status
- Handle account/chain changes
```

**TransactionForm.tsx**
```
Responsibilities:
- Input recipient address
- Input transaction amount
- Validate form fields
- Generate transaction (Channel 1)
- Display transaction hash
```

**SignalGenerator.tsx**
```
Responsibilities:
- Generate HMAC signal (Channel 2)
- Display signal code
- Show countdown timer
- Visual progress indicator
- Handle signal expiration
```

**ValidationDisplay.tsx**
```
Responsibilities:
- Validate signal against transaction
- Display approval/denial result
- Show animated feedback
- Log validation events
```

**AdminPanel.tsx**
```
Responsibilities:
- Fetch and display logs
- Show approval/denial statistics
- Provide log management tools
- Real-time log updates
```

---

### 2. Service Layer

#### api.ts - Mock API Service

```typescript
// Simulates backend API using LocalStorage

Functions:
├─ generateTransaction()    # POST /api/generate_tx
├─ generateSignal()         # POST /api/generate_signal
├─ validateTransaction()    # POST /api/validate
├─ getLogs()                # GET /api/logs
├─ getTransactions()        # GET /api/transactions
├─ clearLogs()              # DELETE /api/logs
└─ getSignalForTransaction() # GET /api/signal/:txHash

Storage Keys:
├─ echokey_transactions     # All transactions
├─ echokey_signals          # Generated signals
└─ echokey_logs             # Validation logs
```

#### crypto.ts - Cryptographic Service

```typescript
// HMAC-based signal generation and validation

Functions:
├─ generateSignalCode()     # Create HMAC signature
│   ├─ Input: txHash, timestamp, secret
│   ├─ Algorithm: HMAC-SHA256
│   └─ Output: 16-char hex string
│
├─ validateSignal()         # Verify signal
│   ├─ Check HMAC match
│   ├─ Verify time window
│   └─ Return approval status
│
└─ generateMockTxHash()     # Simulate blockchain tx
    ├─ Hash transaction data
    └─ Return 0x... format hash

Security Implementation:
└─ Web Crypto API
    ├─ crypto.subtle.importKey()
    ├─ crypto.subtle.sign()
    └─ crypto.subtle.digest()
```

#### wallet.ts - Wallet Integration Service

```typescript
// MetaMask/Web3 wallet integration

Functions:
├─ isMetaMaskInstalled()    # Detect MetaMask
├─ connectWallet()          # Request connection
├─ disconnectWallet()       # Clear session
├─ getWalletState()         # Get current state
├─ signMessage()            # Sign with wallet
├─ onAccountsChanged()      # Listen for changes
├─ onChainChanged()         # Listen for network
├─ formatAddress()          # Display helper
├─ isValidAddress()         # Validation
└─ getChainName()           # Chain ID lookup

Wallet State:
├─ connected: boolean
├─ address: string | null
├─ chainId: string | null
└─ balance: string | null
```

---

## Data Models

### Transaction

```typescript
interface Transaction {
  txHash: string;           // Blockchain transaction hash
  from: string;             // Sender wallet address
  to: string;               // Recipient wallet address
  amount: string;           // Transfer amount (ETH)
  timestamp: string;        // ISO 8601 creation time
  status: 'pending' | 'validated' | 'expired' | 'failed';
}
```

### Signal

```typescript
interface Signal {
  txHash: string;           // Associated transaction
  signalCode: string;       // HMAC signature (16 chars)
  timestamp: string;        // Signal generation time
  expiresAt: string;        // Expiration timestamp
}
```

### ValidationLog

```typescript
interface ValidationLog {
  id: string;               // Unique log ID
  txHash: string;           // Validated transaction
  signalCode: string;       // Signal used
  timestamp: string;        // Original signal time
  result: {
    approved: boolean;      // Validation result
    reason: string;         // Detailed reason
  };
  validatedAt: string;      // Validation timestamp
}
```

### WalletState

```typescript
interface WalletState {
  connected: boolean;       // Connection status
  address: string | null;   // Wallet address
  chainId: string | null;   // Network chain ID
  balance: string | null;   // ETH balance
}
```

---

## Authentication Flow

### Complete Transaction Flow

```
┌────────┐     ┌────────┐     ┌────────┐     ┌────────┐
│ User   │     │ Wallet │     │  API   │     │ Crypto │
└───┬────┘     └───┬────┘     └───┬────┘     └───┬────┘
    │              │              │              │
    │ Connect      │              │              │
    ├──────────────►              │              │
    │              │              │              │
    │◄─────────────┤              │              │
    │  Address     │              │              │
    │              │              │              │
    │ Create TX    │              │              │
    ├──────────────────────────────►             │
    │              │              │              │
    │              │              │  Hash Data   │
    │              │              ├──────────────►
    │              │              │              │
    │              │              │◄─────────────┤
    │              │              │  tx_hash     │
    │              │              │              │
    │◄─────────────────────────────┤             │
    │  tx_hash     │              │              │
    │              │              │              │
    │ Generate     │              │              │
    │ Signal       │              │              │
    ├──────────────────────────────►             │
    │              │              │              │
    │              │              │  HMAC Sign   │
    │              │              ├──────────────►
    │              │              │              │
    │              │              │◄─────────────┤
    │              │              │ signal_code  │
    │              │              │              │
    │◄─────────────────────────────┤             │
    │ signal_code  │              │              │
    │ + countdown  │              │              │
    │              │              │              │
    │ Validate     │              │              │
    ├──────────────────────────────►             │
    │              │              │              │
    │              │              │  Verify HMAC │
    │              │              ├──────────────►
    │              │              │  Check Time  │
    │              │              │              │
    │              │              │◄─────────────┤
    │              │              │ approved/    │
    │              │              │ denied       │
    │              │              │              │
    │◄─────────────────────────────┤             │
    │  Result +    │              │              │
    │  Reason      │              │              │
    │              │              │              │
    │              │              │ Log Event    │
    │              │              ├──────────────►
    │              │              │              │
```

---

## Security Architecture

### HMAC Signal Generation

```
Input:
├─ txHash:    "0xabc123..."
├─ timestamp: "2025-11-05T12:00:00Z"
└─ secret:    "ECHOKEY_SECRET_2025"

Process:
├─ data = txHash + ":" + timestamp
├─ key = importKey(secret, HMAC-SHA256)
├─ signature = sign(key, data)
└─ signal = signature[0:16].toUpperCase()

Output:
└─ "A7F3C9E2D4B8A1C5"
```

### Validation Logic

```
Steps:
1. Regenerate expected signal
   expected = HMAC(txHash + timestamp, secret)

2. Compare signals (case-insensitive)
   if (received !== expected):
       return DENIED

3. Check time window
   elapsed = now - timestamp
   if (elapsed > windowSeconds):
       return DENIED

4. Approve transaction
   return APPROVED
```

### Threat Model

| Threat | Mitigation | Status |
|--------|-----------|--------|
| Signal replay | Time-bound expiration | ✅ Implemented |
| Signal tampering | HMAC verification | ✅ Implemented |
| Key exposure | Client-side only (demo) | ⚠️ Not production-ready |
| Man-in-the-middle | Not addressed | ❌ Requires HTTPS + backend |
| Rate limiting | Not implemented | ❌ Production needed |
| Brute force | Not implemented | ❌ Production needed |

---

## State Management

### Application State Flow

```
┌─────────────────────────────────────────────┐
│              App.tsx (Root)                 │
├─────────────────────────────────────────────┤
│  State:                                     │
│  ├─ currentPage: 'home' | 'dashboard' | ... │
│  └─ walletState: WalletState               │
│                                             │
│  Effects:                                   │
│  └─ Check wallet on mount                  │
└─────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
┌───────────────┐      ┌────────────────┐
│  Dashboard    │      │  Admin         │
├───────────────┤      ├────────────────┤
│  State:       │      │  State:        │
│  ├─ currentTx │      │  ├─ logs[]     │
│  └─ signal    │      │  └─ loading    │
└───────────────┘      └────────────────┘
        │
        ├──────────┬──────────┬──────────┐
        ▼          ▼          ▼          ▼
    ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
    │  Tx    │ │ Signal │ │ Valid. │ │ Admin  │
    │  Form  │ │  Gen.  │ │ Display│ │ Panel  │
    └────────┘ └────────┘ └────────┘ └────────┘
```

### Data Flow Patterns

1. **Component → Service → Storage**
   - User action triggers component function
   - Component calls service layer
   - Service updates LocalStorage
   - Service returns result to component

2. **Storage → Service → Component**
   - Component requests data
   - Service fetches from LocalStorage
   - Service formats and returns data
   - Component updates UI

---

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**
   - Pages loaded on demand
   - Components rendered conditionally

2. **Memoization**
   - Use React.memo for expensive components
   - useMemo for computed values
   - useCallback for event handlers

3. **LocalStorage**
   - Minimal read/write operations
   - Batch updates when possible
   - Clear old data periodically

4. **Web Crypto API**
   - Native browser implementation
   - Hardware-accelerated when available
   - Asynchronous operations

---

## Testing Strategy

### Test Levels

```
┌─────────────────────────────────────┐
│       E2E Tests (Future)            │
│  ├─ Full transaction flow          │
│  ├─ Wallet integration             │
│  └─ Multi-user scenarios           │
├─────────────────────────────────────┤
│      Integration Tests              │
│  ├─ Service layer interactions     │
│  ├─ API mock responses             │
│  └─ State management               │
├─────────────────────────────────────┤
│       Unit Tests                    │
│  ├─ Crypto functions               │
│  ├─ Validation logic               │
│  ├─ Wallet utilities               │
│  └─ Component logic                │
└─────────────────────────────────────┘
```

---

## Scalability & Production Roadmap

### Current Limitations (MVP)

- ❌ No backend server
- ❌ LocalStorage only
- ❌ Single-user sessions
- ❌ Client-side secret key
- ❌ No database
- ❌ Limited error handling

### Production Requirements

```
Backend:
├─ Node.js/Express API server
├─ PostgreSQL database
├─ Redis for session management
├─ JWT authentication
└─ Rate limiting middleware

Security:
├─ Server-side HMAC validation
├─ AWS KMS for key management
├─ HTTPS/TLS encryption
├─ CSRF protection
└─ Input sanitization

Infrastructure:
├─ Docker containers
├─ Kubernetes orchestration
├─ Load balancing
├─ Auto-scaling
└─ Monitoring & logging

Features:
├─ Multi-signature support
├─ Transaction webhooks
├─ Email notifications
├─ SMS 2FA integration
└─ Advanced analytics
```

---

## Deployment Architecture (Production)

```
┌────────────────────────────────────────────────────┐
│              Load Balancer (AWS ALB)               │
└────────────────┬───────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
┌───────────────┐   ┌───────────────┐
│   Frontend    │   │   Frontend    │
│  (React App)  │   │  (React App)  │
│   Container   │   │   Container   │
└───────┬───────┘   └───────┬───────┘
        │                   │
        └────────┬──────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│         API Gateway             │
└────────┬────────────────────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌────────┐
│ Backend│ │ Backend│
│  API   │ │  API   │
└───┬────┘ └───┬────┘
    │          │
    └────┬─────┘
         │
    ┌────┴────┬──────────┬─────────┐
    │         │          │         │
    ▼         ▼          ▼         ▼
┌────────┐ ┌────┐ ┌──────────┐ ┌─────┐
│ Postgres│ │Redis│ │   KMS    │ │ S3  │
└─────────┘ └─────┘ └──────────┘ └─────┘
```

---

## Conclusion

EchoKey demonstrates a novel approach to transaction security through split-signal authentication. The modular architecture allows for easy extension and modification, making it suitable for educational purposes and as a foundation for production systems with proper security enhancements.
