import { MoonStar, SunMedium } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="rounded-full border border-[var(--portal-border)] bg-[var(--portal-elevated)] text-[var(--portal-muted)] hover:-translate-y-0.5 hover:bg-[var(--portal-surface)] hover:text-[var(--portal-text)]"
    >
      {theme === 'light' ? <MoonStar className="h-5 w-5" /> : <SunMedium className="h-5 w-5" />}
    </Button>
  );
};

