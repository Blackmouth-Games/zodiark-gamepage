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
    <div className="flex justify-center gap-4 sm:gap-8 w-full max-w-2xl mx-auto px-4">
      <CountdownUnit value={countdown.days} label={t('game.countdown.days')} />
      <CountdownUnit value={countdown.hours} label={t('game.countdown.hours')} />
      <CountdownUnit value={countdown.minutes} label={t('game.countdown.minutes')} />
    </div>
  );
};

const CountdownUnit = ({ value, label }: { value: number; label: string }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="card-cosmic rounded-xl p-3 sm:p-6 min-w-[70px] sm:min-w-[100px] glow-effect">
        <div className="text-3xl sm:text-5xl md:text-6xl font-bold text-gradient-cosmic">
          {formatCountdownValue(value)}
        </div>
      </div>
      <div className="text-xs sm:text-sm mt-2 text-muted-foreground uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
};
