import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Countdown } from '@/components/Countdown';
import { FireParticles } from '@/components/FireParticles';
import { LanguageSelector } from '@/components/LanguageSelector';
import { TestModeBanner } from '@/components/TestModeBanner';
import { Button } from '@/components/ui/button';
import { getTelegramUser } from '@/telegram/telegram';
import { callRedeemAPI, storeRedeemResult } from '@/utils/api';
import { trackEvent } from '@/utils/tracker';
import zodiarkLogo from '@/assets/zodiark-logo.svg';
import heroArt from '@/assets/hero-art.png';

export const GamePage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      
      {/* Background Hero Art */}
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: `url(${heroArt})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-0" />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <header className="p-4 sm:p-6 flex justify-between items-center">
          <img src={zodiarkLogo} alt="Zodiark" className="h-16 sm:h-20 md:h-24" />
          <LanguageSelector />
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 gap-8 sm:gap-12">
          {/* Headline */}
          <div className="text-center max-w-3xl">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 text-gradient-cosmic leading-tight">
              {t('game.headline')}
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground">
              {t('game.sub')}
            </p>
          </div>

          {/* Countdown */}
          <Countdown />

          {/* CTA */}
          <div className="flex flex-col items-center gap-4 w-full max-w-md px-4">
            <Button
              size="lg"
              onClick={handleClaimReward}
              disabled={isRedeeming}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg py-6 rounded-xl glow-effect transition-all"
            >
              {isRedeeming ? '...' : t('game.cta')}
            </Button>
            {error && (
              <p className="text-destructive text-sm text-center">{error}</p>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="p-4 text-center text-xs text-muted-foreground">
          © 2025 Zodiark: Astral Awakening
        </footer>
      </div>
    </div>
  );
};
