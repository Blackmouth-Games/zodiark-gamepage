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
import { initTelegramApp, detectLanguage, getTelegramUser, isTelegramEnvironment } from './telegram/telegram';
import { initTracker } from './utils/tracker';

const queryClient = new QueryClient();

// Language Router - handles auto-redirect to detected language
const LanguageRouter = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const validLanguages = ['en', 'es', 'pt', 'fr', 'zh', 'hi'];
    
    // Check for ?lang= override
    const params = new URLSearchParams(location.search);
    const langOverride = params.get('lang');

    if (langOverride && validLanguages.includes(langOverride)) {
      // Use override
      i18n.changeLanguage(langOverride);
      localStorage.setItem('preferred_language', langOverride);
      
      // If not on a lang-prefixed route, redirect
      if (!location.pathname.startsWith(`/${langOverride}`)) {
        navigate(`/${langOverride}`, { replace: true });
      }
      return;
    }

    // Check localStorage for preferred language
    const storedLang = localStorage.getItem('preferred_language');
    
    // Extract language from current path
    const pathLangMatch = location.pathname.match(/^\/(en|es|pt|fr|zh|hi)/);
    const pathLang = pathLangMatch ? pathLangMatch[1] : null;

    // Determine which language to use
    let targetLang: string;
    if (pathLang && validLanguages.includes(pathLang)) {
      targetLang = pathLang;
      localStorage.setItem('preferred_language', pathLang);
    } else if (storedLang && validLanguages.includes(storedLang)) {
      targetLang = storedLang;
    } else {
      // Auto-detect from Telegram
      targetLang = detectLanguage();
      localStorage.setItem('preferred_language', targetLang);
    }

    // Update i18n if needed
    if (i18n.language !== targetLang) {
      i18n.changeLanguage(targetLang);
    }

    // If on root or non-lang route, redirect to target lang
    if (location.pathname === '/' || !pathLang) {
      navigate(`/${targetLang}`, { replace: true });
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

    // Send webhook if accessing from Telegram
    const sendTelegramWebhook = async () => {
      if (isTelegramEnvironment()) {
        const user = getTelegramUser();
        if (user) {
          try {
            await fetch('https://primary-production-fe05.up.railway.app/webhook-test/dffc2f77-ee48-449f-9cc2-f113163f6520', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                tg_id: user.tg_id,
                username: user.username,
                language_code: user.language_code,
                timestamp: new Date().toISOString(),
              }),
            });
            console.log('Telegram user webhook sent:', user);
          } catch (error) {
            console.error('Error sending Telegram webhook:', error);
          }
        }
      }
    };

    sendTelegramWebhook();
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
