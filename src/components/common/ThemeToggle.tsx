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
      className="text-[#355772] dark:text-[#cde2f5]"
    >
      {theme === 'light' ? <MoonStar className="h-5 w-5" /> : <SunMedium className="h-5 w-5" />}
    </Button>
  );
};

