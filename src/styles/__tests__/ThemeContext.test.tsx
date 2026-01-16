import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { ThemeProvider, useTheme } from '../ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('ThemeContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides default theme', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('system');
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    await waitFor(() => {
      expect(result.current.theme).toBeDefined();
      expect(result.current.mode).toBe('system');
    });
  });

  it('allows changing theme mode', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('system');
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.mode).toBe('system');
    });

    await act(async () => {
      result.current.setMode('dark');
    });

    expect(result.current.mode).toBe('dark');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('app_theme_mode', 'dark');
  });

  it('throws error if used outside ThemeProvider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within a ThemeProvider');
    
    consoleSpy.mockRestore();
  });
});