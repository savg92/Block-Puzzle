import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { ThemeProvider, useTheme } from '../ThemeContext';
import { storage } from '../../store/storage';

// Mock storage
jest.mock('../../store/storage', () => ({
  storage: {
    getString: jest.fn(),
    set: jest.fn(),
  },
}));

describe('ThemeContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides default theme', () => {
    (storage.getString as jest.Mock).mockReturnValue('system');
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBeDefined();
    expect(result.current.mode).toBe('system');
  });

  it('allows changing theme mode', () => {
    (storage.getString as jest.Mock).mockReturnValue('system');
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setMode('dark');
    });

    expect(result.current.mode).toBe('dark');
    expect(storage.set).toHaveBeenCalledWith('app_theme_mode', 'dark');
  });

  it('throws error if used outside ThemeProvider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within a ThemeProvider');
    
    consoleSpy.mockRestore();
  });
});
