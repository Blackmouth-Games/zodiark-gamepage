/**
 * Telegram Mini App Integration
 * Handles Telegram WebApp SDK initialization and user data extraction
 */

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name?: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
      };
    };
  }
}

export interface TelegramUser {
  tg_id: string;
  username: string;
  language_code: string;
}

/**
 * Initialize Telegram WebApp
 */
export const initTelegramApp = (): void => {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
  }
};

/**
 * Get Telegram user data with strict null safety
 */
export const getTelegramUser = (): TelegramUser | null => {
  const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
  
  if (!user || !user.id) {
    console.warn('Telegram user data not available');
    return null;
  }

  return {
    tg_id: user.id.toString(),
    username: user.username || `user_${user.id}`,
    language_code: user.language_code || 'en',
  };
};

/**
 * Detect language from Telegram user data
 * Maps Telegram language codes to supported languages (en, es, pt)
 */
export const detectLanguage = (): string => {
  const user = getTelegramUser();
  
  if (!user) {
    return 'en'; // Default fallback
  }

  const langCode = user.language_code.toLowerCase();
  
  // Map Telegram language codes to supported languages
  if (langCode.startsWith('es')) return 'es';
  if (langCode.startsWith('pt')) return 'pt';
  return 'en'; // Default for all other languages
};

/**
 * Check if running inside Telegram
 */
export const isTelegramEnvironment = (): boolean => {
  return !!window.Telegram?.WebApp;
};
