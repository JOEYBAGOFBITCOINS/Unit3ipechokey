/**
 * SignalGenerator Component
 * 
 * Generates and displays the hidden signal (Channel 2) with countdown timer.
 * Features animated countdown and visual feedback.
 */

import { useState, useEffect } from 'react';
import { Shield, Clock, Copy, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { generateSignal } from '../services/api';
import { toast } from 'sonner@2.0.3';

interface SignalGeneratorProps {
  txHash: string;
  onSignalGenerated: (signalCode: string, timestamp: string) => void;
}

export function SignalGenerator({ txHash, onSignalGenerated }: SignalGeneratorProps) {
  const [signal, setSignal] = useState<{
    code: string;
    timestamp: string;
    expiresAt: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(60);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!signal) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      const expiresAt = new Date(signal.expiresAt).getTime();
      const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
      
      setTimeRemaining(remaining);
      
      if (remaining === 0) {
        toast.warning('Signal Expired', {
          description: 'Signal auto-refresh active - validation still available',
        });
        clearInterval(interval);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [signal]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // Use adaptive signal generation (chain defaults to "ethereum")
      const result = await generateSignal(txHash, "ethereum");
      
      // Calculate total window seconds for progress bar
      const expiresMs = new Date(result.expiresAt).getTime();
      const createdMs = new Date(result.timestamp).getTime();
      const windowSecs = Math.floor((expiresMs - createdMs) / 1000);
      
      setSignal({
        code: result.signalCode,
        timestamp: result.timestamp,
        expiresAt: result.expiresAt,
      });
      setTotalSeconds(windowSecs);
      
      toast.success('Signal Generated', {
        description: `Channel 2 active. Adaptive window: ${windowSecs}s`,
      });
      
      onSignalGenerated(result.signalCode, result.timestamp);
    } catch (error) {
      toast.error('Signal Generation Failed', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (signal) {
      navigator.clipboard.writeText(signal.code);
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const progressPercentage = totalSeconds > 0 ? (timeRemaining / totalSeconds) * 100 : 0;
  const isExpired = timeRemaining === 0 && signal !== null;

  return (
    <Card className="p-6 bg-white/[0.02] border-white/10 backdrop-blur-xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-lg"
              style={{ background: 'oklch(0.85 0.15 220 / 0.2)' }}
            >
              <Shield className="w-5 h-5" style={{ color: 'oklch(0.85 0.15 220)' }} />
            </div>
            <div>
              <h3 className="text-white">Hidden Signal</h3>
              <p className="text-sm text-white/50">Channel 2 Authentication</p>
            </div>
          </div>
          
          {!signal && (
            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="hover:opacity-90 border-0"
              style={{ 
                background: 'linear-gradient(90deg, oklch(0.85 0.15 220), rgba(180, 220, 255, 0.8))',
                color: 'oklch(0.145 0 0)'
              }}
            >
              {loading ? 'Generating...' : 'Generate Signal'}
            </Button>
          )}
        </div>
        
        {signal && (
          <div className="space-y-4">
            {/* Signal Code Display */}
            <div className="relative">
              <div 
                className={`p-6 rounded-lg border-2 transition-all ${
                  isExpired 
                    ? 'bg-red-500/10 border-red-500/50' 
                    : 'bg-[#0B0E1A]'
                }`}
                style={{
                  borderColor: isExpired ? undefined : 'oklch(0.85 0.15 220)',
                  boxShadow: isExpired ? 'none' : '0 0 20px rgba(180, 220, 255, 0.3)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-xs text-white/50 mb-2">SIGNAL CODE</div>
                    <div className="font-mono text-2xl text-white tracking-wider">
                      {signal.code}
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="text-[#C9A961] hover:text-white"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              
              {!isExpired && (
                <div 
                  className="absolute -inset-[2px] rounded-lg opacity-50 blur-sm -z-10"
                  style={{
                    background: 'linear-gradient(45deg, #C9A961, #D4AF37)',
                    animation: 'pulse 2s ease-in-out infinite',
                  }}
                />
              )}
            </div>
            
            {/* Countdown Timer */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-white/50">
                  <Clock className="w-4 h-4" />
                  <span>Time Remaining</span>
                </div>
                <span className={`font-mono ${isExpired ? 'text-red-400' : 'text-[#C9A961]'}`}>
                  {isExpired ? 'EXPIRED' : `${timeRemaining}s`}
                </span>
              </div>
              
              <div className="relative">
                <Progress 
                  value={progressPercentage} 
                  className={`h-2 ${isExpired ? 'bg-red-500/20' : 'bg-[#0B0E1A]'}`}
                />
                {!isExpired && progressPercentage < 30 && (
                  <div 
                    className="absolute inset-0 h-2 rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #EF4444, #F59E0B)',
                      width: `${progressPercentage}%`,
                      animation: 'pulse 0.5s ease-in-out infinite',
                    }}
                  />
                )}
              </div>
            </div>
            
            {/* Regenerate Button (if expired) */}
            {isExpired && (
              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#C9A961] to-[#D4AF37] hover:opacity-90 border-0 text-[#0B0E1A]"
              >
                Generate New Signal
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
