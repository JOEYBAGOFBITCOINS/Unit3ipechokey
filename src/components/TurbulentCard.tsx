/**
 * TurbulentCard - Animated card with turbulent displacement effect
 * 
 * Creates a liquid, flowing border effect with electric blue colors
 * Wraps content with visible glowing turbulent border
 */

interface TurbulentCardProps {
  children: React.ReactNode;
  className?: string;
  width?: string;
  height?: string;
}

export function TurbulentCard({ 
  children, 
  className = '',
  width = '100%',
  height = 'auto'
}: TurbulentCardProps) {
  const filterId = `turbulent-displace-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <>
      {/* SVG Filter Definition */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter 
            id={filterId} 
            colorInterpolationFilters="sRGB" 
            x="-50%" 
            y="-50%" 
            width="200%" 
            height="200%"
          >
            <feTurbulence 
              type="turbulence" 
              baseFrequency="0.02" 
              numOctaves="10" 
              result="noise1" 
              seed="1" 
            />
            <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
              <animate 
                attributeName="dy" 
                values="700; 0" 
                dur="6s" 
                repeatCount="indefinite" 
                calcMode="linear" 
              />
            </feOffset>

            <feTurbulence 
              type="turbulence" 
              baseFrequency="0.02" 
              numOctaves="10" 
              result="noise2" 
              seed="1" 
            />
            <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
              <animate 
                attributeName="dy" 
                values="0; -700" 
                dur="6s" 
                repeatCount="indefinite" 
                calcMode="linear" 
              />
            </feOffset>

            <feTurbulence 
              type="turbulence" 
              baseFrequency="0.02" 
              numOctaves="10" 
              result="noise1" 
              seed="2" 
            />
            <feOffset in="noise1" dx="0" dy="0" result="offsetNoise3">
              <animate 
                attributeName="dx" 
                values="490; 0" 
                dur="6s" 
                repeatCount="indefinite" 
                calcMode="linear" 
              />
            </feOffset>

            <feTurbulence 
              type="turbulence" 
              baseFrequency="0.02" 
              numOctaves="10" 
              result="noise2" 
              seed="2" 
            />
            <feOffset in="noise2" dx="0" dy="0" result="offsetNoise4">
              <animate 
                attributeName="dx" 
                values="0; -490" 
                dur="6s" 
                repeatCount="indefinite" 
                calcMode="linear" 
              />
            </feOffset>

            <feComposite in="offsetNoise1" in2="offsetNoise2" result="part1" />
            <feComposite in="offsetNoise3" in2="offsetNoise4" result="part2" />
            <feBlend in="part1" in2="part2" mode="color-dodge" result="combinedNoise" />

            <feDisplacementMap 
              in="SourceGraphic" 
              in2="combinedNoise" 
              scale="30" 
              xChannelSelector="R" 
              yChannelSelector="B" 
            />
          </filter>
        </defs>
      </svg>
      
      {/* Card Container - Creates padding space for border */}
      <div 
        className={`relative rounded-[24px] ${className}`}
        style={{
          padding: '6px',
          background: 'oklch(0.145 0 0)'
        }}
      >
        {/* Animated Turbulent Border - Positioned to wrap around content */}
        <div 
          className="absolute inset-0 rounded-[24px] pointer-events-none"
          style={{
            border: '3px solid var(--electric-border-color)',
            filter: `url(#${filterId})`
          }}
        />
        
        {/* Glow Layer 1 - Subtle blur */}
        <div 
          className="absolute inset-0 border-[3px] border-[rgba(180,220,255,0.6)] rounded-[24px] pointer-events-none"
          style={{ filter: 'blur(2px)' }}
        />
        
        {/* Glow Layer 2 - Stronger blur for outer glow */}
        <div 
          className="absolute inset-0 border-[3px] rounded-[24px] pointer-events-none"
          style={{ 
            borderColor: 'var(--electric-light-color)',
            filter: 'blur(6px)' 
          }}
        />
        
        {/* Glow Layer 3 - Extended glow */}
        <div 
          className="absolute inset-[-4px] border-[2px] rounded-[26px] pointer-events-none"
          style={{ 
            borderColor: 'rgba(100, 200, 255, 0.3)',
            filter: 'blur(12px)' 
          }}
        />
        
        {/* Shimmer Effect */}
        <div 
          className="absolute inset-0 rounded-[24px] pointer-events-none mix-blend-overlay"
          style={{
            opacity: 0.4,
            filter: 'blur(16px)',
            background: 'linear-gradient(-30deg, white, transparent 30%, transparent 70%, white)'
          }}
        />
        
        {/* Background Glow - External */}
        <div 
          className="absolute inset-[-8px] rounded-[28px] -z-10 pointer-events-none"
          style={{
            filter: 'blur(24px)',
            opacity: 0.4,
            background: 'radial-gradient(ellipse at center, var(--electric-light-color), transparent 70%)'
          }}
        />
        
        {/* Content Area with dark background */}
        <div 
          className="relative rounded-[20px] overflow-hidden"
          style={{ 
            background: 'oklch(0.145 0 0)',
            minHeight: height === 'auto' ? 'auto' : height
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}
