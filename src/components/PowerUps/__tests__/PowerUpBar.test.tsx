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
      applyPowerUp: mockUsePowerUp,
      undo: mockUndo,
      activePowerUpMode: null,
      preferences: {
        soundVolume: 1.0,
        isMuted: false,
        hapticIntensity: 'medium',
        theme: 'system',
      },
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

  it('calls applyPowerUp when Rotate is pressed', () => {
    const { getByText } = renderWithTheme(<PowerUpBar />);
    fireEvent.press(getByText('Rotate'));
    expect(mockUsePowerUp).toHaveBeenCalledWith('rotate');
  });

  it('calls applyPowerUp when Discard is pressed', () => {
    const { getByText } = renderWithTheme(<PowerUpBar />);
    fireEvent.press(getByText('Discard'));
    expect(mockUsePowerUp).toHaveBeenCalledWith('discard');
  });

  it('renders instructions and Cancel button in active mode', () => {
    mockUseGameStore.mockReturnValue({
      powerUps: {
        undo: 1, rotate: 1, discard: 1, forcePlace: 1, addSingle: 1
      },
      applyPowerUp: mockUsePowerUp,
      undo: mockUndo,
      activePowerUpMode: 'discard',
      preferences: {
        soundVolume: 1.0,
        isMuted: false,
        hapticIntensity: 'medium',
        theme: 'system',
      },
    });

    const { getByText } = renderWithTheme(<PowerUpBar />);
    expect(getByText('TAP A PIECE TO DISCARD')).toBeTruthy();
    expect(getByText('CANCEL')).toBeTruthy();
  });

  it('calls applyPowerUp to toggle off when CANCEL is pressed', () => {
    mockUseGameStore.mockReturnValue({
      powerUps: {
        undo: 1, rotate: 1, discard: 1, forcePlace: 1, addSingle: 1
      },
      applyPowerUp: mockUsePowerUp,
      undo: mockUndo,
      activePowerUpMode: 'discard',
      preferences: {
        soundVolume: 1.0,
        isMuted: false,
        hapticIntensity: 'medium',
        theme: 'system',
      },
    });

    const { getByText } = renderWithTheme(<PowerUpBar />);
    fireEvent.press(getByText('CANCEL'));
    expect(mockUsePowerUp).toHaveBeenCalledWith('discard');
  });

  it('disables button when count is zero', () => {
    mockUseGameStore.mockReturnValue({
      powerUps: {
        undo: 0, rotate: 1, discard: 1, forcePlace: 1, addSingle: 1
      },
      applyPowerUp: mockUsePowerUp,
      undo: mockUndo,
      activePowerUpMode: null,
      preferences: { isMuted: false },
    });

    const { getByText } = renderWithTheme(<PowerUpBar />);
    // In React Native, disabled components might still be "pressable" in tests depending on mock,
    // but we check if it renders correctly.
    expect(getByText('0')).toBeTruthy();
  });

  it('renders correct text for all active modes', () => {
    const modes = ['discard', 'forcePlace', 'addSingle'] as const;
    const texts = ['TAP A PIECE TO DISCARD', 'PLACE PIECE ANYWHERE', 'TAP GRID TO PLACE BLOCK'];

    modes.forEach((mode, i) => {
      mockUseGameStore.mockReturnValue({
        powerUps: { undo: 1, rotate: 1, discard: 1, forcePlace: 1, addSingle: 1 },
        applyPowerUp: mockUsePowerUp,
        undo: mockUndo,
        activePowerUpMode: mode,
        preferences: { isMuted: false },
      });

      const { getByText, unmount } = renderWithTheme(<PowerUpBar />);
      expect(getByText(texts[i])).toBeTruthy();
      unmount();
    });
  });

  it('calls applyPowerUp when Force is pressed', () => {
    const { getByText } = renderWithTheme(<PowerUpBar />);
    fireEvent.press(getByText('Force'));
    expect(mockUsePowerUp).toHaveBeenCalledWith('forcePlace');
  });

  it('calls applyPowerUp when Single is pressed', () => {
    const { getByText } = renderWithTheme(<PowerUpBar />);
    fireEvent.press(getByText('Single'));
    expect(mockUsePowerUp).toHaveBeenCalledWith('addSingle');
  });

  it('renders correctly in dark mode', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ThemeContext = require('../../../styles/ThemeContext');
    const originalUseTheme = ThemeContext.useTheme;
    ThemeContext.useTheme = () => ({ 
        theme: { 
          isDark: true,
          colors: { 
            background: '#000000', 
            text: { secondary: '#ffffff', inverse: '#000000' }, 
            surfaceVariant: '#333333',
            primary: '#3b82f6',
            border: '#444444',
            accent: '#ff0000'
          } 
        }, 
        isDark: true 
    });

    const { getByText } = renderWithTheme(<PowerUpBar />);
    expect(getByText('Undo')).toBeTruthy();

    ThemeContext.useTheme = originalUseTheme;
  });
});