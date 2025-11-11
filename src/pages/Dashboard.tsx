/**
 * Dashboard Page
 * 
 * Main transaction interface with signal generation and validation.
 */

import { useState, useEffect } from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { TransactionForm } from '../components/TransactionForm';
import { ValidationDisplay } from '../components/ValidationDisplay';
import { TurbulentCard } from '../components/TurbulentCard';
import { formatAddress } from '../services/wallet';
import { generateSignal } from '../services/api';
import { getChain } from '../services/chains';
import { Badge } from '../components/ui/badge';

interface DashboardProps {
  walletAddress: string;
  onBack: () => void;
}

export function Dashboard({ walletAddress, onBack }: DashboardProps) {
  const [currentTx, setCurrentTx] = useState<{
    txHash: string;
    timestamp: string;
    chain: string;
  } | null>(null);
  
  const [currentSignal, setCurrentSignal] = useState<{
    signalCode: string;
    timestamp: string;
  } | null>(null);

  const handleTransactionCreated = async (txHash: string, timestamp: string, chain: string) => {
    setCurrentTx({ txHash, timestamp, chain });
    setCurrentSignal(null);
    
    // Automatically generate signal after transaction is created
    try {
      const result = await generateSignal(txHash, chain);
      setCurrentSignal({ signalCode: result.signalCode, timestamp: result.timestamp });
    } catch (error) {
      console.error('Failed to auto-generate signal:', error);
    }
  };

  const handleSignalGenerated = (signalCode: string, timestamp: string) => {
    setCurrentSignal({ signalCode, timestamp });
  };

  const handleValidationComplete = (approved: boolean) => {
    console.log('Validation complete:', approved);
  };

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-white/60 hover:text-white hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="text-right">
            <div className="text-sm text-white/50">Connected Wallet</div>
            <div className="text-white font-mono">{formatAddress(walletAddress)}</div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h2 className="text-3xl text-white mb-2 tracking-tight">Create Transaction</h2>
            <p className="text-white/50">Secure crypto transfer with split-signal authentication</p>
          </div>
          
          {/* Transaction Form */}
          <div className="relative">
            <TurbulentCard width="100%" height="auto">
              <div className="p-8">
                <TransactionForm
                  senderAddress={walletAddress}
                  onTransactionCreated={handleTransactionCreated}
                />
              </div>
            </TurbulentCard>
          </div>
          
          {/* Transaction Info */}
          {currentTx && (
            <Card className="p-5 bg-white/[0.02] border-white/10 backdrop-blur-xl">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: 'oklch(0.85 0.15 220)' }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-sm text-white/60">Transaction Hash (Channel 1)</div>
                      <Badge 
                        className="text-xs"
                        style={{ 
                          background: 'rgba(180, 220, 255, 0.15)',
                          color: 'oklch(0.85 0.15 220)',
                          border: '1px solid rgba(180, 220, 255, 0.3)'
                        }}
                      >
                        {getChain(currentTx.chain)?.icon} {getChain(currentTx.chain)?.name}
                      </Badge>
                    </div>
                    <div className="text-xs font-mono text-white break-all">
                      {currentTx.txHash}
                    </div>
                    <div className="text-xs text-white/40 mt-1">
                      Created: {new Date(currentTx.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                
                {currentSignal && (
                  <div className="pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                      <span>Signal active • Blockchain confirmation in progress</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
          
          {/* Validation Display - Auto-shows when signal is generated */}
          {currentTx && currentSignal && (
            <>
              <div className="pt-4">
                <h2 className="text-3xl text-white mb-2 tracking-tight">Validation</h2>
                <p className="text-white/50">Automatic validation on blockchain confirmation</p>
              </div>
              
              <div className="relative">
                <TurbulentCard width="100%" height="auto">
                  <div className="p-8">
                    <ValidationDisplay
                      txHash={currentTx.txHash}
                      signalCode={currentSignal.signalCode}
                      timestamp={currentSignal.timestamp}
                      onValidationComplete={handleValidationComplete}
                    />
                  </div>
                </TurbulentCard>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
