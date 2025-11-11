/**
 * GlassButton - Glass morphism button/badge component
 * 
 * Matches the scrollbar-glass design from the reference
 */

interface GlassButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function GlassButton({ children, className = '', onClick }: GlassButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`relative rounded-[14px] w-fit h-fit px-4 py-2 uppercase text-sm transition-all duration-300 ${className}`}
      style={{
        background: 'radial-gradient(47.2% 50% at 50.39% 88.37%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%), rgba(255, 255, 255, 0.04)',
        color: 'rgba(255, 255, 255, 0.8)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'radial-gradient(47.2% 50% at 50.39% 88.37%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%), rgba(255, 255, 255, 0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'radial-gradient(47.2% 50% at 50.39% 88.37%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%), rgba(255, 255, 255, 0.04)';
      }}
    >
      {/* Glass border gradient */}
      <span
        className="absolute inset-0 rounded-[14px] pointer-events-none"
        style={{
          padding: '1px',
          background: 'linear-gradient(150deg, rgba(255, 255, 255, 0.48) 16.73%, rgba(255, 255, 255, 0.08) 30.2%, rgba(255, 255, 255, 0.08) 68.2%, rgba(255, 255, 255, 0.6) 81.89%)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
        }}
      />
      {children}
    </button>
  );
}
