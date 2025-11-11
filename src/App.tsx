/**
 * EchoKey - Split-Signal Authentication Platform
 * 
 * Main application component with routing and wallet state management.
 */

import { useState, useEffect, useRef } from 'react';
import { Shield, Settings } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { Button } from './components/ui/button';
import { WalletConnect } from './components/WalletConnect';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Admin } from './pages/Admin';
import { Documentation } from './pages/Documentation';
import { TurbulentDemo } from './pages/TurbulentDemo';
import { getWalletState, type WalletState } from './services/wallet';
import logo from 'figma:asset/51bb8037ccf5b2028c092850295b2d3f527abcd0.png';
import bgImage from 'figma:asset/4931a3fa57ec626909eefbf0afc799847a94e075.png';

type Page = 'home' | 'dashboard' | 'admin' | 'documentation' | 'demo';

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [walletState, setWalletState] = useState<WalletState>({
    connected: false,
    address: null,
    chainId: null,
    balance: null,
  });
  
  // Use ref to track previous connection state without stale closures
  const previouslyConnectedRef = useRef(false);

  // Show splash screen for 10 seconds on initial load
  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 10000); // 10 seconds

    return () => clearTimeout(splashTimer);
  }, []);

  // Check wallet connection on mount and listen for changes
  useEffect(() => {
    checkWallet();
    
    // Listen for wallet connection events
    const handleWalletConnected = (e: CustomEvent) => {
      setWalletState(e.detail);
      setCurrentPage('dashboard');
    };
    
    // Listen for wallet disconnection events
    const handleWalletDisconnected = () => {
      setWalletState({
        connected: false,
        address: null,
        chainId: null,
        balance: null,
      });
      previouslyConnectedRef.current = false;
    };
    
    window.addEventListener('walletConnected', handleWalletConnected as EventListener);
    window.addEventListener('walletDisconnected', handleWalletDisconnected as EventListener);
    
    // Poll for wallet state changes every 5 seconds (for external changes)
    // Reduced frequency to avoid excessive RPC calls
    const interval = setInterval(() => {
      checkWallet();
    }, 5000);
    
    return () => {
      window.removeEventListener('walletConnected', handleWalletConnected as EventListener);
      window.removeEventListener('walletDisconnected', handleWalletDisconnected as EventListener);
      clearInterval(interval);
    };
  }, []);

  const checkWallet = async () => {
    const state = await getWalletState();
    const wasConnected = previouslyConnectedRef.current;
    
    setWalletState(state);
    
    // Only auto-navigate when wallet JUST connected (not already connected)
    // This allows users to manually navigate with Back button
    if (state.connected && !wasConnected) {
      setCurrentPage('dashboard');
    }
    
    // Update ref for next check
    previouslyConnectedRef.current = state.connected;
  };

  const handleGetStarted = () => {
    if (walletState.connected) {
      setCurrentPage('dashboard');
    } else {
      // Wallet connect will be shown in header
      setCurrentPage('dashboard');
    }
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const handleGoToAdmin = () => {
    setCurrentPage('admin');
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
  };

  const handleViewDocumentation = () => {
    setCurrentPage('documentation');
  };

  // Show splash screen for first 10 seconds
  if (showSplash) {
    return <TurbulentDemo />;
  }

  return (
    <div className="min-h-screen dark relative" style={{ background: 'oklch(0.145 0 0)' }}>
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.15,
        }}
      />
      
      {/* Dark overlay for better readability */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          background: 'linear-gradient(to bottom, oklch(0.145 0 0 / 0.85), oklch(0.145 0 0 / 0.95))',
        }}
      />
      
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm fixed top-0 left-0 right-0 z-50" style={{ background: 'oklch(0.185 0 0 / 0.8)' }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={handleBackToHome}
            className="flex items-center gap-3 hover:opacity-90 transition-all duration-300 group"
          >
            <div className="relative">
              <img 
                src={logo} 
                alt="EchoKey" 
                className="h-8 md:h-10 w-auto relative z-10 transition-transform duration-300 group-hover:scale-105"
                style={{
                  filter: 'drop-shadow(0 0 20px rgba(180, 220, 255, 0.4)) drop-shadow(0 0 40px rgba(180, 220, 255, 0.2))',
                }}
              />
            </div>
            <div className="hidden md:block">
              <div className="text-xs" style={{ color: 'oklch(0.85 0.15 220)' }}>Split-Signal Auth</div>
            </div>
          </button>
          
          {/* Navigation & Wallet */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage('demo')}
              className="text-white/60 hover:text-white hover:bg-white/5"
            >
              Demo
            </Button>
            
            {currentPage === 'dashboard' && walletState.connected && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGoToAdmin}
                className="text-white/60 hover:text-white hover:bg-white/5"
              >
                <Settings className="w-4 h-4 mr-2" />
                Admin
              </Button>
            )}
            
            {currentPage !== 'home' && currentPage !== 'demo' && <WalletConnect />}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="pt-20 relative z-10">
        {currentPage === 'home' && (
          <Home 
            onGetStarted={handleGetStarted}
            onViewDocumentation={handleViewDocumentation}
          />
        )}
        
        {currentPage === 'dashboard' && walletState.connected && (
          <Dashboard
            walletAddress={walletState.address!}
            onBack={handleBackToHome}
          />
        )}
        
        {currentPage === 'dashboard' && !walletState.connected && (
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-6">
              <div className="inline-flex p-4 rounded-full bg-white/5">
                <Shield className="w-12 h-12" style={{ color: 'oklch(0.85 0.15 220)' }} />
              </div>
              <h2 className="text-3xl tracking-tight" style={{ color: 'oklch(0.985 0 0)' }}>Connect Your Wallet</h2>
              <p className="text-white/60">
                Please connect your MetaMask wallet to access the EchoKey dashboard and create secure transactions.
              </p>
              <div className="flex justify-center">
                <WalletConnect />
              </div>
            </div>
          </div>
        )}
        
        {currentPage === 'admin' && (
          <Admin onBack={handleBackToDashboard} />
        )}
        
        {currentPage === 'documentation' && (
          <Documentation />
        )}
        
        {currentPage === 'demo' && (
          <TurbulentDemo />
        )}
      </main>
      
      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1B1F3A',
            color: '#ffffff',
            border: '1px solid rgba(92, 106, 255, 0.3)',
          },
        }}
      />
      
      {/* Background Effects - Subtle glows on top of the image */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{
            background: 'radial-gradient(circle, oklch(0.85 0.15 220) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(180, 220, 255, 0.8) 0%, transparent 70%)',
          }}
        />
      </div>
    </div>
  );
}
