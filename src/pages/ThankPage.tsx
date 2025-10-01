import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RewardStrip } from '@/components/RewardStrip';
import { Timeline } from '@/components/Timeline';
import { SocialLinks } from '@/components/SocialLinks';
import { Button } from '@/components/ui/button';
import { getAndClearRedeemResult, type RedeemResult } from '@/utils/api';
import { trackEvent } from '@/utils/tracker';
import zodiarkLogo from '@/assets/zodiark-logo.svg';
import { CheckCircle2, XCircle } from 'lucide-react';

export const ThankPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [result, setResult] = useState<RedeemResult | null>(null);

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
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <header className="p-4 sm:p-6 flex justify-center">
          <img src={zodiarkLogo} alt="Zodiark" className="h-12 sm:h-16" />
        </header>

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

              {/* Timeline */}
              <Timeline />

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
        <footer className="p-4 text-center text-xs text-muted-foreground">
          © 2025 Zodiark: Astral Awakening
        </footer>
      </div>
    </div>
  );
};
