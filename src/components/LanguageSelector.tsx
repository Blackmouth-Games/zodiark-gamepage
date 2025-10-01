import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
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

  const currentLang = languages.find(lang => lang.code === i18n.language);

  return (
    <Select value={i18n.language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[80px] bg-background/20 backdrop-blur-sm border-white/20 text-foreground hover:bg-background/30 transition-all">
        <SelectValue>
          <span className="font-semibold tracking-wide">{currentLang?.short || 'EN'}</span>
        </SelectValue>
        <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
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
