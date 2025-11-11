/**
 * TransactionForm Component - Auto-Detect Network
 * 
 * Form for creating a new transaction with recipient and amount.
 * Automatically detects blockchain network from connected wallet.
 * Generates Channel 1 (transaction hash) when submitted.
 */

import { useState, useEffect } from 'react';
import { Send, Loader2, Network } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { generateTransaction, startSignalRefresh } from '../services/api';
import { simulateConfirmation } from '../services/blockchainSimulator';
import { getChain, isValidChainAddress } from '../services/chains';
import { getChainSymbol } from '../services/wallet';
import { toast } from 'sonner@2.0.3';

interface TransactionFormProps {
  senderAddress: string;
  onTransactionCreated: (txHash: string, timestamp: string, chain: string) => void;
}

export function TransactionForm({ senderAddress, onTransactionCreated }: TransactionFormProps) {
  const [chain, setChain] = useState('ETH');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ recipient?: string; amount?: string }>({});

  // Auto-detect network from wallet
  useEffect(() => {
    const detectNetwork = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          console.log('TransactionForm: Detected chainId:', chainId);
          const detectedChain = getChainSymbol(chainId);
          console.log('TransactionForm: Setting chain to:', detectedChain);
          setChain(detectedChain);
        } catch (error) {
          console.error('Failed to detect network:', error);
        }
      }
    };

    detectNetwork();

    // Listen for network changes
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleChainChanged = (chainId: string) => {
        console.log('TransactionForm: Chain changed event, chainId:', chainId);
        const detectedChain = getChainSymbol(chainId);
        console.log('TransactionForm: Setting chain to:', detectedChain);
        setChain(detectedChain);
        toast.info('Network Changed', {
          description: `Switched to ${getChain(detectedChain)?.name}`,
        });
      };

      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum && window.ethereum.removeListener) {
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, []);

  // Also listen to wallet connection events
  useEffect(() => {
    const handleWalletConnected = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          const detectedChain = getChainSymbol(chainId);
          setChain(detectedChain);
        } catch (error) {
          console.error('Failed to detect network:', error);
        }
      }
    };

    window.addEventListener('walletConnected', handleWalletConnected);

    return () => {
      window.removeEventListener('walletConnected', handleWalletConnected);
    };
  }, []);

  const selectedChain = getChain(chain);

  const validateForm = (): boolean => {
    const newErrors: { recipient?: string; amount?: string } = {};
    
    if (!recipient) {
      newErrors.recipient = 'Recipient address is required';
    } else if (!isValidChainAddress(recipient, chain)) {
      newErrors.recipient = `Invalid ${selectedChain?.name} address format`;
    }
    
    if (!amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      const { txHash, timestamp } = await generateTransaction(
        senderAddress,
        recipient,
        amount,
        chain
      );
      
      // Start background services (runs invisibly)
      simulateConfirmation(txHash, chain);  // Simulate delayed blockchain confirmation
      startSignalRefresh(txHash, chain);    // Keep off-chain signal alive during confirmation
      
      toast.success('Transaction Created', {
        description: `Channel 1 initialized on ${selectedChain?.name}. Proceed to generate signal.`,
      });
      
      onTransactionCreated(txHash, timestamp, chain);
      
      // Reset form
      setRecipient('');
      setAmount('');
      setErrors({});
    } catch (error) {
      toast.error('Transaction Failed', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-white/[0.02] border-white/10 backdrop-blur-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Network Display (Auto-Detected) */}
        <div className="flex items-center gap-3 p-4 rounded-lg bg-white/[0.02] border border-white/10">
          <Network className="w-5 h-5" style={{ color: 'oklch(0.85 0.15 220)' }} />
          <div className="flex-1">
            <div className="text-sm text-white/50">Connected Network</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-white">{selectedChain?.icon}</span>
              <span className="text-white">{selectedChain?.name}</span>
              <Badge 
                className="text-xs ml-2"
                style={{ 
                  background: 'rgba(180, 220, 255, 0.15)',
                  color: 'oklch(0.85 0.15 220)',
                  border: '1px solid rgba(180, 220, 255, 0.3)'
                }}
              >
                {selectedChain?.symbol}
              </Badge>
            </div>
          </div>
        </div>

        {/* Recipient Address */}
        <div>
          <Label htmlFor="recipient" className="text-white/90">
            Recipient Address
          </Label>
          <Input
            id="recipient"
            type="text"
            placeholder={selectedChain?.exampleAddress.substring(0, 20) + '...'}
            value={recipient}
            onChange={(e) => {
              setRecipient(e.target.value);
              if (errors.recipient) {
                setErrors({ ...errors, recipient: undefined });
              }
            }}
            className={`mt-2 border-white/20 text-white placeholder:text-white/30 ${
              errors.recipient ? 'border-red-500' : ''
            }`}
            style={{ 
              background: 'oklch(0.145 0 0)',
              borderColor: errors.recipient ? '#EF4444' : 'rgba(180, 220, 255, 0.3)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'oklch(0.85 0.15 220)'}
            onBlur={(e) => { if (!errors.recipient) e.target.style.borderColor = 'rgba(180, 220, 255, 0.3)'; }}
          />
          {errors.recipient && (
            <p className="mt-1 text-sm text-red-400">{errors.recipient}</p>
          )}
        </div>
        
        {/* Amount */}
        <div>
          <Label htmlFor="amount" className="text-white/90">
            Amount ({selectedChain?.symbol})
          </Label>
          <Input
            id="amount"
            type="text"
            placeholder="0.00"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              if (errors.amount) {
                setErrors({ ...errors, amount: undefined });
              }
            }}
            className={`mt-2 border-white/20 text-white placeholder:text-white/30 ${
              errors.amount ? 'border-red-500' : ''
            }`}
            style={{ 
              background: 'oklch(0.145 0 0)',
              borderColor: errors.amount ? '#EF4444' : 'rgba(180, 220, 255, 0.3)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'oklch(0.85 0.15 220)'}
            onBlur={(e) => { if (!errors.amount) e.target.style.borderColor = 'rgba(180, 220, 255, 0.3)'; }}
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-400">{errors.amount}</p>
          )}
        </div>
        
        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full hover:opacity-90 border-0"
          style={{ 
            background: 'linear-gradient(90deg, oklch(0.85 0.15 220), rgba(180, 220, 255, 0.8))',
            color: 'oklch(0.145 0 0)'
          }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating Transaction...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Create Transaction
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
