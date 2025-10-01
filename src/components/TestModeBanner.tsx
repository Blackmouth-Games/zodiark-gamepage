import { AlertCircle } from 'lucide-react';

export const TestModeBanner = () => {
  const isTestMode = import.meta.env.VITE_TEST_MODE === 'true';

  if (!isTestMode) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-destructive text-destructive-foreground px-4 py-2 text-center text-sm font-semibold flex items-center justify-center gap-2">
      <AlertCircle className="w-4 h-4" />
      TEST MODE - This site is not indexed by search engines
    </div>
  );
};
