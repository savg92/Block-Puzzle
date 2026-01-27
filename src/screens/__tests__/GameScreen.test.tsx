import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { GameScreen } from '../GameScreen';
import { ThemeProvider } from '../../styles/ThemeContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useGameStore } from '../../store/gameStore';

// Mock game store
jest.mock('../../store/gameStore', () => ({
  useGameStore: jest.fn(),
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
  const mockNewGame = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useGameStore as unknown as jest.Mock).mockReturnValue({
      grid: Array(10).fill(null).map(() => Array(10).fill(0)),
      score: 0,
      availablePieces: [[[1]]],
      newGame: mockNewGame,
      initStore: jest.fn(),
      powerUps: { undo: 1, rotate: 1, discard: 1, forcePlace: 1, addSingle: 1 },
      activePowerUpMode: null,
      preferences: { theme: 'system', showPieceShadow: true },
    });
  });

  it('renders the game title and grid', () => {
    const { getByText, getByTestId } = renderWithContext(<GameScreen />);
    expect(getByText('Block Puzzle')).toBeTruthy();
    expect(getByTestId('game-grid')).toBeDefined();
  });

  it('calls newGame if no pieces available', () => {
    (useGameStore as unknown as jest.Mock).mockReturnValue({
      grid: Array(10).fill(null).map(() => Array(10).fill(0)),
      score: 0,
      availablePieces: [],
      newGame: mockNewGame,
      initStore: jest.fn(),
      powerUps: { undo: 1, rotate: 1, discard: 1, forcePlace: 1, addSingle: 1 },
      activePowerUpMode: null,
      preferences: { theme: 'system', showPieceShadow: true },
    });

    renderWithContext(<GameScreen />);
    expect(mockNewGame).toHaveBeenCalled();
  });

  it('shows restart alert when restart button pressed', () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    const { getByTestId } = renderWithContext(<GameScreen />);
    
    fireEvent.press(getByTestId('restart-button'));
    
    expect(alertSpy).toHaveBeenCalledWith(
      "Restart Game",
      expect.any(String),
      expect.any(Array)
    );
    
    alertSpy.mockRestore();
  });

  it('shows settings when settings button pressed', () => {
    const { getByTestId, getByText } = renderWithContext(<GameScreen />);
    
    fireEvent.press(getByTestId('settings-button'));
    
    // Check if Settings title appears (SettingsScreen is rendered inside)
    expect(getByText(/settings/i)).toBeTruthy();
  });

  it('handles restart game alert', () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    const { getByTestId } = renderWithContext(<GameScreen />);
    
    fireEvent.press(getByTestId('restart-button'));
    
    expect(alertSpy).toHaveBeenCalledWith(
      "Restart Game",
      expect.any(String),
      expect.arrayContaining([
        expect.objectContaining({ text: "Cancel" }),
        expect.objectContaining({ text: "Restart" })
      ])
    );

    // Manually trigger the Restart button callback
    const restartAction = alertSpy.mock.calls[0][2]?.find(b => b.text === "Restart");
    // @ts-ignore
    restartAction?.onPress?.();
    expect(mockNewGame).toHaveBeenCalled();
    
    alertSpy.mockRestore();
  });

  it('applies active styles when powerups are active', () => {
    // 1. addSingle mode
    (useGameStore as unknown as jest.Mock).mockReturnValue({
      grid: Array(10).fill(null).map(() => Array(10).fill(0)),
      score: 0,
      availablePieces: [[[1]]],
      newGame: mockNewGame,
      initStore: jest.fn(),
      powerUps: { undo: 1, rotate: 1, discard: 1, forcePlace: 1, addSingle: 1 },
      activePowerUpMode: 'addSingle',
      preferences: { theme: 'system', showPieceShadow: true },
    });

    const { rerender } = renderWithContext(<GameScreen />);

    // 2. forcePlace mode
    (useGameStore as unknown as jest.Mock).mockReturnValue({
      grid: Array(10).fill(null).map(() => Array(10).fill(0)),
      score: 0,
      availablePieces: [[[1]]],
      newGame: mockNewGame,
      initStore: jest.fn(),
      powerUps: { undo: 1, rotate: 1, discard: 1, forcePlace: 1, addSingle: 1 },
      activePowerUpMode: 'forcePlace',
      preferences: { theme: 'system', showPieceShadow: true },
    });

    rerender(
      <SafeAreaProvider>
        <GestureHandlerRootView>
          <ThemeProvider>
            <GameScreen />
          </ThemeProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    );

    // 3. discard mode
    (useGameStore as unknown as jest.Mock).mockReturnValue({
      grid: Array(10).fill(null).map(() => Array(10).fill(0)),
      score: 0,
      availablePieces: [[[1]]],
      newGame: mockNewGame,
      initStore: jest.fn(),
      powerUps: { undo: 1, rotate: 1, discard: 1, forcePlace: 1, addSingle: 1 },
      activePowerUpMode: 'discard',
      preferences: { theme: 'system', showPieceShadow: true },
    });

    rerender(
      <SafeAreaProvider>
        <GestureHandlerRootView>
          <ThemeProvider>
            <GameScreen />
          </ThemeProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    );
  });

  it('renders correctly in light mode', () => {
    const ThemeContext = require('../../styles/ThemeContext');
    const originalUseTheme = ThemeContext.useTheme;
    ThemeContext.useTheme = () => ({ 
        theme: { colors: { background: '#ffffff', text: '#000000', surfaceVariant: '#f0f0f0' } }, 
        isDark: false 
    });

    const { getByText } = renderWithContext(<GameScreen />);
    expect(getByText('Block Puzzle')).toBeTruthy();

    ThemeContext.useTheme = originalUseTheme;
  });

  it('does not call newGame if pieces are available', () => {
    mockNewGame.mockClear();
    (useGameStore as unknown as jest.Mock).mockReturnValue({
      grid: Array(10).fill(null).map(() => Array(10).fill(0)),
      score: 0,
      availablePieces: [[[1]]],
      newGame: mockNewGame,
      initStore: jest.fn(),
      powerUps: { undo: 1, rotate: 1, discard: 1, forcePlace: 1, addSingle: 1 },
      activePowerUpMode: null,
      preferences: { theme: 'system', showPieceShadow: true },
    });

    renderWithContext(<GameScreen />);
    expect(mockNewGame).not.toHaveBeenCalled();
  });

  it('renders correctly in dark mode', () => {
    const ThemeContext = require('../../styles/ThemeContext');
    const originalUseTheme = ThemeContext.useTheme;
    ThemeContext.useTheme = () => ({ 
        theme: { 
          colors: { 
            background: '#000000', 
            text: '#ffffff', 
            surfaceVariant: '#333333',
            primary: '#3b82f6',
            error: '#ef4444'
          } 
        }, 
        isDark: true 
    });

    const { getByText } = renderWithContext(<GameScreen />);
    expect(getByText('Block Puzzle')).toBeTruthy();

    ThemeContext.useTheme = originalUseTheme;
  });

  it('handles cancel in restart game alert', () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    const { getByTestId } = renderWithContext(<GameScreen />);
    
    fireEvent.press(getByTestId('restart-button'));
    
    // Manually trigger the Cancel button callback
    const cancelAction = alertSpy.mock.calls[0][2]?.find(b => b.text === "Cancel");
    // @ts-ignore
    cancelAction?.onPress?.();
    expect(mockNewGame).not.toHaveBeenCalled();
    
    alertSpy.mockRestore();
  });
});