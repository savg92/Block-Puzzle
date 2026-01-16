import { useGameStore } from '../gameStore';
import { PIECES } from '../../engine/pieces';

// Mock storage module
jest.mock('../storage', () => {
  return {
    appStorage: {
      setItem: jest.fn(),
      getItem: jest.fn(),
      removeItem: jest.fn(),
    }
  };
});

describe('gameStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useGameStore.getState().newGame();
  });

  it('should have correct initial state', () => {
    const state = useGameStore.getState();
    expect(state.grid).toHaveLength(10);
    expect(state.grid[0]).toHaveLength(10);
    expect(state.score).toBe(0);
    expect(state.availablePieces).toHaveLength(3);
    expect(state.selectedPiece).toBeNull();
    expect(state.hoverPosition).toBeNull();
    expect(state.gridLayout).toBeNull();
    expect(state.isGameOver).toBe(false);
  });

  it('should start a new game', () => {
    // Manually set some state
    useGameStore.setState({
      score: 100,
      isGameOver: true,
      hoverPosition: { row: 1, col: 1 },
    });

    useGameStore.getState().newGame();

    const state = useGameStore.getState();
    expect(state.score).toBe(0);
    expect(state.isGameOver).toBe(false);
    expect(state.hoverPosition).toBeNull();
  });

  it('should select a piece', () => {
    useGameStore.getState().selectPiece(PIECES.SINGLE);
    expect(useGameStore.getState().selectedPiece).toEqual(PIECES.SINGLE);

    useGameStore.getState().selectPiece(null);
    expect(useGameStore.getState().selectedPiece).toBeNull();
  });

  it('should set hover position', () => {
    const pos = { row: 5, col: 5 };
    useGameStore.getState().setHoverPosition(pos);
    expect(useGameStore.getState().hoverPosition).toEqual(pos);
  });

  it('should set grid layout', () => {
    const layout = { x: 10, y: 20, width: 300, height: 300 };
    useGameStore.getState().setGridLayout(layout);
    expect(useGameStore.getState().gridLayout).toEqual(layout);
  });

  it('should place a piece and update state', () => {
    // Initial available pieces should be 3
    const initialAvailable = useGameStore.getState().availablePieces;
    const pieceToPlace = initialAvailable[0];

    // Place a single block at (0,0)
    useGameStore.getState().setHoverPosition({ row: 0, col: 0 });
    useGameStore.getState().placePiece(pieceToPlace, 0, 0);
    
    const state = useGameStore.getState();
    expect(state.grid[0][0]).toBe(1);
    expect(state.score).toBeGreaterThan(0);
    expect(state.availablePieces).toHaveLength(2); // Decreased from 3
    expect(state.hoverPosition).toBeNull(); // Should be cleared
  });

  it('should refill available pieces when all are placed', () => {
    const pieces = useGameStore.getState().availablePieces;
    
    // Place all three pieces (assume they fit for simplicity in test or mock engine)
    useGameStore.getState().placePiece(pieces[0], 0, 0);
    useGameStore.getState().placePiece(pieces[1], 5, 5);
    useGameStore.getState().placePiece(pieces[2], 0, 5);

    expect(useGameStore.getState().availablePieces).toHaveLength(3); // Refilled
  });

  it('should not update state on invalid move', () => {
    const initialGrid = useGameStore.getState().grid;
    const initialScore = useGameStore.getState().score;
    
    // Attempt to place a 2x2 piece at the very edge where it won't fit
    useGameStore.getState().placePiece(PIECES.SQUARE_2, 9, 9);
    
    const state = useGameStore.getState();
    expect(state.grid).toEqual(initialGrid);
    expect(state.score).toBe(initialScore);
  });

  describe('Undo', () => {
    it('should undo a piece placement', () => {
      useGameStore.getState().placePiece(PIECES.SINGLE, 0, 0);
      expect(useGameStore.getState().score).toBe(1);
      
      useGameStore.getState().undo();
      
      expect(useGameStore.getState().score).toBe(0);
      expect(useGameStore.getState().grid[0][0]).toBe(0);
    });

    it('should undo multiple steps', () => {
      useGameStore.getState().placePiece(PIECES.SINGLE, 0, 0);
      useGameStore.getState().placePiece(PIECES.SINGLE, 0, 1);
      expect(useGameStore.getState().score).toBe(2);
      
      useGameStore.getState().undo();
      expect(useGameStore.getState().score).toBe(1);
      
      useGameStore.getState().undo();
      expect(useGameStore.getState().score).toBe(0);
    });

    it('should do nothing if history is empty', () => {
      useGameStore.getState().undo();
      expect(useGameStore.getState().score).toBe(0);
    });

    it('should clear history on new game', () => {
      useGameStore.getState().placePiece(PIECES.SINGLE, 0, 0);
      useGameStore.getState().newGame();
      useGameStore.getState().undo(); // Should do nothing
      expect(useGameStore.getState().score).toBe(0);
    });
  });

  describe('Persistence', () => {
    it('should have persist middleware configured', () => {
      expect((useGameStore as any).persist).toBeDefined();
      expect((useGameStore as any).persist.getOptions().name).toBe('game-storage');
    });

    it('should exclude history from persisted state', () => {
      const state = useGameStore.getState();
      const options = (useGameStore as any).persist.getOptions();
      const persistedState = options.partialize(state);
      
      expect(persistedState.history).toBeUndefined();
      expect(persistedState.score).toBeDefined();
    });
  });
});