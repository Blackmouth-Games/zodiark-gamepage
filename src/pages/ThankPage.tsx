import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SocialLinks } from '@/components/SocialLinks';
import { FireParticles } from '@/components/FireParticles';
import { LanguageSelector } from '@/components/LanguageSelector';
import { TestModeBanner } from '@/components/TestModeBanner';
import { DebugPanel } from '@/components/DebugPanel';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getAndClearRedeemResult, type RedeemResult } from '@/utils/api';
import { trackEvent } from '@/utils/tracker';
import thankYouBg from '@/assets/thank-you-bg.png';
import specialEgg from '@/assets/special-egg.png';
import starterPack from '@/assets/starter-pack.png';
import zodiarkLogo from '@/assets/zodiark-logo.svg';
import { CheckCircle2, XCircle, Bug, Home } from 'lucide-react';

// Map reward IDs to images
const REWARD_IMAGES: Record<string, string> = {
  '77': starterPack,
  '73': specialEgg,
};

const REWARD_NAMES: Record<string, string> = {
  '77': 'Starter Pack',
  '73': 'Special Egg',
};

export const ThankPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [result, setResult] = useState<RedeemResult | null>(null);
  const [debugOpen, setDebugOpen] = useState(false);

  // Test functions for debug
  const testNotOK = () => {
    const testResult: RedeemResult = {
      status: 'NOT_OK',
      reason: 'ALREADY_OWN_77',
      granted: []
    };
    setResult(testResult);
  };

  const testOnly77 = () => {
    const testResult: RedeemResult = {
      status: 'OK',
      granted: ['77']
    };
    setResult(testResult);
  };

  const test77And73 = () => {
    const testResult: RedeemResult = {
      status: 'OK',
      granted: ['77', '73']
    };
    setResult(testResult);
  };

  useEffect(() => {
    // Get and clear result from sessionStorage
    const storedResult = getAndClearRedeemResult();
    
    if (!storedResult) {
      // No result found, redirect to game page
      navigate(`/${i18n.language}`);
      return;
    }

    setResult(storedResult);

    // Track page view
    trackEvent('typ_page_view');
  }, [i18n.language, navigate]);

  const handleRetry = () => {
    trackEvent('typ_cancel');
    navigate(`/${i18n.language}`);
  };

  const handleGoToBot = () => {
    trackEvent('typ_go_service');
    window.open('https://t.me/zodiark_astral_awakening_bot', '_blank');
  };

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const isSuccess = result.status === 'OK';
  const isNotOK = result.status === 'NOT_OK';
  const isError = result.status === 'ERROR';

  // Map reason codes to friendly messages
  const getErrorMessage = (): string => {
    if (isError) return t('errors.generic');
    if (!result.reason) return t('errors.generic');

    const reasonMap: Record<string, string> = {
      MISSING_PARAMS: t('errors.missing_params'),
      ALREADY_OWN_77: t('errors.already_own_77'),
    };

    return reasonMap[result.reason] || t('errors.generic');
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Test Mode Banner */}
      <TestModeBanner />
      
      {/* Fire Particles */}
      <FireParticles />
      
      {/* Background Image - Fixed */}
      <div 
        className="fixed inset-0 opacity-30 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: `url(${thankYouBg})` }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-black/30 to-background/80 z-0" />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="p-4 sm:p-6 flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setDebugOpen(true)}
              className="border-primary/30 text-foreground hover:bg-primary/10"
              title="Debug Panel"
            >
              <Bug className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(`/${i18n.language}`)}
              className="border-primary/30 text-foreground hover:bg-primary/10"
              title="Go to Game Page"
            >
              <Home className="w-4 h-4" />
            </Button>
          </div>
          <LanguageSelector />
        </header>
        
        {/* Debug Panel - Keep Real Debug Info */}
        <DebugPanel isOpen={debugOpen} onClose={() => setDebugOpen(false)} />
        
        {/* Test Panel Overlay - Only when debug is open */}
        {debugOpen && (
          <div className="fixed top-20 right-4 bg-card border-2 border-primary/40 rounded-lg p-4 z-[60] max-w-sm shadow-2xl">
            <h3 className="text-sm font-bold text-primary mb-3">🧪 Quick Test</h3>
            <div className="space-y-2">
              <Button
                onClick={testNotOK}
                size="sm"
                variant="outline"
                className="w-full justify-start text-xs border-destructive/30"
              >
                <XCircle className="w-3 h-3 mr-2" />
                NOT_OK
              </Button>
              
              <Button
                onClick={testOnly77}
                size="sm"
                variant="outline"
                className="w-full justify-start text-xs border-primary/30"
              >
                <CheckCircle2 className="w-3 h-3 mr-2" />
                OK (77)
              </Button>
              
              <Button
                onClick={test77And73}
                size="sm"
                variant="outline"
                className="w-full justify-start text-xs border-accent/30"
              >
                <CheckCircle2 className="w-3 h-3 mr-2" />
                OK (77+73)
              </Button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-start px-4 py-8 gap-8 overflow-y-auto">
          {/* Logo */}
          <div className="flex justify-center">
            <img src={zodiarkLogo} alt="Zodiark" className="h-16 sm:h-20 md:h-24" />
          </div>

          {/* Success State */}
          {isSuccess && (
            <>
              <div className="text-center max-w-2xl relative">
                <CheckCircle2 className="w-12 h-12 text-accent absolute -top-6 right-4 animate-pulse" />
                <h1 className="text-3xl sm:text-5xl font-bold mb-4 text-foreground">
                  {t('thank.title_ok')}
                </h1>
                <p className="text-base sm:text-xl text-muted-foreground mb-8">
                  {t('thank.sub_ok')}
                </p>
              </div>

              {/* Rewards - Large Images */}
              {result.granted && result.granted.length > 0 && (
                <div className="w-full max-w-4xl mx-auto">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-foreground">
                    {t('thank.granted')}
                  </h2>
                  <div className="flex flex-wrap gap-8 justify-center items-center">
                    {[...result.granted].sort((a, b) => {
                      const idA = a.match(/\d+/)?.[0] || a;
                      const idB = b.match(/\d+/)?.[0] || b;
                      if (idA === '77') return -1;
                      if (idB === '77') return 1;
                      return 0;
                    }).map((reward, index) => {
                      const id = reward.match(/\d+/)?.[0] || reward;
                      const image = REWARD_IMAGES[id];
                      const name = REWARD_NAMES[id] || reward;
                      
                      return (
                        <div key={index} className="flex flex-col items-center gap-4 animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
                          <div className="relative">
                            <img 
                              src={image} 
                              alt={name} 
                              className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain drop-shadow-2xl animate-glow"
                            />
                          </div>
                          <div className="px-6 py-3 rounded-full bg-primary/20 border-2 border-primary/60">
                            <span className="font-bold text-lg text-primary">{name}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Error/NOT_OK State */}
          {(isNotOK || isError) && (
            <>
              <div className="text-center max-w-2xl relative">
                <XCircle className="w-12 h-12 text-destructive absolute -top-6 right-4" />
                <h1 className="text-3xl sm:text-5xl font-bold mb-4 text-foreground">
                  {t('thank.title_error')}
                </h1>
                <p className="text-base sm:text-xl text-muted-foreground mb-6">
                  {getErrorMessage()}
                </p>
              </div>
            </>
          )}

          {/* FAQ Section - Show for both success and error */}
          {(isSuccess || isNotOK || isError) && (
              <div className="w-full max-w-3xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-foreground text-center">
                  {t('thank.faq.title')}
                </h2>
                
                <Accordion type="single" collapsible className="space-y-4">
                  <AccordionItem value="item-1" className="relative rounded-xl border-2 overflow-hidden backdrop-blur-md" style={{ borderColor: '#33384d' }}>
                    <div className="absolute inset-0 pointer-events-none" style={{ 
                      background: 'linear-gradient(to right, #17162b, #2d2027, #563414)',
                      opacity: 0.6
                    }} />
                    <AccordionTrigger className="relative px-6 py-4 hover:no-underline hover:bg-primary/5 transition-colors">
                      <span className="text-left font-semibold text-foreground">
                        {t('thank.faq.q1.question')}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="relative px-6 pb-4 space-y-4">
                      <p className="text-muted-foreground">{t('thank.faq.q1.answer')}</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card/50 border border-accent/20">
                          <img src={starterPack} alt="Starter Pack" className="w-24 h-24 object-contain" />
                          <p className="text-sm font-semibold text-accent">Starter Pack</p>
                        </div>
                        <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card/50 border border-accent/20">
                          <img src={specialEgg} alt="Special Egg" className="w-24 h-24 object-contain" />
                          <p className="text-sm font-semibold text-accent">Special Egg</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2" className="relative rounded-xl border-2 overflow-hidden backdrop-blur-md" style={{ borderColor: '#33384d' }}>
                    <div className="absolute inset-0 pointer-events-none" style={{ 
                      background: 'linear-gradient(to right, #17162b, #2d2027, #563414)',
                      opacity: 0.6
                    }} />
                    <AccordionTrigger className="relative px-6 py-4 hover:no-underline hover:bg-primary/5 transition-colors">
                      <span className="text-left font-semibold text-foreground">
                        {t('thank.faq.q2.question')}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="relative px-6 pb-4 text-muted-foreground">
                      {t('thank.faq.q2.answer')}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3" className="relative rounded-xl border-2 overflow-hidden backdrop-blur-md" style={{ borderColor: '#33384d' }}>
                    <div className="absolute inset-0 pointer-events-none" style={{ 
                      background: 'linear-gradient(to right, #17162b, #2d2027, #563414)',
                      opacity: 0.6
                    }} />
                    <AccordionTrigger className="relative px-6 py-4 hover:no-underline hover:bg-primary/5 transition-colors">
                      <span className="text-left font-semibold text-foreground">
                        {t('thank.faq.q3.question')}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="relative px-6 pb-4 text-muted-foreground">
                      {t('thank.faq.q3.answer')}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4" className="relative rounded-xl border-2 overflow-hidden backdrop-blur-md" style={{ borderColor: '#33384d' }}>
                    <div className="absolute inset-0 pointer-events-none" style={{ 
                      background: 'linear-gradient(to right, #17162b, #2d2027, #563414)',
                      opacity: 0.6
                    }} />
                    <AccordionTrigger className="relative px-6 py-4 hover:no-underline hover:bg-primary/5 transition-colors">
                      <span className="text-left font-semibold text-foreground">
                        {t('thank.faq.q4.question')}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="relative px-6 pb-4 text-muted-foreground">
                      {t('thank.faq.q4.answer')}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
          )}

          {/* Success Only Content */}
          {isSuccess && (
            <>
              {/* Community Links */}
              <SocialLinks />

              {/* Optional: Open Bot Again */}
              <Button
                variant="outline"
                size="lg"
                onClick={handleGoToBot}
                className="border-accent text-accent hover:bg-accent/10"
              >
                Open Zodiark Bot
              </Button>
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="relative p-6 border-t-2 backdrop-blur-md overflow-hidden" style={{ borderColor: '#33384d' }}>
          <div className="absolute inset-0" style={{ 
            background: 'linear-gradient(to right, #17162b, #2d2027, #563414)',
            opacity: 0.6
          }} />
          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-muted-foreground">
            <p>© 2025 Zodiark. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};
