import React from 'react';
import { render } from '@testing-library/react-native';
import { GameScreen } from '../GameScreen';
import { ThemeProvider } from '../../styles/ThemeContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Mock game store
jest.mock('../../store/gameStore', () => ({
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

const renderWithContext = (component: React.ReactElement) => {
  return render(
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <ThemeProvider>
          {component}
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

describe('GameScreen', () => {
  it('renders the game title and grid', () => {
    const { getByText, getByTestId } = renderWithContext(<GameScreen />);
    expect(getByText('Block Puzzle')).toBeTruthy();
    expect(getByTestId('game-grid')).toBeDefined();
  });

  it('renders placeholders for score and tray', () => {
    const { getByTestId } = renderWithContext(<GameScreen />);
    expect(getByTestId('score-container')).toBeDefined();
    expect(getByTestId('piece-tray')).toBeDefined();
  });
});
