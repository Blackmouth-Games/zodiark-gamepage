import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GamePage } from './pages/GamePage';
import { ThankPage } from './pages/ThankPage';
import i18n from './i18n/i18n';
import { initTelegramApp, detectLanguage } from './telegram/telegram';
import { initTracker } from './utils/tracker';

const queryClient = new QueryClient();

// Language Router - handles auto-redirect to detected language
const LanguageRouter = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for ?lang= override
    const params = new URLSearchParams(location.search);
    const langOverride = params.get('lang');

    if (langOverride && ['en', 'es', 'pt', 'fr'].includes(langOverride)) {
      // Use override
      i18n.changeLanguage(langOverride);
      
      // If not on a lang-prefixed route, redirect
      if (!location.pathname.startsWith(`/${langOverride}`)) {
        navigate(`/${langOverride}`, { replace: true });
      }
      return;
    }

    // Auto-detect from Telegram
    const detectedLang = detectLanguage();
    i18n.changeLanguage(detectedLang);

    // If on root or non-lang route, redirect to detected lang
    if (location.pathname === '/' || !location.pathname.match(/^\/(en|es|pt|fr)/)) {
      navigate(`/${detectedLang}`, { replace: true });
    }
  }, [location, navigate]);

  return null;
};

const App = () => {
  useEffect(() => {
    // Initialize Telegram WebApp
    initTelegramApp();

    // Initialize tracker
    initTracker();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <LanguageRouter />
            <Routes>
              {/* Language-prefixed routes */}
              <Route path="/:lang" element={<GamePage />} />
              <Route path="/:lang/thank-you" element={<ThankPage />} />

              {/* Fallback - redirect to auto-detected language */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </I18nextProvider>
    </QueryClientProvider>
  );
};

export default App;
