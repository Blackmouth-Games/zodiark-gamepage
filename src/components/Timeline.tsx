import { useTranslation } from 'react-i18next';
import { Calendar, Egg, Sparkles } from 'lucide-react';

export const Timeline = () => {
  const { t } = useTranslation();

  const milestones = [
    {
      icon: Calendar,
      title: t('thank.timeline.launch.title'),
      desc: t('thank.timeline.launch.desc'),
    },
    {
      icon: Egg,
      title: t('thank.timeline.hatching.title'),
      desc: t('thank.timeline.hatching.desc'),
    },
    {
      icon: Sparkles,
      title: t('thank.timeline.awakening.title'),
      desc: t('thank.timeline.awakening.desc'),
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold mb-6 text-center text-gradient-cosmic">
        {t('thank.timeline_title')}
      </h3>
      <div className="space-y-4">
        {milestones.map((milestone, index) => (
          <div key={index} className="card-cosmic rounded-lg p-4 flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <milestone.icon className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-foreground mb-1">
                {milestone.title}
              </h4>
              <p className="text-sm text-muted-foreground">{milestone.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
