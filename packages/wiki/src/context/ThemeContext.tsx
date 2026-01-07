import { createContext } from 'react';

export interface ThemeContextProps {
  isDark: boolean;
  onChangeDark: (isLight: boolean) => void;
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(
  undefined
);
