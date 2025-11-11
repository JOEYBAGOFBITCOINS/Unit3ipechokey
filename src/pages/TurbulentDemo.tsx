/**
 * Turbulent Card Demo - Showcasing the electric blue turbulent displacement effect
 */

import { TurbulentCard } from '../components/TurbulentCard';
import { GlassButton } from '../components/GlassButton';

export function TurbulentDemo() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: 'oklch(0.145 0 0)' }}>
      <div className="flex flex-col items-center justify-center">
        {/* Single Large Card */}
        <TurbulentCard width="350px" height="500px">
          <div className="flex flex-col h-full p-12 justify-center">
            {/* Top Section */}
            <div className="flex flex-col items-center text-center space-y-6">
              <GlassButton>#echokey</GlassButton>
              <p className="text-4xl" style={{ color: 'oklch(0.985 0 0)' }}>
                Split-Signal
                <br />
                Authentication
              </p>
              
              {/* Divider */}
              <hr 
                className="border-none h-px my-0 w-full"
                style={{
                  background: 'currentColor',
                  opacity: 0.1,
                  maskImage: 'linear-gradient(to right, transparent, black, transparent)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent, black, transparent)',
                }}
              />

              {/* Description */}
              <p className="opacity-50" style={{ color: 'oklch(0.985 0 0)' }}>
                Secure high-value crypto transfers with dual-channel verification. 
                Transactions paired with hidden time-bound signals.
              </p>
            </div>
          </div>
        </TurbulentCard>

        {/* Copyright Footer */}
        <footer className="mt-8 text-center text-sm opacity-60" style={{ color: 'oklch(0.985 0 0)' }}>
          &copy; 2025 EchoKey
        </footer>
      </div>
    </div>
  );
}
