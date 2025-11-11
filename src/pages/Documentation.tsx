import { Shield, Lock, Zap, CheckCircle } from 'lucide-react';

export function Documentation() {
  return (
    <div className="min-h-screen bg-[#0B0E1A]">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-[#C9A961]/5 to-transparent" />
        <div className="max-w-6xl mx-auto px-6 py-24 relative">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-sm tracking-wide text-white/60">TECHNICAL DOCUMENTATION</span>
            </div>
            
            <h1 className="text-6xl text-white tracking-tight">
              EchoKey Protocol
            </h1>
            
            <p className="text-xl text-white/50 max-w-2xl mx-auto tracking-wide">
              Split-Signal Authentication for High-Value Digital Asset Transfers
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-16">
        
        {/* Executive Summary */}
        <section className="space-y-6">
          <h2 className="text-4xl text-white tracking-tight">Executive Summary</h2>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#C9A961]/10 to-[#D4AF37]/5 rounded-2xl blur-2xl" />
            <div className="relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-10">
              <p className="text-lg text-white/70 leading-relaxed">
                EchoKey is a dual-layer security framework for digital asset transactions. Traditional blockchain approvals rely on a single verification source, leaving them vulnerable to key theft and automation attacks. EchoKey adds a synchronized off-chain signal, requiring two independent confirmations before any transfer is approved.
              </p>
            </div>
          </div>
        </section>

        {/* Core Architecture */}
        <section className="space-y-8">
          <h2 className="text-4xl text-white tracking-tight">Core Architecture</h2>
          
          <div className="grid gap-6">
            {/* Dual Verification */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#C9A961]/5 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:border-white/20">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#C9A961]/20 to-[#C9A961]/5 flex items-center justify-center flex-shrink-0 border border-[#C9A961]/20">
                    <Shield className="w-7 h-7 text-[#C9A961]" />
                  </div>
                  <div className="space-y-4 flex-1">
                    <h3 className="text-2xl text-white tracking-tight">Dual Verification Channels</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-1 h-1 rounded-full bg-[#C9A961] mt-2.5 flex-shrink-0" />
                        <p className="text-white/60 leading-relaxed">
                          <span className="text-white/90">Primary:</span> Standard blockchain transaction signature.
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-1 h-1 rounded-full bg-[#D4AF37] mt-2.5 flex-shrink-0" />
                        <p className="text-white/60 leading-relaxed">
                          <span className="text-white/90">Secondary:</span> Encrypted, time-bound off-chain signal.
                        </p>
                      </div>
                    </div>
                    <p className="text-white/50 leading-relaxed pt-2">
                      Both must align within seconds for a transfer to execute, blocking unauthorized or delayed requests.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Immutable Records */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#E5E7EB]/5 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:border-white/20">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#E5E7EB]/20 to-[#E5E7EB]/5 flex items-center justify-center flex-shrink-0 border border-[#E5E7EB]/20">
                    <Lock className="w-7 h-7 text-[#E5E7EB]" />
                  </div>
                  <div className="space-y-4 flex-1">
                    <h3 className="text-2xl text-white tracking-tight">Immutable Verification Records</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-1 h-1 rounded-full bg-[#C9A961] mt-2.5 flex-shrink-0" />
                        <p className="text-white/60 leading-relaxed">
                          Each event generates a cryptographic proof of authorization.
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-1 h-1 rounded-full bg-[#D4AF37] mt-2.5 flex-shrink-0" />
                        <p className="text-white/60 leading-relaxed">
                          No keys or personal data are stored; validation occurs entirely through transient digital signatures.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Zero-Trust */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#F59E0B]/5 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:border-white/20">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#F59E0B]/20 to-[#F59E0B]/5 flex items-center justify-center flex-shrink-0 border border-[#F59E0B]/20">
                    <Zap className="w-7 h-7 text-[#F59E0B]" />
                  </div>
                  <div className="space-y-4 flex-1">
                    <h3 className="text-2xl text-white tracking-tight">Zero-Trust Protocol</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-1 h-1 rounded-full bg-[#C9A961] mt-2.5 flex-shrink-0" />
                        <p className="text-white/60 leading-relaxed">
                          EchoKey authenticates actions, not identities.
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-1 h-1 rounded-full bg-[#D4AF37] mt-2.5 flex-shrink-0" />
                        <p className="text-white/60 leading-relaxed">
                          No device or network is presumed secure. Every confirmation must stand on mathematical proof.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Advantages */}
        <section className="space-y-8">
          <h2 className="text-4xl text-white tracking-tight">Security Advantages</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: CheckCircle,
                color: '#C9A961',
                title: 'Key Compromise Protection',
                description: 'Even if a wallet key is exposed, the attacker cannot act without the off-chain signal.'
              },
              {
                icon: CheckCircle,
                color: '#E5E7EB',
                title: 'Anti-Automation Defense',
                description: 'Short verification windows eliminate replay and front-running exploits.'
              },
              {
                icon: CheckCircle,
                color: '#F59E0B',
                title: 'Compliance and Auditability',
                description: 'Each transaction produces a tamper-evident validation record.'
              },
              {
                icon: CheckCircle,
                color: '#D4AF37',
                title: 'Multi-Chain Support',
                description: 'Auto-detects network from wallet. Works with Ethereum, Bitcoin, Solana, Polygon, Avalanche, BNB Chain, and more.'
              }
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-white/20">
                  <div className="flex items-start gap-4">
                    <item.icon className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: item.color }} />
                    <div className="space-y-2">
                      <h3 className="text-lg text-white">{item.title}</h3>
                      <p className="text-white/60 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Operational Flow */}
        <section className="space-y-8">
          <h2 className="text-4xl text-white tracking-tight">Operational Flow</h2>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#C9A961]/10 to-[#D4AF37]/5 rounded-2xl blur-2xl" />
            <div className="relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-10">
              <div className="space-y-6">
                {[
                  'Executive-grade wallet authentication establishes secure connection.',
                  'Institutional-level transaction parameters are configured with precision.',
                  'EchoKey deploys cryptographic dual-channel verification protocol.',
                  'Multi-layer validation synchronizes across protected time windows.',
                  'Unauthorized transfer attempts are eliminated through automated expiration.'
                ].map((step, index) => (
                  <div key={index} className="flex items-start gap-5">
                    <div className="relative w-2 h-2 rounded-full bg-gradient-to-r from-[#C9A961] to-[#D4AF37] flex-shrink-0 mt-2">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#C9A961] to-[#D4AF37] blur-md opacity-60" />
                    </div>
                    <p className="text-lg text-white/70 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section className="pb-16">
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#C9A961]/10 via-[#D4AF37]/10 to-[#C9A961]/10 rounded-2xl blur-3xl" />
            <div className="relative bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-xl border border-white/20 rounded-2xl p-12">
              <div className="text-center space-y-4">
                <p className="text-2xl text-white/90 leading-relaxed max-w-4xl mx-auto tracking-wide">
                  EchoKey transforms digital asset security from reactive to preemptive, ensuring that only fully verified, time-synchronized transactions can clear, even in compromised environments.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
