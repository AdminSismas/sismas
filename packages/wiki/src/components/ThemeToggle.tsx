import React, { useEffect, useState } from 'react';
import { Moon, Sun, Laptop } from 'lucide-react';
import { Button } from '@components/ui/button';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as
      | 'light'
      | 'dark'
      | undefined;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const updateTheme = (newTheme: 'light' | 'dark' | 'system') => {
    const root = window.document.documentElement;

    if (newTheme === 'system') {
      localStorage.removeItem('theme');
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      root.classList.remove('light', 'dark');
      root.classList.add(systemTheme);
    } else {
      localStorage.setItem('theme', newTheme);
      root.classList.remove('light', 'dark');
      root.classList.add(newTheme);
    }
    setTheme(newTheme);
  };

  return (
    <div className="flex items-center space-x-2 border rounded-md p-1">
      <Button
        variant={theme === 'light' ? 'secondary' : 'ghost'}
        size="icon"
        className="h-8 w-8"
        onClick={() => updateTheme('light')}
        title="Claro"
      >
        <Sun className="h-4 w-4" />
      </Button>
      <Button
        variant={theme === 'dark' ? 'secondary' : 'ghost'}
        size="icon"
        className="h-8 w-8"
        onClick={() => updateTheme('dark')}
        title="Oscuro"
      >
        <Moon className="h-4 w-4" />
      </Button>
      <Button
        variant={theme === 'system' ? 'secondary' : 'ghost'}
        size="icon"
        className="h-8 w-8"
        onClick={() => updateTheme('system')}
        title="Sistema"
      >
        <Laptop className="h-4 w-4" />
      </Button>
    </div>
  );
}
