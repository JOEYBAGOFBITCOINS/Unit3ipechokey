/**
 * Home Page - Onboarding
 * 
 * Landing page with project introduction and wallet connection.
 */

import { ArrowRight, Shield, Zap, Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { TurbulentCard } from '../components/TurbulentCard';
import { GlassButton } from '../components/GlassButton';
import { CHAIN_LIST } from '../services/chains';
import logo from 'figma:asset/51bb8037ccf5b2028c092850295b2d3f527abcd0.png';

interface HomeProps {
  onGetStarted: () => void;
  onViewDocumentation?: () => void;
}

export function Home({ onGetStarted, onViewDocumentation }: HomeProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-7xl w-full space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-sm tracking-wide text-white/60">PREMIUM CRYPTOCURRENCY SECURITY</span>
          </div>
          
          <div className="flex justify-center py-6">
            <TurbulentCard width="auto" height="auto" className="inline-block">
              <div className="flex items-center justify-center min-h-[200px] px-16 py-10 w-full">
                <img 
                  src={logo} 
                  alt="EchoKey" 
                  className="h-24 md:h-32 w-auto relative z-10"
                  style={{
                    filter: 'drop-shadow(0 0 30px rgba(180, 220, 255, 0.6)) drop-shadow(0 0 50px rgba(180, 220, 255, 0.3))',
                  }}
                />
              </div>
            </TurbulentCard>
          </div>
          
          <p className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
            Split-Signal Authentication Platform for High-Value Cryptocurrency Transfers
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Button
              onClick={onGetStarted}
              size="lg"
              className="border-0 px-8 transition-all duration-300"
              style={{ 
                background: 'linear-gradient(90deg, oklch(0.85 0.15 220), rgba(180, 220, 255, 0.8))',
                color: 'oklch(0.145 0 0)'
              }}
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="border-white/20 hover:bg-white/5 px-8 transition-all duration-300"
              style={{ 
                borderColor: 'rgba(180, 220, 255, 0.3)'
              }}
              onClick={onViewDocumentation}
            >
              View Documentation
            </Button>
          </div>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Dual-Channel Security */}
          <Card className="group relative p-8 bg-white/[0.02] backdrop-blur-xl border border-white/10 transition-all duration-500 overflow-hidden hover:border-[rgba(180,220,255,0.5)]">
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
              style={{ background: 'linear-gradient(to bottom right, oklch(0.85 0.15 220 / 0.05), transparent)' }}
            />
            
            <div className="relative z-10">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 border"
                style={{ 
                  background: 'linear-gradient(to bottom right, oklch(0.85 0.15 220 / 0.2), oklch(0.85 0.15 220 / 0.05))',
                  borderColor: 'oklch(0.85 0.15 220 / 0.2)'
                }}
              >
                <Shield className="w-7 h-7" style={{ color: 'oklch(0.85 0.15 220)' }} />
              </div>
              
              <h3 className="text-xl text-white mb-4">Dual-Channel Security</h3>
              
              <p className="text-white/60 leading-relaxed">
                Transactions require both blockchain confirmation (Channel 1) and time-bound hidden signal (Channel 2) for approval.
              </p>
            </div>
            
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </Card>
          
          {/* Real-Time Validation */}
          <Card className="group relative p-8 bg-white/[0.02] backdrop-blur-xl border border-white/10 transition-all duration-500 overflow-hidden hover:border-[rgba(180,220,255,0.5)]">
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: 'linear-gradient(to bottom right, oklch(0.85 0.15 220 / 0.05), transparent)' }}
            />
            
            <div className="relative z-10">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 border"
                style={{ 
                  background: 'linear-gradient(to bottom right, oklch(0.85 0.15 220 / 0.2), oklch(0.85 0.15 220 / 0.05))',
                  borderColor: 'oklch(0.85 0.15 220 / 0.2)'
                }}
              >
                <Zap className="w-7 h-7" style={{ color: 'oklch(0.85 0.15 220)' }} />
              </div>
              
              <h3 className="text-xl text-white mb-4">Real-Time Validation</h3>
              
              <p className="text-white/60 leading-relaxed">
                HMAC-based signal verification with configurable time windows ensures transactions are validated in real-time.
              </p>
            </div>
            
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </Card>
          
          {/* Audit Trail */}
          <Card className="group relative p-8 bg-white/[0.02] backdrop-blur-xl border border-white/10 transition-all duration-500 overflow-hidden hover:border-[rgba(180,220,255,0.5)]">
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: 'linear-gradient(to bottom right, oklch(0.85 0.15 220 / 0.05), transparent)' }}
            />
            
            <div className="relative z-10">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 border"
                style={{ 
                  background: 'linear-gradient(to bottom right, oklch(0.85 0.15 220 / 0.2), oklch(0.85 0.15 220 / 0.05))',
                  borderColor: 'oklch(0.85 0.15 220 / 0.2)'
                }}
              >
                <Lock className="w-7 h-7" style={{ color: 'oklch(0.85 0.15 220)' }} />
              </div>
              
              <h3 className="text-xl text-white mb-4">Audit Trail</h3>
              
              <p className="text-white/60 leading-relaxed">
                Complete transaction history with validation logs, approval status, and detailed reasoning for compliance.
              </p>
            </div>
            
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </Card>
        </div>
        
        {/* How It Works */}
        <Card className="relative p-10 bg-white/[0.02] backdrop-blur-xl border border-white/10 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          <h2 className="text-3xl text-white mb-10 text-center relative z-10 tracking-tight">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            <TurbulentCard width="100%" height="320px">
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4 p-8">
                  <div className="relative w-16 h-16 rounded-full mx-auto mb-4">
                    <div 
                      className="absolute inset-0 rounded-full blur-lg opacity-60"
                      style={{ background: 'radial-gradient(circle, oklch(0.85 0.15 220), transparent)' }}
                    />
                    <div 
                      className="relative w-full h-full rounded-full flex items-center justify-center text-2xl"
                      style={{ 
                        background: 'radial-gradient(circle at 30% 30%, oklch(0.9 0.15 220), oklch(0.75 0.15 220))',
                        color: 'oklch(0.985 0 0)',
                        boxShadow: '0 0 30px rgba(180, 220, 255, 0.3), inset 0 2px 10px rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      1
                    </div>
                  </div>
                  <h4 className="text-lg" style={{ color: 'oklch(0.985 0 0)' }}>Connect<br/>Wallet</h4>
                  <p className="text-sm text-white/50 leading-relaxed">
                    Link your MetaMask wallet to initiate transactions
                  </p>
                </div>
              </div>
            </TurbulentCard>
            
            <TurbulentCard width="100%" height="320px">
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4 p-8">
                  <div className="relative w-16 h-16 rounded-full mx-auto mb-4">
                    <div 
                      className="absolute inset-0 rounded-full blur-lg opacity-60"
                      style={{ background: 'radial-gradient(circle, oklch(0.85 0.15 220), transparent)' }}
                    />
                    <div 
                      className="relative w-full h-full rounded-full flex items-center justify-center text-2xl"
                      style={{ 
                        background: 'radial-gradient(circle at 30% 30%, oklch(0.9 0.15 220), oklch(0.75 0.15 220))',
                        color: 'oklch(0.985 0 0)',
                        boxShadow: '0 0 30px rgba(180, 220, 255, 0.3), inset 0 2px 10px rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      2
                    </div>
                  </div>
                  <h4 className="text-lg" style={{ color: 'oklch(0.985 0 0)' }}>Create<br/>Transaction</h4>
                  <p className="text-sm text-white/50 leading-relaxed">
                    Enter recipient address and amount to generate Channel 1
                  </p>
                </div>
              </div>
            </TurbulentCard>
            
            <TurbulentCard width="100%" height="320px">
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4 p-8">
                  <div className="relative w-16 h-16 rounded-full mx-auto mb-4">
                    <div 
                      className="absolute inset-0 rounded-full blur-lg opacity-60"
                      style={{ background: 'radial-gradient(circle, oklch(0.85 0.15 220), transparent)' }}
                    />
                    <div 
                      className="relative w-full h-full rounded-full flex items-center justify-center text-2xl"
                      style={{ 
                        background: 'radial-gradient(circle at 30% 30%, oklch(0.9 0.15 220), oklch(0.75 0.15 220))',
                        color: 'oklch(0.985 0 0)',
                        boxShadow: '0 0 30px rgba(180, 220, 255, 0.3), inset 0 2px 10px rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      3
                    </div>
                  </div>
                  <h4 className="text-lg" style={{ color: 'oklch(0.985 0 0)' }}>Generate<br/>Signal</h4>
                  <p className="text-sm text-white/50 leading-relaxed">
                    Produce hidden signal with countdown timer (Channel 2)
                  </p>
                </div>
              </div>
            </TurbulentCard>
            
            <TurbulentCard width="100%" height="320px">
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4 p-8">
                  <div className="relative w-16 h-16 rounded-full mx-auto mb-4">
                    <div 
                      className="absolute inset-0 rounded-full blur-lg opacity-60"
                      style={{ background: 'radial-gradient(circle, oklch(0.85 0.15 220), transparent)' }}
                    />
                    <div 
                      className="relative w-full h-full rounded-full flex items-center justify-center text-2xl"
                      style={{ 
                        background: 'radial-gradient(circle at 30% 30%, oklch(0.9 0.15 220), oklch(0.75 0.15 220))',
                        color: 'oklch(0.985 0 0)',
                        boxShadow: '0 0 30px rgba(180, 220, 255, 0.3), inset 0 2px 10px rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      4
                    </div>
                  </div>
                  <h4 className="text-lg" style={{ color: 'oklch(0.985 0 0)' }}>Validate</h4>
                  <p className="text-sm text-white/50 leading-relaxed">
                    Verify both channels for secure transaction approval
                  </p>
                </div>
              </div>
            </TurbulentCard>
          </div>
        </Card>
      </div>
    </div>
  );
}
