import { useGameStore } from '../store/gameStore';
import { appStorage } from '../store/storage';
import { PIECES } from '../engine/pieces';
import { act } from '@testing-library/react-native';

// Mock appStorage
jest.mock('../store/storage', () => ({
  appStorage: {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

describe('Persistence Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('hydrates state correctly from storage', async () => {
    const customGrid = Array(10).fill(null).map(() => Array(10).fill(0));
    customGrid[0][0] = 'purple';
    
    const savedState = {
      state: {
        grid: customGrid,
        score: 450,
        highScore: 1000,
        availablePieces: [PIECES.SINGLE, PIECES.LINE_2, null],
        powerUps: { undo: 5, rotate: 2, discard: 0, forcePlace: 1, addSingle: 1 },
        isGameOver: false,
      },
      version: 0
    };

    // Mock getItem to return our saved state
    (appStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(savedState));

    // Trigger rehydration manually for the test
    await act(async () => {
      await (useGameStore as any).persist.rehydrate();
    });

    const state = useGameStore.getState();
    expect(state.grid[0][0]).toBe('purple');
    expect(state.score).toBe(450);
    expect(state.highScore).toBe(1000);
    expect(state.powerUps.undo).toBe(5);
    expect(state.availablePieces[0]).toEqual(PIECES.SINGLE);
    expect(state.availablePieces[2]).toBeNull();
  });
});
