import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
];

export const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    
    // Update URL with new language
    const pathParts = location.pathname.split('/').filter(Boolean);
    const isThankYouPage = pathParts.includes('thank-you');
    
    if (isThankYouPage) {
      navigate(`/${langCode}/thank-you`, { replace: true });
    } else {
      navigate(`/${langCode}`, { replace: true });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-muted-foreground" />
      <div className="flex gap-1">
        {languages.map((lang) => (
          <Button
            key={lang.code}
            variant={i18n.language === lang.code ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => handleLanguageChange(lang.code)}
            className="min-w-[60px] text-xs"
            title={lang.name}
          >
            <span className="mr-1">{lang.flag}</span>
            {lang.code.toUpperCase()}
          </Button>
        ))}
      </div>
    </div>
  );
};
