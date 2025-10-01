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
    <div className="flex justify-center gap-6 sm:gap-12 w-full max-w-4xl mx-auto px-4">
      <CountdownUnit value={countdown.days} label={t('game.countdown.days')} />
      <CountdownUnit value={countdown.hours} label={t('game.countdown.hours')} />
      <CountdownUnit value={countdown.minutes} label={t('game.countdown.minutes')} />
    </div>
  );
};

const CountdownUnit = ({ value, label }: { value: number; label: string }) => {
  return (
    <div className="flex flex-col items-center group">
      <div className="relative">
        {/* Magical glow effect */}
        <div className="absolute inset-0 rounded-2xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"
             style={{
               background: 'radial-gradient(circle, hsl(var(--cosmic-orange)) 0%, transparent 70%)'
             }}
        />
        
        {/* Card */}
        <div className="relative card-cosmic rounded-2xl p-6 sm:p-8 md:p-10 min-w-[90px] sm:min-w-[140px] md:min-w-[160px] glow-effect border-2 border-primary/30 backdrop-blur-sm">
          <div className="text-5xl sm:text-7xl md:text-8xl font-bold text-gradient-cosmic animate-pulse">
            {formatCountdownValue(value)}
          </div>
        </div>
      </div>
      <div className="text-sm sm:text-base md:text-lg mt-3 sm:mt-4 text-cosmic-glow uppercase tracking-widest font-semibold">
        {label}
      </div>
    </div>
  );
};
