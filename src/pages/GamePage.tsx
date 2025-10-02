import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Countdown } from '@/components/Countdown';
import { FireParticles } from '@/components/FireParticles';
import { LanguageSelector } from '@/components/LanguageSelector';
import { TestModeBanner } from '@/components/TestModeBanner';
import { DebugPanel } from '@/components/DebugPanel';
import { Button } from '@/components/ui/button';
import { getTelegramUser } from '@/telegram/telegram';
import { callRedeemAPI, storeRedeemResult } from '@/utils/api';
import { trackEvent } from '@/utils/tracker';
import zodiarkLogo from '@/assets/zodiark-logo.svg';
import heroArt from '@/assets/hero-art.png';
import { Bug } from 'lucide-react';

export const GamePage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugOpen, setDebugOpen] = useState(false);

  useEffect(() => {
    // Track page view when component is ready and i18n is initialized
    if (i18n.isInitialized) {
      trackEvent('lp_page_view');
      setIsReady(true);
    }
  }, [i18n.isInitialized]);

  const handleClaimReward = async () => {
    // Get Telegram user data
    const user = getTelegramUser();

    if (!user || !user.tg_id) {
      setError(t('errors.missing_tg'));
      return;
    }

    // Track button click
    trackEvent('lp_click_button');

    setIsRedeeming(true);
    setError(null);

    try {
      // Call redeem API
      const result = await callRedeemAPI(user.tg_id, i18n.language);

      // Store result and navigate to thank you page
      storeRedeemResult(result);
      navigate(`/${i18n.language}/thank-you`);
    } catch (err) {
      console.error('Redeem error:', err);
      setError(t('errors.network'));
      setIsRedeeming(false);
    }
  };

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">{t('game.loading')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Test Mode Banner */}
      <TestModeBanner />
      
      {/* Fire Particles */}
      <FireParticles />
      
      {/* Background Hero Art - bien visible */}
      <div 
        className="absolute inset-0 opacity-40 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: `url(${heroArt})` }}
      />
      {/* Overlay muy ligero */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-background/70 z-0" />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
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
              onClick={() => {
                // Store a demo result for testing
                storeRedeemResult({
                  status: 'OK',
                  granted: ['Astral Egg (Rare)', '1000 Premium Currency'],
                });
                navigate(`/${i18n.language}/thank-you`);
              }}
              className="border-primary/30 text-foreground hover:bg-primary/10"
            >
              View Thank You
            </Button>
          </div>
          <LanguageSelector />
        </header>
        
        {/* Debug Panel */}
        <DebugPanel isOpen={debugOpen} onClose={() => setDebugOpen(false)} />

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 gap-6 sm:gap-8">
          {/* Logo centrado en el hero */}
          <div className="flex justify-center">
            <img src={zodiarkLogo} alt="Zodiark" className="h-24 sm:h-32 md:h-40 lg:h-48" />
          </div>

          {/* Headline + Countdown + Subtitle integrados */}
          <div className="text-center max-w-5xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-glow leading-tight">
              {t('game.headline')}
            </h1>
            
            {/* Journey Starting Text */}
            <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-gradient-cosmic mb-4">
              {t('game.journey_starting')}
            </p>
            
            {/* Countdown */}
            <Countdown />
            
            {/* Early Access Reward Text */}
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground mt-6 max-w-3xl mx-auto">
              {t('game.early_access_reward')}
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4 w-full max-w-md px-4">
            <Button
              size="lg"
              onClick={handleClaimReward}
              disabled={isRedeeming}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg py-6 rounded-xl glow-effect transition-all transform hover:scale-105"
            >
              {isRedeeming ? '...' : t('game.cta')}
            </Button>
            {error && (
              <p className="text-destructive text-sm text-center font-semibold">{error}</p>
            )}
          </div>
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
