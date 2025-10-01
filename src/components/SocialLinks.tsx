import { useTranslation } from 'react-i18next';
import { MessageCircle, Users, Twitter } from 'lucide-react';
import { Button } from './ui/button';

export const SocialLinks = () => {
  const { t } = useTranslation();

  const links = [
    {
      icon: MessageCircle,
      label: t('community.telegram'),
      url: 'https://t.me/zodiark_community', // Placeholder - replace with actual link
    },
    {
      icon: Users,
      label: t('community.discord'),
      url: 'https://discord.gg/zodiark', // Placeholder - replace with actual link
    },
    {
      icon: Twitter,
      label: t('community.x'),
      url: 'https://x.com/zodiark_game', // Placeholder - replace with actual link
    },
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      <h3 className="text-xl font-semibold mb-4 text-center text-foreground">
        {t('community.join')}
      </h3>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {links.map((link, index) => (
          <Button
            key={index}
            variant="secondary"
            size="lg"
            onClick={() => window.open(link.url, '_blank')}
            className="flex items-center gap-2"
          >
            <link.icon className="w-5 h-5" />
            <span className="hidden sm:inline">{link.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
