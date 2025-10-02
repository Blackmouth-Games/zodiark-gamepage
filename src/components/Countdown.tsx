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
    <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 w-full max-w-3xl mx-auto px-4 mt-8">
      <CountdownUnit value={countdown.days} label={t('game.countdown.days')} />
      <CountdownUnit value={countdown.hours} label={t('game.countdown.hours')} />
      <CountdownUnit value={countdown.minutes} label={t('game.countdown.minutes')} />
      <CountdownUnit value={countdown.seconds} label={t('game.countdown.seconds')} />
    </div>
  );
};

const CountdownUnit = ({ value, label }: { value: number; label: string }) => {
  return (
    <div className="flex flex-col items-center">
      {/* Box with border like reference image */}
      <div className="border-2 border-primary/40 rounded-xl px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-4 bg-background/20 backdrop-blur-sm min-w-[60px] sm:min-w-[80px] md:min-w-[100px]">
        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-glow">
          {formatCountdownValue(value)}
        </div>
      </div>
    </div>
  );
};
