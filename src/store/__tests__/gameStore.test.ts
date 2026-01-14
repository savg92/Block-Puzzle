import { useGameStore } from '../gameStore';
import { PIECES } from '../../engine/pieces';

// Mock MMKV for useGameStore persistence
jest.mock('react-native-mmkv', () => {
  return {
    createMMKV: jest.fn().mockImplementation(() => {
      const mockStorage: Record<string, string> = {};
      return {
        set: (key: string, value: string) => {
          mockStorage[key] = value;
        },
        getString: (key: string) => mockStorage[key] || undefined,
        remove: (key: string) => {
          const existed = !!mockStorage[key];
          delete mockStorage[key];
          return existed;
        },
      };
    }),
  };
});

describe('gameStore', () => {
  beforeEach(() => {
    useGameStore.getState().newGame();
  });

  it('should have correct initial state', () => {
    const state = useGameStore.getState();
    expect(state.grid).toHaveLength(10);
    expect(state.grid[0]).toHaveLength(10);
    expect(state.score).toBe(0);
    expect(state.availablePieces).toHaveLength(0);
    expect(state.selectedPiece).toBeNull();
    expect(state.isGameOver).toBe(false);
  });

  it('should start a new game', () => {
    // Manually set some state
    useGameStore.setState({
      score: 100,
      isGameOver: true,
    });

    useGameStore.getState().newGame();

    const state = useGameStore.getState();
    expect(state.score).toBe(0);
    expect(state.isGameOver).toBe(false);
  });

  it('should select a piece', () => {
    useGameStore.getState().selectPiece(PIECES.SINGLE);
    expect(useGameStore.getState().selectedPiece).toEqual(PIECES.SINGLE);

    useGameStore.getState().selectPiece(null);
    expect(useGameStore.getState().selectedPiece).toBeNull();
  });

  it('should place a piece and update state', () => {
    // Place a single block at (0,0)
    useGameStore.getState().placePiece(PIECES.SINGLE, 0, 0);
    
    const state = useGameStore.getState();
    expect(state.grid[0][0]).toBe(1);
    expect(state.score).toBe(1);
  });

  it('should not update state on invalid move', () => {
    // Place a piece out of bounds
    useGameStore.getState().placePiece(PIECES.SQUARE_2, 9, 9);
    
    const state = useGameStore.getState();
    expect(state.grid[9][9]).toBe(0);
    expect(state.score).toBe(0);
  });

  describe('Persistence', () => {
    it('should have persist middleware configured', () => {
      expect((useGameStore as any).persist).toBeDefined();
      expect((useGameStore as any).persist.getOptions().name).toBe('game-storage');
    });
  });
});