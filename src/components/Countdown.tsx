import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { calculateCountdown, formatCountdownValue, type CountdownTime } from '@/utils/countdown';

export const Countdown = () => {
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState<CountdownTime>(calculateCountdown());

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(calculateCountdown());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (countdown.isExpired) {
    return (
      <div className="text-center">
        <p className="text-2xl text-cosmic-glow">The journey has begun!</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-4 sm:gap-8 md:gap-12 w-full max-w-4xl mx-auto px-4 mt-8">
      <CountdownUnit value={countdown.days} label={t('game.countdown.days')} />
      <CountdownUnit value={countdown.hours} label={t('game.countdown.hours')} />
      <CountdownUnit value={countdown.minutes} label={t('game.countdown.minutes')} />
    </div>
  );
};

const CountdownUnit = ({ value, label }: { value: number; label: string }) => {
  return (
    <div className="flex flex-col items-center">
      {/* Número grande con estilo del título */}
      <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-glow mb-2">
        {formatCountdownValue(value)}
      </div>
      {/* Label */}
      <div className="text-xs sm:text-sm md:text-base text-muted-foreground uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
};
