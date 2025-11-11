/**
 * AdminPanel Component
 * 
 * Displays validation logs and transaction history.
 * Provides admin controls for clearing data.
 */

import { useState, useEffect } from 'react';
import { Shield, Trash2, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { TurbulentCard } from './TurbulentCard';
import { getLogs, clearLogs, type ValidationLog } from '../services/api';
import { getChain } from '../services/chains';
import { toast } from 'sonner@2.0.3';

export function AdminPanel() {
  const [logs, setLogs] = useState<ValidationLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await getLogs();
      setLogs(data);
    } catch (error) {
      toast.error('Failed to load logs');
    } finally {
      setLoading(false);
    }
  };

  const handleClearLogs = async () => {
    if (!confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
      return;
    }
    
    setClearing(true);
    try {
      await clearLogs();
      setLogs([]);
      toast.success('Logs cleared successfully');
    } catch (error) {
      toast.error('Failed to clear logs');
    } finally {
      setClearing(false);
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatTxHash = (hash: string) => {
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#C9A961]/20">
            <Shield className="w-6 h-6 text-[#C9A961]" />
          </div>
          <div>
            <h2 className="text-2xl text-white tracking-tight">Admin Panel</h2>
            <p className="text-sm text-white/50">
              {logs.length} validation {logs.length === 1 ? 'log' : 'logs'}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={loadLogs}
            disabled={loading}
            className="border-white/20 hover:bg-white/5 hover:border-[#C9A961]/50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button
            variant="outline"
            onClick={handleClearLogs}
            disabled={clearing || logs.length === 0}
            className="border-[#EF4444]/30 hover:bg-[#EF4444]/10 hover:border-[#EF4444] text-[#EF4444]"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Logs
          </Button>
        </div>
      </div>
      
      {/* Logs List */}
      <Card className="bg-white/[0.02] border-white/10 backdrop-blur-xl">
        {logs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex p-4 rounded-full bg-[#0B0E1A] mb-4">
              <Clock className="w-8 h-8 text-white/30" />
            </div>
            <h3 className="text-xl text-white/50 mb-2">No Validation Logs</h3>
            <p className="text-sm text-white/40">
              Logs will appear here after transactions are validated
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[600px]">
            <div className="p-4 space-y-4">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-lg bg-[#0B0E1A] border border-white/10 hover:border-white/20 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {log.result.approved ? (
                        <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0" />
                      )}
                      <div>
                        <Badge
                          variant={log.result.approved ? 'default' : 'destructive'}
                          className={log.result.approved 
                            ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30' 
                            : 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/30'
                          }
                        >
                          {log.result.approved ? 'APPROVED' : 'DENIED'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-xs text-white/40">
                      {formatDate(log.validatedAt)}
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-white/50">Transaction Hash:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[#C9A961]">
                          {formatTxHash(log.txHash)}
                        </span>
                        {log.chain && (
                          <Badge 
                            className="text-xs"
                            style={{ 
                              background: 'rgba(180, 220, 255, 0.1)',
                              color: 'oklch(0.85 0.15 220)',
                              border: '1px solid rgba(180, 220, 255, 0.2)'
                            }}
                          >
                            {getChain(log.chain)?.icon} {log.chain}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-white/50">Signal Code:</span>
                      <span className="font-mono text-white">
                        {log.signalCode}
                      </span>
                    </div>
                    
                    <div className="pt-2 mt-2 border-t border-white/10">
                      <span className="text-white/50">Result:</span>
                      <p className="mt-1 text-white/70">{log.result.reason}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </Card>
      
      {/* Statistics */}
      {logs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TurbulentCard className="h-32" filterScale={20} glowIntensity="medium">
            <div className="text-center">
              <div className="text-sm text-white/50 mb-2">Total Validations</div>
              <div className="text-4xl text-white">{logs.length}</div>
            </div>
          </TurbulentCard>
          
          <TurbulentCard className="h-32" filterScale={20} glowIntensity="medium">
            <div className="text-center">
              <div className="text-sm text-white/50 mb-2">Approved</div>
              <div className="text-4xl text-[#10B981]">
                {logs.filter(l => l.result.approved).length}
              </div>
            </div>
          </TurbulentCard>
          
          <TurbulentCard className="h-32" filterScale={20} glowIntensity="medium">
            <div className="text-center">
              <div className="text-sm text-white/50 mb-2">Denied</div>
              <div className="text-4xl text-[#EF4444]">
                {logs.filter(l => !l.result.approved).length}
              </div>
            </div>
          </TurbulentCard>
        </div>
      )}
    </div>
  );
}
