/**
 * WalletConnect Component
 * 
 * Displays wallet connection status and provides connect/disconnect functionality.
 */

import { useState, useEffect } from 'react';
import { Wallet, LogOut, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { 
  connectWallet, 
  disconnectWallet, 
  getWalletState, 
  formatAddress,
  getChainName,
  getChainSymbol,
  isMetaMaskInstalled,
  onAccountsChanged,
  onChainChanged,
  type WalletState 
} from '../services/wallet';
import { getChain } from '../services/chains';
import { toast } from 'sonner@2.0.3';

export function WalletConnect() {
  const [walletState, setWalletState] = useState<WalletState>({
    connected: false,
    address: null,
    chainId: null,
    balance: null,
  });
  const [loading, setLoading] = useState(false);

  // Check wallet state on mount
  useEffect(() => {
    checkWalletConnection();
    
    // Listen for account/chain changes
    const unsubscribeAccounts = onAccountsChanged((accounts) => {
      if (accounts.length === 0) {
        setWalletState(disconnectWallet());
      } else {
        checkWalletConnection();
      }
    });
    
    const unsubscribeChain = onChainChanged((chainId) => {
      console.log('Chain changed to:', chainId);
      checkWalletConnection();
    });
    
    return () => {
      unsubscribeAccounts();
      unsubscribeChain();
    };
  }, []);

  const checkWalletConnection = async () => {
    const state = await getWalletState();
    setWalletState(state);
  };

  const handleConnect = async () => {
    // Prevent duplicate requests
    if (loading) {
      return;
    }
    
    if (!isMetaMaskInstalled()) {
      toast.error('MetaMask Not Found', {
        description: 'Please install MetaMask to use EchoKey',
      });
      return;
    }
    
    setLoading(true);
    try {
      const state = await connectWallet();
      setWalletState(state);
      
      // Dispatch custom event for app-wide state update
      window.dispatchEvent(new CustomEvent('walletConnected', { detail: state }));
      
      toast.success('Wallet Connected', {
        description: `Connected to ${formatAddress(state.address!)}`,
      });
    } catch (error: any) {
      // Handle user rejection silently
      if (error?.code === 4001) {
        toast.info('Connection Cancelled', {
          description: 'You cancelled the wallet connection request',
        });
      } 
      // Handle pending request error
      else if (error?.code === -32002) {
        toast.info('Request Pending', {
          description: 'Please check MetaMask - a connection request is already open',
        });
      } 
      else {
        toast.error('Connection Failed', {
          description: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    setWalletState(disconnectWallet());
    
    // Dispatch custom event for app-wide state update
    window.dispatchEvent(new CustomEvent('walletDisconnected'));
    
    toast.info('Wallet Disconnected', {
      description: 'You can now connect a different wallet',
    });
  };

  if (!walletState.connected) {
    return (
      <div className="flex items-center gap-4">
        {!isMetaMaskInstalled() && (
          <div className="flex items-center gap-2 text-sm" style={{ color: 'oklch(0.85 0.15 220)' }}>
            <AlertCircle className="w-4 h-4" />
            <span>MetaMask not detected</span>
          </div>
        )}
        <Button
          onClick={handleConnect}
          disabled={loading}
          className="hover:opacity-90 border-0"
          style={{ 
            background: 'linear-gradient(90deg, oklch(0.85 0.15 220), rgba(180, 220, 255, 0.8))',
            color: 'oklch(0.145 0 0)'
          }}
        >
          <Wallet className="w-4 h-4 mr-2" />
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      </div>
    );
  }

  const chainSymbol = walletState.chainId ? getChainSymbol(walletState.chainId) : 'ETH';
  const chainInfo = getChain(chainSymbol);

  return (
    <div className="flex items-center gap-4">
      <div className="hidden md:flex flex-col items-end gap-1">
        <div className="text-sm" style={{ color: 'oklch(0.85 0.15 220)' }}>
          {walletState.balance} {chainInfo?.symbol || 'ETH'}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-white/50">
          <span>{chainInfo?.icon}</span>
          <span>{walletState.chainId && getChainName(walletState.chainId)}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.05] border border-white/20">
        <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
        <span className="text-sm text-white">
          {formatAddress(walletState.address!)}
        </span>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleDisconnect}
        className="border-white/20 hover:bg-white/5"
        style={{ 
          borderColor: 'rgba(180, 220, 255, 0.3)'
        }}
      >
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  );
}
