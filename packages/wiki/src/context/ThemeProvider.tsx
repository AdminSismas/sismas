import { type ReactNode, useState, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      isDark ? 'dark' : 'light'
    );
  }, [isDark]);

  const onChangeDark = (isLight: boolean) => {
    setIsDark(!isLight);
  };

  return (
    <ThemeContext.Provider value={{ isDark, onChangeDark }}>
      {children}
    </ThemeContext.Provider>
  );
}
