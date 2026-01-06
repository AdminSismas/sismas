import { useEffect, useState } from 'react';

export function useDarkTheme() {
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

  return {
    isDark,
    onChangeDark
  };
}
