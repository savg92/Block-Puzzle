import React from 'react';
import { render } from '@testing-library/react-native';
import { GameOverModal } from '../GameOverModal';
import { useGameStore } from '../../../store/gameStore';
import { ThemeProvider } from '../../../styles/ThemeContext';

// Mock the store
jest.mock('../../../store/gameStore', () => ({
  useGameStore: jest.fn(),
}));

describe('GameOverModal Snapshots', () => {
  it('renders correctly in standard state', () => {
    (useGameStore as any).mockReturnValue({
      isGameOver: true,
      score: 500,
      highScore: 1000,
      powerUps: { undo: 1 },
      usePowerUp: jest.fn(),
      newGame: jest.fn(),
    });

    const { toJSON } = render(
      <ThemeProvider>
        <GameOverModal />
      </ThemeProvider>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders correctly in high score state', () => {
    (useGameStore as any).mockReturnValue({
      isGameOver: true,
      score: 1500,
      highScore: 1500,
      powerUps: { undo: 1 },
      usePowerUp: jest.fn(),
      newGame: jest.fn(),
    });

    const { toJSON } = render(
      <ThemeProvider>
        <GameOverModal />
      </ThemeProvider>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders nothing when game is not over', () => {
    (useGameStore as any).mockReturnValue({
      isGameOver: false,
      score: 500,
      highScore: 1000,
      powerUps: { undo: 1 },
      usePowerUp: jest.fn(),
      newGame: jest.fn(),
    });

    const { toJSON } = render(
      <ThemeProvider>
        <GameOverModal />
      </ThemeProvider>
    );
    expect(toJSON()).toBeNull();
  });
});
