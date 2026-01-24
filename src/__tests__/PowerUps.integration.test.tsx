import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { PowerUpBar } from '../components/PowerUps/PowerUpBar';
import { PieceTray } from '../components/PieceTray/PieceTray';
import { ThemeProvider } from '../styles/ThemeContext';
import { useGameStore } from '../store/gameStore';
import { PIECES } from '../engine/pieces';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

describe('Power-Up Workflows Integration', () => {
  beforeEach(() => {
    act(() => {
      useGameStore.getState().newGame();
    });
  });

  it('rotates pieces when Rotate power-up is pressed', () => {
    // Set controlled pieces
    act(() => {
      useGameStore.setState({ 
        availablePieces: [PIECES.LINE_2, null, null],
        powerUps: { undo: 1, rotate: 1, discard: 1, forcePlace: 1, addSingle: 1 }
      });
    });

    const { getByText } = render(
      <GestureHandlerRootView>
        <ThemeProvider>
          <PowerUpBar />
        </ThemeProvider>
      </GestureHandlerRootView>
    );

    // Initial piece is LINE_2: [[1, 1]]
    expect(useGameStore.getState().availablePieces[0]).toEqual([[1, 1]]);

    // Trigger Rotate
    fireEvent.press(getByText('Rotate'));

    // Should be rotated to [[1], [1]]
    expect(useGameStore.getState().availablePieces[0]).toEqual([[1], [1]]);
    expect(useGameStore.getState().powerUps.rotate).toBe(0);
  });

  it('discards a piece when Discard power-up is active and piece is pressed', () => {
    // Start fresh game to get consistent pieces from our mock
    act(() => {
      useGameStore.getState().newGame();
      useGameStore.setState({ 
        powerUps: { undo: 1, rotate: 1, discard: 1, forcePlace: 1, addSingle: 1 }
      });
    });

    const { getByText, getAllByTestId } = render(
      <GestureHandlerRootView>
        <ThemeProvider>
          <PowerUpBar />
          <PieceTray />
        </ThemeProvider>
      </GestureHandlerRootView>
    );

    // Initial available pieces should be our mock defaults (LINE_5, LINE_5, SINGLE)
    // but they might be rotated!
    expect(useGameStore.getState().availablePieces[0]).not.toBeNull();
    expect(useGameStore.getState().availablePieces[1]).not.toBeNull();

    // 1. Activate Discard mode
    fireEvent.press(getByText('Discard'));
    expect(useGameStore.getState().activePowerUpMode).toBe('discard');

    // 2. Press the piece in the tray
    const draggables = getAllByTestId('draggable-piece');
    fireEvent(draggables[0], 'onPiecePress');

    // 3. Verify piece is discarded
    expect(useGameStore.getState().availablePieces[0]).toBeNull();
    expect(useGameStore.getState().powerUps.discard).toBe(0);
    expect(useGameStore.getState().activePowerUpMode).toBeNull();
  });
});
