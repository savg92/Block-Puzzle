import React from 'react';
import { render, act } from '@testing-library/react-native';
import App from './App';

// Mock storage
jest.mock('./store/storage', () => ({
  storage: {
    getString: jest.fn(() => 'system'),
    set: jest.fn(),
  },
}));

// Mock game store
jest.mock('./store/gameStore', () => ({
  useGameStore: () => ({
    grid: Array(10).fill(null).map(() => Array(10).fill(0)),
    score: 0,
    availablePieces: [],
    newGame: jest.fn(),
    initStore: jest.fn(),
    powerUps: {
      undo: 1,
      rotate: 1,
      discard: 1,
      forcePlace: 1,
      addSingle: 1,
    },
    activePowerUpMode: null,
    preferences: {
      soundVolume: 1.0,
      isMuted: false,
      hapticIntensity: 'medium',
      theme: 'system',
    },
  }),
}));

// Mock LoadingScreen
jest.mock('./screens/LoadingScreen', () => ({
  LoadingScreen: () => null
}));

// Mock expo-splash-screen
jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn().mockResolvedValue(true),
  hideAsync: jest.fn().mockResolvedValue(true),
}));

describe('App', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders correctly and transitions from loading to game', async () => {
    const { getByText, getAllByTestId } = render(<App />);
    
    // Should show loading screen initially (isReady is false)
    // LoadingScreen is mocked to null, so we just check if it's rendered by logic
    // but we can't easily check for null. 
    // Let's verify GameScreen is also rendered because it's not conditional in App.tsx
    expect(getByText('Block Puzzle')).toBeTruthy();

    // Fast-forward 2 seconds
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    // Now it should be ready
    const cells = getAllByTestId(/^cell-\d+-\d+$/);
    expect(cells).toHaveLength(100);
  });

  it('handles SplashScreen failure', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const splash = require('expo-splash-screen') as jest.Mocked<typeof import('expo-splash-screen')>;
    splash.hideAsync.mockRejectedValueOnce(new Error('Splash error'));
    
    const { getByText } = render(<App />);
    
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    expect(getByText('Block Puzzle')).toBeTruthy();
  });
});