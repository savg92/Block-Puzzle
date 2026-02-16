import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GameOverModal } from '../GameOverModal';
import { useGameStore } from '../../../store/gameStore';
import { ThemeProvider } from '../../../styles/ThemeContext';

// Mock useGameStore
jest.mock('../../../store/gameStore');

describe('GameOverModal', () => {
  const mockNewGame = jest.fn();
  const mockUsePowerUp = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useGameStore as any).mockReturnValue({
      isGameOver: true,
      score: 100,
      highScore: 500,
      powerUps: { undo: 1 },
      applyPowerUp: mockUsePowerUp,
      newGame: mockNewGame,
      preferences: { theme: 'dark' },
    });
  });

  const renderWithTheme = (component: React.ReactElement) => {
    return render(
      <ThemeProvider>
        {component}
      </ThemeProvider>
    );
  };

  it('renders correctly when game is over', () => {
    const { getByText } = renderWithTheme(<GameOverModal />);
    expect(getByText('GAME OVER')).toBeTruthy();
    expect(getByText('SCORE')).toBeTruthy();
    expect(getByText('100')).toBeTruthy();
  });

  it('calls newGame when NEW GAME button is pressed', () => {
    const { getByText } = renderWithTheme(<GameOverModal />);
    fireEvent.press(getByText('NEW GAME'));
    expect(mockNewGame).toHaveBeenCalled();
  });

  it('calls applyPowerUp when UNDO button is pressed', () => {
    const { getByText } = renderWithTheme(<GameOverModal />);
    fireEvent.press(getByText('UNDO (1)'));
    expect(mockUsePowerUp).toHaveBeenCalledWith('undo');
  });

  it('does not render when game is not over', () => {
    (useGameStore as any).mockReturnValue({
      isGameOver: false,
      score: 100,
      highScore: 500,
      powerUps: { undo: 1 },
      applyPowerUp: mockUsePowerUp,
      newGame: mockNewGame,
      preferences: { theme: 'dark' },
    });

    const { queryByText } = renderWithTheme(<GameOverModal />);
    expect(queryByText('GAME OVER')).toBeNull();
  });
});
