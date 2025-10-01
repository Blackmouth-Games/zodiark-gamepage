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

  return (
    <div className="flex justify-center gap-3 sm:gap-4 md:gap-6 w-full max-w-4xl mx-auto px-4 mt-8">
      <CountdownUnit value={countdown.days} label={t('game.countdown.days')} />
      <CountdownUnit value={countdown.hours} label={t('game.countdown.hours')} />
      <CountdownUnit value={countdown.minutes} label={t('game.countdown.minutes')} />
    </div>
  );
};

const CountdownUnit = ({ value, label }: { value: number; label: string }) => {
  return (
    <div className="flex flex-col items-center">
      {/* Box with border like reference image */}
      <div className="border-2 border-primary/40 rounded-2xl px-6 py-4 sm:px-8 sm:py-6 md:px-10 md:py-8 bg-background/20 backdrop-blur-sm min-w-[80px] sm:min-w-[120px] md:min-w-[140px]">
        <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-glow">
          {formatCountdownValue(value)}
        </div>
      </div>
      {/* Label below */}
      <div className="text-xs sm:text-sm md:text-base text-foreground uppercase tracking-wider mt-3 font-semibold">
        {label}
      </div>
    </div>
  );
};
