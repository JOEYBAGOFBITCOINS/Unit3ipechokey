# EchoKey Testing Guide

Comprehensive testing documentation for the EchoKey split-signal authentication platform.

---

## Table of Contents

1. [Testing Overview](#testing-overview)
2. [Manual Testing](#manual-testing)
3. [Test Cases](#test-cases)
4. [Security Testing](#security-testing)
5. [Performance Testing](#performance-testing)
6. [Browser Compatibility](#browser-compatibility)

---

## Testing Overview

### Testing Philosophy

EchoKey uses a **layered testing approach**:

```
┌─────────────────────────────────┐
│     Manual E2E Testing          │  ← Primary (Current)
├─────────────────────────────────┤
│     Integration Testing         │  ← Future
├─────────────────────────────────┤
│     Unit Testing                │  ← Future
└─────────────────────────────────┘
```

### Current Testing Status

✅ **Implemented**: Manual testing procedures
⏳ **Planned**: Automated unit tests
⏳ **Planned**: Integration tests
⏳ **Planned**: E2E automation (Playwright/Cypress)

---

## Manual Testing

### Pre-Testing Setup

```bash
# 1. Ensure clean state
localStorage.clear()

# 2. Install MetaMask
# Download from https://metamask.io

# 3. Setup test wallet
# Create new wallet or import test account
```

### Test Environment Checklist

- [ ] Browser: Chrome, Firefox, or Edge (latest)
- [ ] MetaMask extension installed and configured
- [ ] Test wallet with small amount of ETH (for network fees)
- [ ] Developer console open (F12) for debugging
- [ ] Network: Use testnet (Sepolia, Goerli) for safety

---

## Test Cases

### TC-001: Wallet Connection

**Objective**: Verify MetaMask wallet connection functionality

**Prerequisites**:
- MetaMask installed
- At least one account configured

**Steps**:
1. Open EchoKey application
2. Navigate to Home page
3. Click "Get Started"
4. Click "Connect Wallet" button
5. Approve connection in MetaMask popup
6. Verify wallet address displayed in header

**Expected Results**:
- ✅ MetaMask popup appears
- ✅ After approval, wallet address shown
- ✅ Balance displayed correctly
- ✅ Chain name displayed (e.g., "Ethereum Mainnet")
- ✅ Green status indicator visible
- ✅ Redirected to Dashboard

**Test Data**:
```
Test Wallet: (Use your test wallet)
Expected Format: 0x1234...5678
```

---

### TC-002: Transaction Creation (Valid Input)

**Objective**: Create transaction with valid recipient and amount

**Prerequisites**:
- Wallet connected
- On Dashboard page

**Steps**:
1. Enter valid recipient address in "Recipient Address" field
2. Enter valid amount in "Amount (ETH)" field
3. Click "Create Transaction"
4. Wait for processing
5. Verify transaction hash displayed

**Expected Results**:
- ✅ Form accepts valid Ethereum address
- ✅ Form accepts decimal amounts
- ✅ "Creating Transaction..." loading state shown
- ✅ Success toast notification appears
- ✅ Transaction hash (0x...) displayed in card
- ✅ "Channel 1 Active" indicator shown
- ✅ Transaction timestamp displayed

**Test Data**:
```javascript
// Valid test addresses
recipient: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
amount: "0.001"

recipient: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed"
amount: "1.5"
```

---

### TC-003: Transaction Creation (Invalid Input)

**Objective**: Verify form validation for invalid inputs

**Prerequisites**:
- Wallet connected
- On Dashboard page

**Steps**:
1. Enter invalid recipient address
2. Verify error message
3. Clear and enter valid address
4. Enter invalid amount (negative, zero, non-numeric)
5. Verify error message
6. Attempt to submit with errors
7. Verify submission blocked

**Expected Results**:
- ✅ Invalid address shows error: "Invalid Ethereum address format"
- ✅ Empty address shows error: "Recipient address is required"
- ✅ Invalid amount shows error: "Amount must be greater than 0"
- ✅ Empty amount shows error: "Amount is required"
- ✅ Submit button disabled when errors present
- ✅ Error messages displayed in red

**Test Data**:
```javascript
// Invalid addresses
"not-an-address"
"0xinvalid"
"12345"
""

// Invalid amounts
"-1"
"0"
"abc"
""
```

---

### TC-004: Signal Generation

**Objective**: Generate hidden signal for valid transaction

**Prerequisites**:
- Valid transaction created
- Transaction hash visible

**Steps**:
1. Switch to "Channel 2 - Signal" tab
2. Click "Generate Signal" button
3. Observe signal generation
4. Verify signal code displayed
5. Verify countdown timer starts
6. Monitor progress bar

**Expected Results**:
- ✅ "Generating..." loading state shown
- ✅ Signal code appears (16 characters, alphanumeric)
- ✅ Signal code format: uppercase hex (e.g., "A7F3C9E2D4B8A1C5")
- ✅ Countdown starts at 60 seconds
- ✅ Progress bar at 100%
- ✅ Progress bar decreases smoothly
- ✅ Success toast: "Signal Generated"
- ✅ Copy button visible and functional
- ✅ Neon glow effect on signal card

**Expected Signal Properties**:
```javascript
{
  signalCode: /^[A-F0-9]{16}$/,  // 16 hex chars
  timestamp: ISO 8601 format,
  expiresAt: timestamp + 60s
}
```

---

### TC-005: Signal Countdown

**Objective**: Verify countdown timer accuracy and expiration

**Prerequisites**:
- Signal generated

**Steps**:
1. Note starting time (60s)
2. Watch countdown decrement
3. Observe progress bar
4. Wait for expiration (or speed test by waiting 10s)
5. Verify expiration behavior

**Expected Results**:
- ✅ Timer counts down: 60 → 59 → 58...
- ✅ Updates every 100ms (smooth animation)
- ✅ Progress bar synchronized with timer
- ✅ When timer < 30s, progress bar turns orange/red
- ✅ At expiration (0s):
  - Timer shows "EXPIRED"
  - Signal card border turns red
  - Warning toast appears
  - "Generate New Signal" button appears

---

### TC-006: Validation (Approved)

**Objective**: Validate transaction within time window

**Prerequisites**:
- Transaction created
- Signal generated (unexpired)

**Steps**:
1. Switch to "Validation" tab
2. Click "Validate Transaction" button
3. Wait for validation
4. Observe result

**Expected Results**:
- ✅ "Validating..." loading state shown
- ✅ After ~600ms, result appears
- ✅ Green checkmark icon (✓)
- ✅ "Transaction Approved" heading in green
- ✅ Detailed reason shows elapsed time
- ✅ Transaction hash displayed
- ✅ Success toast notification
- ✅ Ripple animation effect
- ✅ Green glow around result card
- ✅ "Validate Again" button appears

**Expected Result Object**:
```javascript
{
  approved: true,
  reason: "Valid signal. Verified in 23.4s"
}
```

---

### TC-007: Validation (Denied - Expired)

**Objective**: Validate transaction after signal expiration

**Prerequisites**:
- Transaction created
- Signal generated and expired (wait 61+ seconds)

**Steps**:
1. Wait for signal to expire completely
2. Switch to "Validation" tab
3. Click "Validate Transaction"
4. Observe denial

**Expected Results**:
- ✅ Red X icon (✗)
- ✅ "Transaction Denied" heading in red
- ✅ Reason: "Signal expired. Elapsed: 61.2s / 60s"
- ✅ Error toast notification
- ✅ Red glow around result card
- ✅ Transaction hash still displayed

**Expected Result Object**:
```javascript
{
  approved: false,
  reason: "Signal expired. Elapsed: 61.2s / 60s"
}
```

---

### TC-008: Admin Panel - View Logs

**Objective**: View validation logs in admin panel

**Prerequisites**:
- At least one validation completed

**Steps**:
1. Click "Admin" button in header
2. Navigate to Admin page
3. Observe logs displayed
4. Verify log details
5. Check statistics

**Expected Results**:
- ✅ Logs displayed in reverse chronological order (newest first)
- ✅ Each log shows:
  - Approval/denial badge (green/red)
  - Transaction hash (truncated)
  - Signal code
  - Validation timestamp
  - Result reason
- ✅ Statistics cards show:
  - Total validations count
  - Approved count
  - Denied count
- ✅ "Refresh" button functional
- ✅ Logs scrollable if many entries

---

### TC-009: Admin Panel - Clear Logs

**Objective**: Clear all validation logs

**Prerequisites**:
- At least one log entry exists

**Steps**:
1. Navigate to Admin page
2. Click "Clear Logs" button
3. Confirm in browser confirmation dialog
4. Verify logs cleared

**Expected Results**:
- ✅ Browser confirmation dialog: "Are you sure..."
- ✅ After confirmation:
  - All logs disappear
  - "No Validation Logs" message shown
  - Statistics reset to 0
  - Success toast: "Logs cleared successfully"

---

### TC-010: Multiple Transactions

**Objective**: Test multiple concurrent transactions

**Prerequisites**:
- Wallet connected

**Steps**:
1. Create Transaction A
2. Generate Signal A
3. Validate Transaction A
4. Create Transaction B (new transaction)
5. Generate Signal B
6. Validate Transaction B
7. Check admin logs

**Expected Results**:
- ✅ Each transaction has unique tx_hash
- ✅ Each signal is unique
- ✅ Both validations successful
- ✅ Both logged in admin panel
- ✅ Statistics show 2 total validations
- ✅ No interference between transactions

---

### TC-011: Wallet Disconnection

**Objective**: Test wallet disconnection and reconnection

**Prerequisites**:
- Wallet connected

**Steps**:
1. Note current wallet address
2. Click disconnect button (logout icon)
3. Observe disconnection
4. Navigate to Dashboard
5. Attempt to reconnect
6. Verify state restoration

**Expected Results**:
- ✅ After disconnect:
  - "Connect Wallet" button appears
  - Wallet address removed
  - Redirected to connect prompt
- ✅ After reconnect:
  - Same address shown
  - Dashboard accessible
  - Previous transactions/logs preserved (localStorage)

---

### TC-012: Signal Regeneration

**Objective**: Regenerate signal after expiration

**Prerequisites**:
- Transaction created
- Signal expired

**Steps**:
1. Create transaction
2. Generate signal
3. Wait for expiration
4. Click "Generate New Signal"
5. Validate new signal

**Expected Results**:
- ✅ New signal code generated (different from first)
- ✅ New countdown starts at 60s
- ✅ New signal can be validated successfully
- ✅ Both signal generations logged separately

---

## Security Testing

### SEC-001: HMAC Integrity

**Objective**: Verify HMAC cannot be tampered

**Steps**:
1. Generate signal normally
2. Open browser DevTools → Application → LocalStorage
3. Find signal code in storage
4. Manually modify signal code (change one character)
5. Attempt validation

**Expected Result**:
- ❌ Validation DENIED
- Reason: "Signal code mismatch. Invalid signature."

### SEC-002: Time Window Enforcement

**Objective**: Verify time-bound validation

**Test Matrix**:
| Time Elapsed | Expected Result |
|--------------|----------------|
| 5s           | ✅ APPROVED     |
| 30s          | ✅ APPROVED     |
| 59s          | ✅ APPROVED     |
| 60s          | ✅ APPROVED (edge case) |
| 61s          | ❌ DENIED       |
| 120s         | ❌ DENIED       |

### SEC-003: Address Validation

**Objective**: Prevent invalid Ethereum addresses

**Test Addresses**:
```javascript
// Should be REJECTED
"0x123"                           // Too short
"0xGGGGGGGGGGGGGGGGGGGGGGGG..."  // Invalid hex
"not-an-address"                  // Not hex
"1234567890123456789012345..."   // Missing 0x prefix

// Should be ACCEPTED
"0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
"0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed"
```

---

## Performance Testing

### PERF-001: Transaction Generation Speed

**Objective**: Measure transaction creation performance

**Procedure**:
```javascript
const start = performance.now();
// Create transaction
const end = performance.now();
console.log(`TX Generation: ${end - start}ms`);
```

**Expected**: < 1000ms (including simulated delay)

### PERF-002: Signal Generation Speed

**Objective**: Measure HMAC generation performance

**Expected**: < 500ms

### PERF-003: Validation Speed

**Objective**: Measure validation performance

**Expected**: < 600ms

### PERF-004: UI Responsiveness

**Metrics to Check**:
- Page load time: < 3s
- Time to Interactive (TTI): < 4s
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s

---

## Browser Compatibility

### Supported Browsers

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | 90+ | ✅ Fully Supported | Recommended |
| Firefox | 88+ | ✅ Fully Supported | |
| Edge | 90+ | ✅ Fully Supported | Chromium-based |
| Safari | 14+ | ⚠️ Partial | Web Crypto API support |
| Opera | 76+ | ✅ Fully Supported | |
| Brave | Latest | ✅ Fully Supported | |

### Mobile Browsers

| Browser | Status | Notes |
|---------|--------|-------|
| Chrome Mobile | ✅ Supported | MetaMask via mobile app |
| Safari iOS | ⚠️ Limited | MetaMask browser required |
| Firefox Mobile | ✅ Supported | |

### Feature Detection Tests

```javascript
// Check Web Crypto API
if (window.crypto && window.crypto.subtle) {
  console.log('✅ Web Crypto API supported');
} else {
  console.log('❌ Web Crypto API NOT supported');
}

// Check LocalStorage
if (typeof localStorage !== 'undefined') {
  console.log('✅ LocalStorage supported');
} else {
  console.log('❌ LocalStorage NOT supported');
}

// Check MetaMask
if (typeof window.ethereum !== 'undefined') {
  console.log('✅ MetaMask detected');
} else {
  console.log('❌ MetaMask NOT detected');
}
```

---

## Test Data Repository

### Sample Ethereum Addresses

```javascript
export const TEST_ADDRESSES = {
  valid: [
    "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
    "0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359",
    "0xdbF03B407c01E7cD3CBea99509d93f8DDDC8C6FB",
    "0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb"
  ],
  invalid: [
    "not-an-address",
    "0x123",
    "0xGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
    "12345"
  ]
};

export const TEST_AMOUNTS = {
  valid: ["0.001", "1.5", "0.1", "10", "0.000001"],
  invalid: ["-1", "0", "abc", ""]
};
```

---

## Bug Reporting Template

When filing bugs, use this template:

```markdown
### Bug Report

**Title**: [Clear, concise title]

**Priority**: High / Medium / Low

**Environment**:
- Browser: Chrome 120
- OS: macOS 14
- MetaMask: v11.2.0

**Steps to Reproduce**:
1. Step one
2. Step two
3. Step three

**Expected Behavior**:
What should happen

**Actual Behavior**:
What actually happened

**Screenshots**:
[Attach if applicable]

**Console Errors**:
```
[Paste console output]
```

**Additional Context**:
Any other relevant information
```

---

## Test Coverage Goals

### Current Coverage

```
Component Testing:    0% (Future)
Service Testing:      0% (Future)
Integration Testing:  0% (Future)
Manual Testing:      90%
```

### Target Coverage (Future)

```
Component Testing:   80%
Service Testing:     90%
Integration Testing: 70%
E2E Testing:        60%
```

---

## Continuous Testing Checklist

Before each release:

- [ ] All manual test cases pass
- [ ] No console errors
- [ ] Wallet connection works
- [ ] Transaction flow complete
- [ ] Signal generation successful
- [ ] Validation logic correct
- [ ] Admin panel functional
- [ ] LocalStorage persists correctly
- [ ] Responsive on mobile
- [ ] Cross-browser tested
- [ ] Performance metrics acceptable
- [ ] Security tests pass

---

## Future Test Automation

### Planned Tools

- **Unit Tests**: Vitest + React Testing Library
- **E2E Tests**: Playwright or Cypress
- **Visual Regression**: Percy or Chromatic
- **Performance**: Lighthouse CI
- **Security**: OWASP ZAP

### Example Unit Test (Future)

```typescript
// crypto.test.ts
import { describe, it, expect } from 'vitest';
import { generateSignalCode, validateSignal } from './crypto';

describe('Signal Generation', () => {
  it('should generate 16-character signal', async () => {
    const signal = await generateSignalCode('0xabc123', '2025-11-05T12:00:00Z');
    expect(signal).toMatch(/^[A-F0-9]{16}$/);
  });

  it('should be deterministic', async () => {
    const signal1 = await generateSignalCode('0xabc', '2025-11-05T12:00:00Z');
    const signal2 = await generateSignalCode('0xabc', '2025-11-05T12:00:00Z');
    expect(signal1).toBe(signal2);
  });
});
```

---

## Conclusion

This testing guide ensures EchoKey maintains high quality and reliability. As the project evolves, automated tests will supplement manual testing for comprehensive coverage.

For questions or to report issues, please use GitHub Issues or contact the development team.
