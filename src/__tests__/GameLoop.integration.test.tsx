import { act } from '@testing-library/react-native';
import { useGameStore } from '../store/gameStore';
import { PIECES } from '../engine/pieces';
import { theme } from '../styles/theme';

// Control pieces for integration test
jest.mock('../engine/pieces', () => {
  const actual = jest.requireActual('../engine/pieces');
  return {
    ...actual,
    getRandomPieces: jest.fn(() => [actual.PIECES.LINE_5, actual.PIECES.LINE_5, actual.PIECES.SINGLE]),
  };
});

describe('Game Loop Integration', () => {
  beforeEach(() => {
    act(() => {
      useGameStore.getState().newGame();
    });
  });

  it('completes a partial game loop: place pieces and clear a line', () => {
    const store = useGameStore.getState();
    const colorHex = (theme.colors as any)['pink'];

    // 1. Place a LINE_5 (1x5) at (0,0)
    // Row 0: [1, 1, 1, 1, 1, 0, 0, 0, 0, 0]
    act(() => {
      store.placePiece(PIECES.LINE_5, 0, 0, colorHex, 0);
    });

    expect(useGameStore.getState().score).toBe(5); // 5 blocks placed
    expect(useGameStore.getState().grid[0][0]).toBe(colorHex);
    expect(useGameStore.getState().grid[0][4]).toBe(colorHex);
    expect(useGameStore.getState().grid[0][5]).toBe(0);

    // 2. Place another LINE_5 (1x5) at (0,5)
    // Row 0 becomes full: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    // Then it should be cleared!
    act(() => {
      useGameStore.getState().placePiece(PIECES.LINE_5, 0, 5, colorHex, 1);
    });

    // Score should be: 5 (first piece) + 5 (second piece) + 10 (1 line clear) = 20
    expect(useGameStore.getState().score).toBe(20);
    
    // Grid Row 0 should be empty again
    expect(useGameStore.getState().grid[0].every(cell => cell === 0)).toBe(true);
  });

  it('verifies game over detection after placements', () => {
    // Checkerboard pattern (no 2x2 or 3x3 gaps possible)
    const checkerGrid = Array(10).fill(null).map((_, r) => 
      Array(10).fill(null).map((_, c) => (r + c) % 2 === 0 ? 'red' : 0)
    );
    
    // All 0s are isolated singles.
    // Ensure we have a big piece that won't fit
    act(() => {
      useGameStore.setState({ 
        grid: checkerGrid,
        availablePieces: [PIECES.SQUARE_2, PIECES.SQUARE_3, PIECES.BIG_L]
      });
    });

    // Check game over after a piece that triggers the check
    // (Manual setState doesn't trigger logic. We should trigger a placement)
    
    const firstEmpty = { row: 0, col: 1 }; // (0+1)%2 = 1 -> 0
    act(() => {
        useGameStore.getState().placePiece(PIECES.SINGLE, firstEmpty.row, firstEmpty.col, 'blue', 0);
    });

    expect(useGameStore.getState().isGameOver).toBe(true);
  });
});
