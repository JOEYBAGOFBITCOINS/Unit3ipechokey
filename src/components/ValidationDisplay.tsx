/**
 * ValidationDisplay Component
 * 
 * Displays validation results with animated feedback.
 * Shows approval/denial status with visual effects.
 */

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Loader2, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { validateTransaction } from '../services/api';
import { onBlockConfirmed } from '../services/blockchainSimulator';
import { toast } from 'sonner@2.0.3';

interface ValidationDisplayProps {
  txHash: string;
  signalCode: string;
  timestamp: string;
  onValidationComplete: (approved: boolean) => void;
}

export function ValidationDisplay({ 
  txHash, 
  signalCode, 
  timestamp,
  onValidationComplete 
}: ValidationDisplayProps) {
  const [validating, setValidating] = useState(false);
  const [result, setResult] = useState<{
    approved: boolean;
    reason: string;
  } | null>(null);
  const [showRipple, setShowRipple] = useState(false);

  // Listen for blockchain confirmations and auto-validate
  useEffect(() => {
    const unsubscribe = onBlockConfirmed(async (event) => {
      if (event.txHash === txHash && event.confirmed && !result) {
        console.log('🧩 Block confirmed:', event);
        console.log('⚡ Auto-validating transaction...');
        
        setValidating(true);
        setShowRipple(false);
        
        try {
          const validationResult = await validateTransaction(txHash, signalCode, timestamp);
          setResult(validationResult);
          setShowRipple(true);
          
          if (validationResult.approved) {
            toast.success('Transaction Approved', {
              description: validationResult.reason,
            });
          } else {
            toast.error('Transaction Denied', {
              description: validationResult.reason,
            });
          }
          
          onValidationComplete(validationResult.approved);
          
          // Hide ripple after animation
          setTimeout(() => setShowRipple(false), 2000);
        } catch (error) {
          toast.error('Validation Error', {
            description: error instanceof Error ? error.message : 'Unknown error',
          });
        } finally {
          setValidating(false);
        }
      }
    });

    return () => unsubscribe();
  }, [txHash, signalCode, timestamp, result, onValidationComplete]);

  const handleValidate = async () => {
    setValidating(true);
    setResult(null);
    setShowRipple(false);
    
    try {
      const validationResult = await validateTransaction(txHash, signalCode, timestamp);
      setResult(validationResult);
      setShowRipple(true);
      
      if (validationResult.approved) {
        toast.success('Transaction Approved', {
          description: validationResult.reason,
        });
      } else {
        toast.error('Transaction Denied', {
          description: validationResult.reason,
        });
      }
      
      onValidationComplete(validationResult.approved);
      
      // Hide ripple after animation
      setTimeout(() => setShowRipple(false), 2000);
    } catch (error) {
      toast.error('Validation Error', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setValidating(false);
    }
  };

  return (
    <Card className="p-6 bg-white/[0.02] border-white/10 backdrop-blur-xl">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div 
            className="p-2 rounded-lg"
            style={{ background: 'oklch(0.85 0.15 220 / 0.2)' }}
          >
            <Zap className="w-5 h-5" style={{ color: 'oklch(0.85 0.15 220)' }} />
          </div>
          <div>
            <h3 className="text-white">Validation</h3>
            <p className="text-sm text-white/50">Verify Split-Signal Authentication</p>
          </div>
        </div>
        
        {/* Validation Button */}
        {!result && (
          <Button
            onClick={handleValidate}
            disabled={validating || !signalCode}
            className="w-full hover:opacity-90 border-0"
            style={{ 
              background: 'linear-gradient(90deg, oklch(0.85 0.15 220), rgba(180, 220, 255, 0.8))',
              color: 'oklch(0.145 0 0)'
            }}
          >
            {validating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Validating...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Validate Transaction
              </>
            )}
          </Button>
        )}
        
        {/* Validation Result */}
        {result && (
          <div className="relative">
            <div
              className={`p-6 rounded-lg border-2 transition-all ${
                result.approved
                  ? 'bg-[#10B981]/10 border-[#10B981]'
                  : 'bg-[#EF4444]/10 border-[#EF4444]'
              }`}
              style={{
                boxShadow: result.approved
                  ? '0 0 30px rgba(16, 185, 129, 0.3)'
                  : '0 0 30px rgba(239, 68, 68, 0.3)',
              }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {result.approved ? (
                    <CheckCircle2 className="w-12 h-12 text-[#10B981]" />
                  ) : (
                    <XCircle className="w-12 h-12 text-[#EF4444]" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className={`text-xl mb-2 ${
                    result.approved ? 'text-[#10B981]' : 'text-[#EF4444]'
                  }`}>
                    {result.approved ? 'Transaction Approved' : 'Transaction Denied'}
                  </h4>
                  <p className="text-sm text-white/70">{result.reason}</p>
                  
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="text-xs text-white/50 mb-1">TRANSACTION HASH</div>
                    <div className="font-mono text-xs text-white/70 break-all">
                      {txHash}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Ripple Effect */}
            {showRipple && (
              <div
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={{
                  animation: 'ripple 2s ease-out',
                  border: `2px solid ${result.approved ? '#10B981' : '#EF4444'}`,
                }}
              />
            )}
          </div>
        )}
        
        {/* Try Again Button */}
        {result && (
          <Button
            onClick={handleValidate}
            variant="outline"
            className="w-full border-white/20 hover:bg-white/5"
            style={{ 
              borderColor: 'rgba(180, 220, 255, 0.3)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'oklch(0.85 0.15 220)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(180, 220, 255, 0.3)')}
          >
            Validate Again
          </Button>
        )}
      </div>
      
      <style>{`
        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </Card>
  );
}
