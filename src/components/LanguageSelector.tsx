import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const languages = [
  { code: 'en', name: 'English', short: 'EN' },
  { code: 'es', name: 'Español', short: 'ES' },
  { code: 'pt', name: 'Português', short: 'PT' },
  { code: 'fr', name: 'Français', short: 'FR' },
  { code: 'zh', name: '中文', short: 'ZH' },
  { code: 'hi', name: 'हिन्दी', short: 'HI' },
];

export const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLanguageChange = (langCode: string) => {
    // Cambiar el idioma en i18next
    i18n.changeLanguage(langCode);
    
    // Extraer la parte de la ruta sin el idioma
    const pathParts = location.pathname.split('/').filter(Boolean);
    const currentLang = pathParts[0];
    
    // Si estamos en thank-you
    if (pathParts.includes('thank-you')) {
      navigate(`/${langCode}/thank-you`, { replace: true });
    } else {
      // Estamos en la página principal
      navigate(`/${langCode}`, { replace: true });
    }
  };

  const currentLang = languages.find(lang => lang.code === i18n.language);

  return (
    <Select value={i18n.language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[80px] bg-background/20 backdrop-blur-sm border-white/20 text-foreground hover:bg-background/30 transition-all">
        <SelectValue>
          <span className="font-semibold tracking-wide">{currentLang?.short || 'EN'}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-card/95 backdrop-blur-md border-border">
        {languages.map((lang) => (
          <SelectItem 
            key={lang.code} 
            value={lang.code}
            className="cursor-pointer hover:bg-primary/20"
          >
            <span className="font-medium">{lang.short}</span>
            <span className="text-muted-foreground ml-2 text-sm">- {lang.name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
