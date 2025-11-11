/**
 * Admin Page
 * 
 * Administrative interface for viewing logs and managing data.
 */

import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { AdminPanel } from '../components/AdminPanel';

interface AdminProps {
  onBack: () => void;
}

export function Admin({ onBack }: AdminProps) {
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
            Back to Dashboard
          </Button>
        </div>
        
        {/* Admin Panel */}
        <AdminPanel />
      </div>
    </div>
  );
}
