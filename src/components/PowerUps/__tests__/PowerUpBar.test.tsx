import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PowerUpBar } from '../PowerUpBar';
import { ThemeProvider } from '../../../styles/ThemeContext';
import { useGameStore } from '../../../store/gameStore';

// Mock game store
jest.mock('../../../store/gameStore', () => {
  const actual = jest.requireActual('../../../store/gameStore');
  return {
    ...actual,
    useGameStore: jest.fn(),
  };
});

const mockUseGameStore = useGameStore as unknown as jest.Mock;

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('PowerUpBar', () => {
  const mockUndo = jest.fn();
  const mockUsePowerUp = jest.fn();

  beforeEach(() => {
    mockUndo.mockClear();
    mockUsePowerUp.mockClear();
    mockUseGameStore.mockReturnValue({
      powerUps: {
        undo: 1,
        rotate: 2,
        discard: 3,
        forcePlace: 4,
        addSingle: 5,
      },
      usePowerUp: mockUsePowerUp,
      undo: mockUndo,
      activePowerUpMode: null,
    });
  });

  it('renders all 5 power-up buttons', () => {
    const { getByText } = renderWithTheme(<PowerUpBar />);
    expect(getByText('Undo')).toBeTruthy();
    expect(getByText('Rotate')).toBeTruthy();
    expect(getByText('Discard')).toBeTruthy();
    expect(getByText('Force')).toBeTruthy();
    expect(getByText('Single')).toBeTruthy();
  });

  it('renders correctly the counts', () => {
    const { getByText } = renderWithTheme(<PowerUpBar />);
    expect(getByText('1')).toBeTruthy();
    expect(getByText('2')).toBeTruthy();
    expect(getByText('3')).toBeTruthy();
    expect(getByText('4')).toBeTruthy();
    expect(getByText('5')).toBeTruthy();
  });

  it('calls undo when Undo is pressed', () => {
    const { getByText } = renderWithTheme(<PowerUpBar />);
    fireEvent.press(getByText('Undo'));
    expect(mockUndo).toHaveBeenCalled();
  });

  it('calls usePowerUp when Rotate is pressed', () => {
    const { getByText } = renderWithTheme(<PowerUpBar />);
    fireEvent.press(getByText('Rotate'));
    expect(mockUsePowerUp).toHaveBeenCalledWith('rotate');
  });

  it('calls usePowerUp when Discard is pressed', () => {
    const { getByText } = renderWithTheme(<PowerUpBar />);
    fireEvent.press(getByText('Discard'));
    expect(mockUsePowerUp).toHaveBeenCalledWith('discard');
  });
});
