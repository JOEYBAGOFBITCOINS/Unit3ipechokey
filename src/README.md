<div align="center">

<img src="https://raw.githubusercontent.com/YOUR_USERNAME/EchoKey_EchoKey/main/assets/logo.png" alt="EchoKey Logo" width="400"/>

# Split-Signal Authentication Platform

**Next-generation platform that secures high-value cryptocurrency transfers using dual-signal verification**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Features](#-features)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Security](#-security)
- [Contributing](#-contributing)

---

## 🎯 Overview

EchoKey is a cutting-edge authentication platform that adds an additional layer of security to cryptocurrency transactions through **dual-signal verification**. A transaction must be paired with a hidden, time-bound signal that is validated using HMAC cryptography.

### How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                     EchoKey Architecture                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. CHANNEL 1 (Transaction)                                 │
│     ├─ User creates transaction                             │
│     ├─ Generate tx_hash via blockchain                      │
│     └─ Transaction pending validation                       │
│                                                              │
│  2. CHANNEL 2 (Hidden Signal)                               │
│     ├─ Generate HMAC-based signal code                      │
│     ├─ Signal = HMAC(tx_hash + timestamp, secret_key)       │
│     └─ Start countdown timer (default: 60s)                 │
│                                                              │
│  3. VALIDATION                                               │
│     ├─ Verify signal matches expected HMAC                  │
│     ├─ Check signal is within time window                   │
│     ├─ Approve ✅ or Deny ❌ transaction                     │
│     └─ Log event for audit trail                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Architecture

### System Components

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│              │         │              │         │              │
│   Frontend   │ ◄────► │  API Layer   │ ◄────► │   Storage    │
│   (React)    │         │  (Services)  │         │ (LocalStore) │
│              │         │              │         │              │
└──────────────┘         └──────────────┘         └──────────────┘
       │                        │
       │                        │
       ▼                        ▼
┌──────────────┐         ┌──────────────┐
│   MetaMask   │         │    Crypto    │
│ (Web3 Wallet)│         │  (HMAC/SHA)  │
└──────────────┘         └──────────────┘
```

### Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4.0 + shadcn/ui components
- **Design System**: Custom turbulent card components with SVG displacement filters
- **Crypto**: Web Crypto API (HMAC-SHA256)
- **Wallet**: MetaMask / WalletConnect integration
- **Storage**: LocalStorage (for demonstration; production would use database)
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Animations**: SVG feTurbulence filters for liquid border effects

---

## ✨ Features

### Core Features

- ✅ **Dual-Channel Verification**: Transaction + Hidden Signal validation
- ✅ **Multi-Chain Support**: Auto-detects network from wallet (ETH, BTC, SOL, MATIC, AVAX, BNB, ADA, DOT)
- ✅ **HMAC Security**: SHA-256 based signal generation
- ✅ **Adaptive Expiration**: Chain-specific time windows based on block times
- ✅ **Real-Time Countdown**: Visual timer with progress bar
- ✅ **Wallet Integration**: MetaMask support with automatic network detection
- ✅ **Audit Logging**: Complete transaction history with chain badges and approval/denial reasons
- ✅ **Admin Panel**: View all validation logs and statistics
- ✅ **Dark Theme**: Futuristic UI with electric blue turbulent borders
- ✅ **Responsive Design**: Works on desktop and mobile

### UI/UX Features

- 🎨 **Turbulent Card Design System**: Animated liquid borders with displacement effects
- 💎 **Luxury Color Palette**: Champagne gold (#C9A961) and platinum silver accents
- ⚡ Animated validation feedback (ripple effects)
- 🌈 Gradient buttons with hover effects
- ⏱️ Radial countdown animations
- 📊 Real-time statistics dashboard with turbulent cards
- 🔔 Toast notifications for all actions
- 🌊 SVG-based fluid animations using feTurbulence filters

---

## 🚀 Installation

### Prerequisites

- Node.js 18+ or modern browser
- MetaMask browser extension (for wallet features)

### Quick Start

This is a frontend-only application that runs entirely in the browser:

1. **Open in browser** - The application is self-contained
2. **Connect MetaMask** - Click "Connect Wallet" in the header
3. **Start using** - Create transactions and generate signals

### Development Setup (Optional)

If you want to run this locally with a development server:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Docker Setup (Optional)

For containerized deployment:

```bash
# Build and run with Docker Compose
docker-compose up -d

# Access at http://localhost:3000
```

---

## 📖 Usage

### 1. Connect Wallet

```javascript
// Click "Connect Wallet" button
// MetaMask will prompt for connection approval
// App detects wallet address, balance, and chain
```

### 2. Create Transaction

```javascript
// Navigate to Dashboard
// Enter recipient address (0x...)
// Enter amount in ETH
// Click "Create Transaction"
// → Generates Channel 1 (tx_hash)
```

### 3. Generate Signal

```javascript
// Switch to "Channel 2 - Signal" tab
// Click "Generate Signal"
// → Creates time-bound HMAC signal
// → Countdown timer begins (60 seconds)
// Copy signal code if needed
```

### 4. Validate Transaction

```javascript
// Switch to "Validation" tab
// Click "Validate Transaction"
// → Verifies signal HMAC matches
// → Checks time window
// → Shows approval ✅ or denial ❌
```

### 5. View Logs (Admin)

```javascript
// Click "Admin" in header
// View all validation logs
// See approval/denial statistics
// Clear logs if needed
```

---

## 📡 API Documentation

### Mock API Endpoints

All API functions are simulated using LocalStorage. In production, these would be HTTP endpoints.

#### POST /api/generate_tx

Generate a new transaction and return transaction hash.

**Request:**
```typescript
{
  from: string;      // Sender wallet address
  to: string;        // Recipient wallet address
  amount: string;    // Transaction amount in ETH
}
```

**Response:**
```typescript
{
  txHash: string;    // Generated transaction hash (0x...)
  timestamp: string; // ISO 8601 timestamp
}
```

#### POST /api/generate_signal

Generate hidden signal for a transaction.

**Request:**
```typescript
{
  txHash: string;        // Transaction hash to sign
  windowSeconds?: number; // Time window (default: 60)
}
```

**Response:**
```typescript
{
  signalCode: string;  // HMAC signature (16 chars)
  timestamp: string;   // Signal creation time
  expiresAt: string;   // Expiration time
}
```

#### POST /api/validate

Validate transaction with signal code.

**Request:**
```typescript
{
  txHash: string;      // Transaction hash
  signalCode: string;  // Signal to validate
  timestamp: string;   // Original signal timestamp
}
```

**Response:**
```typescript
{
  approved: boolean;   // Validation result
  reason: string;      // Approval/denial reason
}
```

#### GET /api/logs

Retrieve all validation logs.

**Response:**
```typescript
ValidationLog[] = [
  {
    id: string;
    txHash: string;
    signalCode: string;
    timestamp: string;
    result: {
      approved: boolean;
      reason: string;
    };
    validatedAt: string;
  }
]
```

#### DELETE /api/logs

Clear all validation logs (admin only).

**Response:**
```typescript
{
  success: boolean;
}
```

---

## 📁 Project Structure

```
echokey/
├── App.tsx                      # Main application with routing
├── README.md                    # This file
├── ARCHITECTURE.md              # Detailed architecture docs
├── DEPLOYMENT.md                # Deployment instructions
├── package.json                 # Dependencies
│
├── components/                  # React components
│   ├── WalletConnect.tsx        # Wallet connection UI
│   ├─�� TransactionForm.tsx      # Transaction creation form
│   ├── SignalGenerator.tsx      # Signal generation + countdown
│   ├── ValidationDisplay.tsx    # Validation results UI
│   ├── AdminPanel.tsx           # Admin logs panel
│   └── ui/                      # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── tabs.tsx
│       └── ...
│
├── pages/                       # Page components
│   ├── Home.tsx                 # Landing/onboarding page
│   ├── Dashboard.tsx            # Main transaction dashboard
│   └── Admin.tsx                # Admin panel page
│
├── services/                    # Business logic services
│   ├── api.ts                   # Mock API (LocalStorage)
│   ├── crypto.ts                # HMAC/signal generation
│   └── wallet.ts                # MetaMask integration
│
├── styles/
│   └── globals.css              # Global styles + theme
│
└── docker/                      # Docker configuration (optional)
    ├── Dockerfile
    └── docker-compose.yml
```

---

## 🎨 Turbulent Design System

EchoKey features a unique **turbulent card design system** with animated liquid borders that creates a premium, luxury aesthetic.

### Design Philosophy

The turbulent card effect uses SVG displacement filters to create flowing, animated borders that evoke:
- **Liquid luxury**: Smooth, flowing animations reminiscent of premium spirits
- **Technical sophistication**: Advanced SVG filter techniques
- **Security metaphor**: The constantly shifting borders represent dynamic, secure authentication

### Color Palette

```
Champagne Gold Primary:   #C9A961
Champagne Gold Secondary: #D4AF37
Platinum Silver:          #E5E7EB
Deep Charcoal Background: #0B0E1A
Card Background:          #14161F
```

### Implementation

The turbulent effect is created using:

```tsx
<TurbulentCard className="h-64" filterScale={25} glowIntensity="medium">
  <div className="text-center p-6">
    {/* Your content here */}
  </div>
</TurbulentCard>
```

**Key Features:**
- **SVG feTurbulence filters**: Creates natural noise patterns
- **Animated feOffset**: Makes the turbulence flow continuously
- **Multiple glow layers**: Adds depth with blur effects
- **Color-dodge blending**: Creates luminous border effects
- **Configurable intensity**: Adjust animation strength and glow

### Usage Throughout the App

- **Home Page**: Logo display and "How It Works" cards
- **Dashboard**: Transaction forms and signal validation panels
- **Admin Panel**: Statistics cards showing approval/denial metrics
- **Demo Page**: 4-card grid demonstrating the design system

---

## 🔒 Security

### Cryptographic Implementation

#### Signal Generation (HMAC-SHA256)

```typescript
// Pseudocode
secret_key = "ECHOKEY_SECRET_2025"
data = txHash + ":" + timestamp
signature = HMAC_SHA256(secret_key, data)
signal_code = signature[0:16].toUpperCase()
```

#### Validation Logic

```typescript
// Pseudocode
expected_signal = HMAC_SHA256(secret_key, txHash + ":" + timestamp)
time_elapsed = now - timestamp

if (signal_code !== expected_signal):
    return DENIED("Signal mismatch")
    
if (time_elapsed > window_seconds):
    return DENIED("Signal expired")
    
return APPROVED("Valid signal")
```

### Security Considerations

⚠️ **IMPORTANT**: This is a demonstration project.

**For Production:**
- Store secret keys in secure key management systems (AWS KMS, HashiCorp Vault)
- Use backend validation (don't expose HMAC keys to frontend)
- Implement rate limiting on validation endpoints
- Add multi-signature requirements for high-value transactions
- Use hardware security modules (HSM) for key storage
- Implement proper session management and CSRF protection
- Add transaction size limits and velocity checks
- Use secure WebSocket connections for real-time updates

**Current Implementation:**
- Secret key is client-side (demonstration only)
- LocalStorage for data (not suitable for production)
- No rate limiting or anti-replay protection
- Simplified wallet integration

---

## 🧪 Testing

### Manual Testing Steps

1. **Wallet Connection**
   - Connect MetaMask
   - Verify address display
   - Test disconnect/reconnect

2. **Transaction Flow**
   - Create transaction with valid address
   - Test invalid address validation
   - Verify tx_hash generation

3. **Signal Generation**
   - Generate signal
   - Verify countdown timer
   - Test signal expiration

4. **Validation**
   - Validate within time window → Should approve
   - Wait for expiration → Should deny
   - Regenerate signal → Should approve again

5. **Admin Panel**
   - View logs after validations
   - Check statistics accuracy
   - Test log clearing

### Test Cases

```typescript
// Example test scenarios
✅ Valid transaction within time window
✅ Expired signal rejection
✅ Invalid signal code rejection
✅ Multiple validation attempts
✅ Concurrent transactions
❌ Malformed addresses
❌ Negative amounts
❌ Signal tampering attempts
```

---

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions including:

- Docker deployment
- AWS deployment
- Vercel/Netlify deployment
- Environment configuration
- Production security checklist

---

## 🎓 Educational Use

This project was created for **educational purposes** to demonstrate:

- Web3 wallet integration patterns
- Cryptographic authentication flows
- React + TypeScript best practices
- Modern UI/UX design principles
- Component-driven architecture

**Suitable for:**
- Blockchain development courses
- Security engineering training
- Full-stack portfolio projects
- Hackathon submissions

---

## 📝 License

MIT License - Feel free to use this project for learning and development.

---

## 🤝 Contributing

Contributions welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📧 Contact

**Project Maintainer**: Your Name
**Email**: your.email@example.com
**GitHub**: [@yourusername](https://github.com/yourusername)

---

<div align="center">

**Built with ⚡ by the EchoKey Team**

*Securing the future of cryptocurrency transactions, one signal at a time.*

</div>
