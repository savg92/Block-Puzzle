import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { theme, Theme } from './theme';
import { mmkvStorage } from '../store/storage';

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  themeType: ThemeType;
  isDark: boolean;
  toggleTheme: () => void;
}

const THEME_STORAGE_KEY = 'user-theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme();
  
  // Try to load persisted theme first, then fall back to system preference
  const [themeType, setThemeType] = useState<ThemeType>(() => {
    const savedTheme = mmkvStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme as ThemeType;
    }
    return (systemColorScheme as ThemeType) || 'light';
  });

  const toggleTheme = () => {
    const newTheme = themeType === 'light' ? 'dark' : 'light';
    setThemeType(newTheme);
    mmkvStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  const value: ThemeContextType = {
    theme,
    themeType,
    isDark: themeType === 'dark',
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
