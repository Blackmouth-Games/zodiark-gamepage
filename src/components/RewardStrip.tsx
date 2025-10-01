import { useTranslation } from 'react-i18next';

interface RewardStripProps {
  rewards: string[];
}

export const RewardStrip = ({ rewards }: RewardStripProps) => {
  const { t } = useTranslation();

  if (!rewards || rewards.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h3 className="text-xl font-semibold mb-4 text-center text-cosmic-glow">
        {t('thank.granted')}
      </h3>
      <div className="card-cosmic rounded-lg p-6">
        <div className="flex flex-wrap gap-3 justify-center">
          {rewards.map((reward, index) => (
            <div
              key={index}
              className="px-4 py-2 rounded-full bg-primary/30 border border-accent/30 text-foreground text-sm"
            >
              {reward}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
