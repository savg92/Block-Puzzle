import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme, Platform } from 'react-native';
import { darkTheme, lightTheme, Theme } from './theme';
import { useGameStore } from '../store/gameStore';

export type ThemeMode = 'light' | 'dark' | 'system';

export type AppTheme = Theme & {
  mode: ThemeMode;
  isDark: boolean;
};

interface ThemeContextType {
  theme: AppTheme;
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const { preferences, updatePreferences } = useGameStore();
  const mode = (preferences?.theme || 'system') as ThemeMode;

  const isDark = useMemo(() => {
    if (mode === 'system') {
      return systemColorScheme === 'dark';
    }
    return mode === 'dark';
  }, [mode, systemColorScheme]);

  const theme: AppTheme = useMemo(() => {
    const baseTheme = isDark ? darkTheme : lightTheme;
    
    return {
      ...baseTheme,
      mode,
      isDark,
    };
  }, [isDark, mode]);

  React.useEffect(() => {
    if (Platform.OS === 'web') {
      const bgColor = theme.colors.background;
      document.documentElement.style.setProperty('--app-bg', bgColor);
      
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', bgColor);
      }

      // Also update background-color meta if it exists
      const metaBgColor = document.querySelector('meta[name="background-color"]');
      if (metaBgColor) {
        metaBgColor.setAttribute('content', bgColor);
      }
    }
  }, [theme]);

  const setMode = (newMode: ThemeMode) => {
    updatePreferences({ theme: newMode });
  };

  return (
    <ThemeContext.Provider value={{ theme, mode, setMode, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
