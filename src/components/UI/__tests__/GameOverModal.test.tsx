import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GameOverModal } from '../GameOverModal';
import { useGameStore } from '../../../store/gameStore';

// Mock useGameStore
jest.mock('../../../store/gameStore', () => ({
  useGameStore: jest.fn(),
}));

describe('GameOverModal', () => {
  const mockNewGame = jest.fn();
  const mockUsePowerUp = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useGameStore as any).mockReturnValue({
      isGameOver: true,
      score: 100,
      highScore: 200,
      powerUps: { deleteBlock: 1, swapPiece: 1 },
      usePowerUp: mockUsePowerUp,
      newGame: mockNewGame,
      preferences: {
        soundVolume: 1.0,
        isMuted: false,
        hapticIntensity: 'medium',
        theme: 'system',
      },
    });
  });

  it('renders correctly when game is over', () => {
    const { getByText } = render(<GameOverModal />);
    expect(getByText('GAME OVER')).toBeTruthy();
    expect(getByText('SCORE')).toBeTruthy();
    expect(getByText('100')).toBeTruthy();
    expect(getByText('200')).toBeTruthy();
  });

  it('calls newGame when NEW GAME button is pressed', () => {
    const { getByText } = render(<GameOverModal />);
    fireEvent.press(getByText('NEW GAME'));
    expect(mockNewGame).toHaveBeenCalled();
  });

  it('does not render when game is not over', () => {
    (useGameStore as any).mockReturnValue({
      isGameOver: false,
      score: 0,
      powerUps: { deleteBlock: 1, swapPiece: 1 },
      usePowerUp: mockUsePowerUp,
      newGame: mockNewGame,
      preferences: {
        soundVolume: 1.0,
        isMuted: false,
        hapticIntensity: 'medium',
        theme: 'system',
      },
    });

    const { queryByText } = render(<GameOverModal />);
    expect(queryByText('GAME OVER')).toBeNull();
  });
});
