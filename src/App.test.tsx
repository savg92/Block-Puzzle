import React from 'react';
import { render } from '@testing-library/react-native';
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

// Mock LoadingScreen to avoid its complex reanimated logic during App test
jest.mock('./screens/LoadingScreen', () => ({
  LoadingScreen: () => null
}));

describe('App', () => {
  it('renders correctly', () => {
    const { getByText, getAllByTestId } = render(<App />);
    expect(getByText('Block Puzzle')).toBeTruthy();
    
    // Check if grid is rendered (100 cells)
    const cells = getAllByTestId(/^cell-\d+-\d+$/);
    expect(cells).toHaveLength(100);
  });
});