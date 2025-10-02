import { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getTelegramUser } from '@/telegram/telegram';

interface APICall {
  timestamp: string;
  endpoint: string;
  request: any;
  response: any;
  status: number;
}

interface DebugPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DebugPanel = ({ isOpen, onClose }: DebugPanelProps) => {
  const [apiCalls, setApiCalls] = useState<APICall[]>([]);
  const [expandedCall, setExpandedCall] = useState<number | null>(null);
  const telegramUser = getTelegramUser();

  useEffect(() => {
    // Get API calls from sessionStorage
    const stored = sessionStorage.getItem('debug_api_calls');
    if (stored) {
      setApiCalls(JSON.parse(stored));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-background">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Debug Panel</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Telegram User Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Telegram User Info</h3>
            <div className="bg-muted/30 rounded-lg p-4 font-mono text-sm">
              {telegramUser ? (
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(telegramUser, null, 2)}
                </pre>
              ) : (
                <p className="text-muted-foreground">No Telegram user data available</p>
              )}
            </div>
          </div>

          {/* API Calls History */}
          <div>
            <h3 className="text-lg font-semibold mb-3">API Calls History</h3>
            {apiCalls.length === 0 ? (
              <p className="text-muted-foreground">No API calls recorded yet</p>
            ) : (
              <div className="space-y-2">
                {apiCalls.map((call, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedCall(expandedCall === index ? null : index)}
                      className="w-full p-3 flex items-center justify-between hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          call.status >= 200 && call.status < 300 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {call.status}
                        </span>
                        <span className="font-mono text-sm">{call.endpoint}</span>
                        <span className="text-xs text-muted-foreground">{call.timestamp}</span>
                      </div>
                      {expandedCall === index ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    
                    {expandedCall === index && (
                      <div className="p-4 bg-muted/10 border-t space-y-3">
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1">Request</p>
                          <pre className="bg-background/50 p-2 rounded text-xs overflow-x-auto">
                            {JSON.stringify(call.request, null, 2)}
                          </pre>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1">Response</p>
                          <pre className="bg-background/50 p-2 rounded text-xs overflow-x-auto">
                            {JSON.stringify(call.response, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end">
          <Button
            variant="outline"
            onClick={() => {
              sessionStorage.removeItem('debug_api_calls');
              setApiCalls([]);
            }}
          >
            Clear History
          </Button>
        </div>
      </Card>
    </div>
  );
};
