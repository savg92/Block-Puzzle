import React from 'react';
import { render, act } from '@testing-library/react-native';
import App, { initSplashScreen } from '../App';

// Mock the whole module to fail
jest.mock('expo-splash-screen', () => {
  throw new Error('Module not found');
});

// Mock other dependencies
jest.mock('../store/storage', () => ({
  appStorage: {
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(null),
    removeItem: jest.fn().mockResolvedValue(null),
  },
  storage: {
    getString: jest.fn(() => 'system'),
    set: jest.fn(),
  },
}));

jest.mock('../screens/LoadingScreen', () => ({
  LoadingScreen: () => null
}));

// Mocking failure manually via the exported init function
// Trigger the failure manually via the exported init function

describe('App with no splash screen module', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders correctly even if SplashScreen module fails to load', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    // Trigger the failure manually via the exported init function
    initSplashScreen();
    
    const { getByText } = render(<App />);
    
    expect(warnSpy).toHaveBeenCalledWith(
      'SplashScreen module failed to load:',
      expect.any(Error)
    );

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    expect(getByText('Block Puzzle')).toBeTruthy();
    warnSpy.mockRestore();
  });
});