import { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, Copy, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getTelegramUser } from '@/telegram/telegram';
import { calculateCountdown, getTargetDate } from '@/utils/countdown';

interface APICall {
  timestamp: string;
  endpoint: string;
  request: any;
  response: any;
  status: number;
  apiUrl?: string;
}

interface DebugPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DebugPanel = ({ isOpen, onClose }: DebugPanelProps) => {
  const [apiCalls, setApiCalls] = useState<APICall[]>([]);
  const [expandedCall, setExpandedCall] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(calculateCountdown());
  const telegramUser = getTelegramUser();
  
  // Color picker state
  const [gradientFrom, setGradientFrom] = useState('#0f172a'); // slate-950
  const [gradientVia, setGradientVia] = useState('#171717'); // neutral-900
  const [gradientTo, setGradientTo] = useState('#451a03'); // orange-950
  const [borderColor, setBorderColor] = useState('#3b82f6'); // blue-500
  const [opacity, setOpacity] = useState(0.6);

  useEffect(() => {
    // Get API calls from sessionStorage
    const stored = sessionStorage.getItem('debug_api_calls');
    if (stored) {
      setApiCalls(JSON.parse(stored));
    }
    
    // Update countdown every second when panel is open
    const interval = setInterval(() => {
      setCountdown(calculateCountdown());
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isOpen]);

  const copyColorValues = () => {
    const colorInfo = `Gradient From: ${gradientFrom}
Gradient Via: ${gradientVia}
Gradient To: ${gradientTo}
Border Color: ${borderColor}
Opacity: ${opacity}`;
    navigator.clipboard.writeText(colorInfo);
    alert('¡Valores de color copiados!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col bg-background">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Debug Panel</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Tabs Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="info">API & Telegram Info</TabsTrigger>
              <TabsTrigger value="tools">🎨 Design Tools</TabsTrigger>
            </TabsList>

            {/* Tab 1: API & Telegram Info */}
            <TabsContent value="info" className="space-y-6">
              {/* Countdown Debug Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Countdown Information</h3>
                <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Target Date:</span>
                    <span className="font-mono">{getTargetDate().toFormat('yyyy-MM-dd HH:mm:ss ZZZZ')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current Time:</span>
                    <span className="font-mono">{new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Days:</span>
                    <span className="font-mono font-bold text-accent">{countdown.days}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Hours:</span>
                    <span className="font-mono font-bold text-accent">{countdown.hours}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Minutes:</span>
                    <span className="font-mono font-bold text-accent">{countdown.minutes}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Seconds:</span>
                    <span className="font-mono font-bold text-accent">{countdown.seconds}</span>
                  </div>
                </div>
              </div>

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
                          className="w-full p-3 flex flex-col items-start gap-2 hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-center gap-3 w-full">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              call.status >= 200 && call.status < 300 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {call.status}
                            </span>
                            <span className="font-mono text-sm">{call.endpoint}</span>
                            <span className="text-xs text-muted-foreground ml-auto">{call.timestamp}</span>
                            {expandedCall === index ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                          {call.apiUrl && (
                            <div className="text-xs text-muted-foreground font-mono w-full text-left">
                              API: {call.apiUrl}
                            </div>
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
            </TabsContent>

            {/* Tab 2: Design Tools */}
            <TabsContent value="tools" className="space-y-6">
              {/* Color Picker Tool */}
              <div>
                <h3 className="text-lg font-semibold mb-3">🎨 Color Picker Tool</h3>
                <div className="bg-muted/30 rounded-lg p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Controls */}
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-muted-foreground block mb-2">Gradient From:</label>
                        <div className="flex gap-2">
                          <input 
                            type="color" 
                            value={gradientFrom} 
                            onChange={(e) => setGradientFrom(e.target.value)}
                            className="w-12 h-10 rounded cursor-pointer border border-border"
                          />
                          <input 
                            type="text" 
                            value={gradientFrom} 
                            onChange={(e) => setGradientFrom(e.target.value)}
                            className="flex-1 px-3 py-2 bg-background border border-border rounded text-foreground text-sm font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-muted-foreground block mb-2">Gradient Via:</label>
                        <div className="flex gap-2">
                          <input 
                            type="color" 
                            value={gradientVia} 
                            onChange={(e) => setGradientVia(e.target.value)}
                            className="w-12 h-10 rounded cursor-pointer border border-border"
                          />
                          <input 
                            type="text" 
                            value={gradientVia} 
                            onChange={(e) => setGradientVia(e.target.value)}
                            className="flex-1 px-3 py-2 bg-background border border-border rounded text-foreground text-sm font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-muted-foreground block mb-2">Gradient To:</label>
                        <div className="flex gap-2">
                          <input 
                            type="color" 
                            value={gradientTo} 
                            onChange={(e) => setGradientTo(e.target.value)}
                            className="w-12 h-10 rounded cursor-pointer border border-border"
                          />
                          <input 
                            type="text" 
                            value={gradientTo} 
                            onChange={(e) => setGradientTo(e.target.value)}
                            className="flex-1 px-3 py-2 bg-background border border-border rounded text-foreground text-sm font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-muted-foreground block mb-2">Border Color:</label>
                        <div className="flex gap-2">
                          <input 
                            type="color" 
                            value={borderColor} 
                            onChange={(e) => setBorderColor(e.target.value)}
                            className="w-12 h-10 rounded cursor-pointer border border-border"
                          />
                          <input 
                            type="text" 
                            value={borderColor} 
                            onChange={(e) => setBorderColor(e.target.value)}
                            className="flex-1 px-3 py-2 bg-background border border-border rounded text-foreground text-sm font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-muted-foreground block mb-2">Opacity: {opacity.toFixed(1)}</label>
                        <input 
                          type="range" 
                          min="0" 
                          max="1" 
                          step="0.1"
                          value={opacity} 
                          onChange={(e) => setOpacity(parseFloat(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      <Button onClick={copyColorValues} className="w-full" size="sm">
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar Valores de Color
                      </Button>
                    </div>

                    {/* Preview */}
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">Vista Previa:</p>
                      <div 
                        className="p-6 rounded-xl border-2 backdrop-blur-md h-32 flex items-center justify-center transition-all"
                        style={{
                          background: `linear-gradient(to right, ${gradientFrom}${Math.round(opacity * 255).toString(16).padStart(2, '0')}, ${gradientVia}${Math.round(opacity * 255).toString(16).padStart(2, '0')}, ${gradientTo}${Math.round(opacity * 255).toString(16).padStart(2, '0')})`,
                          borderColor: `${borderColor}4D`
                        }}
                      >
                        <span className="text-white font-semibold drop-shadow-lg">Preview Box</span>
                      </div>

                      <div className="bg-background/80 p-3 rounded border border-border text-xs space-y-1">
                        <p className="text-accent font-semibold">📋 Instrucciones:</p>
                        <p className="text-muted-foreground">
                          Ajusta los colores con los selectores de arriba. Cuando estés satisfecho, haz clic en "Copiar Valores" y pégamelos en el chat.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
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
