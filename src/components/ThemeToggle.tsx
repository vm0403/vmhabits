import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '@/hooks/useTheme';

const ThemeToggle = () => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="h-10 w-10"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-foreground transition-transform duration-200" />
      ) : (
        <Moon className="h-5 w-5 text-foreground transition-transform duration-200" />
      )}
    </Button>
  );
};

export default ThemeToggle;
