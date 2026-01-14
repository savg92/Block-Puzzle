import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { ThemeProvider, useTheme } from '../ThemeContext';
import { mmkvStorage } from '../../store/storage';

jest.mock('../../store/storage', () => ({
  mmkvStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

describe('ThemeContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides the default theme', () => {
    (mmkvStorage.getItem as jest.Mock).mockReturnValue(null);
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });
    expect(result.current.theme).toBeDefined();
    expect(result.current.isDark).toBeDefined();
  });

  it('loads the saved theme from storage', () => {
    (mmkvStorage.getItem as jest.Mock).mockReturnValue('dark');
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });
    expect(result.current.themeType).toBe('dark');
    expect(result.current.isDark).toBe(true);
  });

  it('allows toggling the theme and persists it', () => {
    (mmkvStorage.getItem as jest.Mock).mockReturnValue('light');
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });
    
    act(() => {
      result.current.toggleTheme();
    });
    
    expect(result.current.themeType).toBe('dark');
    expect(mmkvStorage.setItem).toHaveBeenCalledWith('user-theme', 'dark');
  });

  it('falls back to system theme when no theme is saved', () => {
    (mmkvStorage.getItem as jest.Mock).mockReturnValue(null);
    const mockUseColorScheme = require('react-native').useColorScheme;
    (mockUseColorScheme as jest.Mock).mockReturnValue('dark');
    
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });
    
    expect(result.current.themeType).toBe('dark');
  });

  it('throws error when used outside of ThemeProvider', () => {
    // Silence console.error for this test as we expect an error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within a ThemeProvider');
    
    consoleSpy.mockRestore();
  });
});
