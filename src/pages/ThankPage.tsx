import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RewardStrip } from '@/components/RewardStrip';
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
import { CheckCircle2, XCircle, Bug, Home } from 'lucide-react';

export const ThankPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [result, setResult] = useState<RedeemResult | null>(null);
  const [debugOpen, setDebugOpen] = useState(false);

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
        
        {/* Debug Panel */}
        <DebugPanel isOpen={debugOpen} onClose={() => setDebugOpen(false)} />

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-start px-4 py-8 gap-8 overflow-y-auto">
          {/* Hero Section */}
          <div className="text-center max-w-2xl">
            {isSuccess && (
              <>
                <CheckCircle2 className="w-16 h-16 sm:w-20 sm:h-20 text-accent mx-auto mb-4 animate-pulse" />
                <h1 className="text-3xl sm:text-5xl font-bold mb-4 text-gradient-cosmic">
                  {t('thank.title_ok')}
                </h1>
                <p className="text-base sm:text-xl text-muted-foreground">
                  {t('thank.sub_ok')}
                </p>
              </>
            )}
            {(isNotOK || isError) && (
              <>
                <XCircle className="w-16 h-16 sm:w-20 sm:h-20 text-destructive mx-auto mb-4" />
                <h1 className="text-3xl sm:text-5xl font-bold mb-4 text-foreground">
                  {t('thank.title_error')}
                </h1>
                <p className="text-base sm:text-xl text-destructive mb-6">
                  {getErrorMessage()}
                </p>
                <Button
                  size="lg"
                  onClick={handleRetry}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  {t('thank.retry')}
                </Button>
              </>
            )}
          </div>

          {/* Success Content */}
          {isSuccess && (
            <>
              {/* Rewards */}
              {result.granted && result.granted.length > 0 && (
                <RewardStrip rewards={result.granted} />
              )}

              {/* FAQ Section */}
              <div className="w-full max-w-3xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-cosmic-glow text-center">
                  {t('thank.faq.title')}
                </h2>
                
                <Accordion type="single" collapsible className="space-y-4">
                  <AccordionItem value="item-1" className="rounded-xl border-2 border-primary/40 overflow-hidden backdrop-blur-md bg-gradient-to-r from-purple-900/30 via-purple-800/20 to-amber-700/30">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5 transition-colors">
                      <span className="text-left font-semibold text-foreground">
                        {t('thank.faq.q1.question')}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 space-y-4">
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

                  <AccordionItem value="item-2" className="rounded-xl border-2 border-primary/40 overflow-hidden backdrop-blur-md bg-gradient-to-r from-purple-900/30 via-purple-800/20 to-amber-700/30">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5 transition-colors">
                      <span className="text-left font-semibold text-foreground">
                        {t('thank.faq.q2.question')}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-muted-foreground">
                      {t('thank.faq.q2.answer')}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3" className="rounded-xl border-2 border-primary/40 overflow-hidden backdrop-blur-md bg-gradient-to-r from-purple-900/30 via-purple-800/20 to-amber-700/30">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5 transition-colors">
                      <span className="text-left font-semibold text-foreground">
                        {t('thank.faq.q3.question')}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-muted-foreground">
                      {t('thank.faq.q3.answer')}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4" className="rounded-xl border-2 border-primary/40 overflow-hidden backdrop-blur-md bg-gradient-to-r from-purple-900/30 via-purple-800/20 to-amber-700/30">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5 transition-colors">
                      <span className="text-left font-semibold text-foreground">
                        {t('thank.faq.q4.question')}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-muted-foreground">
                      {t('thank.faq.q4.answer')}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

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
        <footer className="p-6 border-t-2 border-primary/40 bg-gradient-to-r from-purple-900/40 via-purple-800/30 to-amber-700/40 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-muted-foreground">
            <p>© 2025 Zodiark. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};
