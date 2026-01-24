import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';

// Mock useColorScheme for testing system theme
const mockUseColorScheme = jest.fn();
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  __esModule: true,
  default: mockUseColorScheme,
}));

import { ThemeProvider, useTheme } from '../ThemeContext';
import { useGameStore } from '../../store/gameStore';

describe('ThemeContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseColorScheme.mockReturnValue('light');
    // Reset store to default
    act(() => {
      useGameStore.getState().updatePreferences({ theme: 'system' });
    });
  });

  it('provides theme object with mode and isDark', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBeDefined();
    expect(result.current.theme.mode).toBe('system');
    expect(result.current.mode).toBe('system');
  });

  it('allows changing theme mode via setMode', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    await act(async () => {
      result.current.setMode('dark');
    });

    expect(result.current.mode).toBe('dark');
    expect(result.current.isDark).toBe(true);
    expect(useGameStore.getState().preferences.theme).toBe('dark');
  });

  it('respects system color scheme when mode is system', async () => {
    // Ensure mode is system
    act(() => {
      useGameStore.getState().updatePreferences({ theme: 'system' });
    });

    mockUseColorScheme.mockReturnValue('dark');
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result, rerender } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.isDark).toBe(true);

    mockUseColorScheme.mockReturnValue('light');
    rerender({});
    
    expect(result.current.isDark).toBe(false);
  });

  it('throws error if used outside ThemeProvider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within a ThemeProvider');
    
    consoleSpy.mockRestore();
  });
});