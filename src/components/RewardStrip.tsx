import { useTranslation } from 'react-i18next';
import starterPack from '@/assets/starter-pack.png';
import specialEgg from '@/assets/special-egg.png';

interface RewardStripProps {
  rewards: string[];
}

// Map reward IDs to names and images
const REWARD_MAP: Record<string, { name: string; image: string }> = {
  '77': { name: 'Starter Pack', image: starterPack },
  '73': { name: 'Special Egg', image: specialEgg },
};

export const RewardStrip = ({ rewards }: RewardStripProps) => {
  const { t } = useTranslation();

  if (!rewards || rewards.length === 0) {
    return null;
  }

  // Parse rewards and sort so 77 is always first
  const sortedRewards = [...rewards].sort((a, b) => {
    // Extract ID from reward string (assuming format like "77" or "Starter Pack (77)")
    const idA = a.match(/\d+/)?.[0] || a;
    const idB = b.match(/\d+/)?.[0] || b;
    
    if (idA === '77') return -1;
    if (idB === '77') return 1;
    return 0;
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h3 className="text-2xl font-semibold mb-6 text-center text-foreground">
        {t('thank.granted')}
      </h3>
      <div className="relative rounded-xl border-2 p-6 backdrop-blur-md overflow-hidden" style={{ borderColor: '#33384d' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ 
          background: 'linear-gradient(to right, #17162b, #2d2027, #563414)',
          opacity: 0.6
        }} />
        <div className="relative flex flex-wrap gap-4 justify-center">
          {sortedRewards.map((reward, index) => {
            // Extract ID from reward string
            const id = reward.match(/\d+/)?.[0] || reward;
            const rewardInfo = REWARD_MAP[id];
            
            return (
              <div
                key={index}
                className="flex items-center gap-3 px-5 py-3 rounded-full bg-primary/20 border-2 border-primary/40 text-foreground"
              >
                {rewardInfo && (
                  <img 
                    src={rewardInfo.image} 
                    alt={rewardInfo.name} 
                    className="w-8 h-8 object-contain"
                  />
                )}
                <span className="font-semibold text-sm">
                  {rewardInfo?.name || reward}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
