import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

export function useDarkTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useDarkTheme must be used within a ThemeProvider');
  }
  return context;
}
