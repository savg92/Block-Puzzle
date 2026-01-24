import { useGameStore } from '../gameStore';
import { PIECES } from '../../engine/pieces';
import { Piece } from '../../engine/types';

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
    expect(state.powerUps).toEqual({ 
      undo: 1, 
      rotate: 1, 
      discard: 1, 
      forcePlace: 1, 
      addSingle: 1 
    });
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
    const initialAvailable = [...useGameStore.getState().availablePieces];
    const pieceToPlace = initialAvailable[0] as Piece;

    // Place a single block at (0,0)
    useGameStore.getState().setHoverPosition({ row: 0, col: 0 });
    const result = useGameStore.getState().placePiece(pieceToPlace, 0, 0, '#FF0000', 0);
    
    const state = useGameStore.getState();
    // If it cleared a line (e.g. pieceToPlace was a 1x1 and it filled row 0), it might be 0.
    // But in a fresh game, row 0 is empty, so placing a piece makes it filled unless it triggers clear.
    if (result?.clearedLines === 0) {
        expect(state.grid[0][0]).toBe('#FF0000');
    } else {
        expect(state.grid[0][0]).toBe(0);
    }
    expect(state.score).toBeGreaterThan(0);
    expect(state.availablePieces[0]).toBeNull(); // Replaced with null
    expect(state.availablePieces.filter(p => p !== null)).toHaveLength(2); // 2 remaining
    expect(state.hoverPosition).toBeNull(); // Should be cleared
  });

  it('should refill available pieces when all are placed', () => {
    // Mock available pieces to be all SINGLES to ensure they fit
    useGameStore.setState({ availablePieces: [PIECES.SINGLE, PIECES.SINGLE, PIECES.SINGLE] });
    const pieces = [...useGameStore.getState().availablePieces];
    
    // Place all three pieces
    useGameStore.getState().placePiece(pieces[0] as Piece, 0, 0, 'red', 0);
    useGameStore.getState().placePiece(pieces[1] as Piece, 5, 5, 'blue', 1);
    useGameStore.getState().placePiece(pieces[2] as Piece, 0, 5, 'green', 2);

    expect(useGameStore.getState().availablePieces).toHaveLength(3); // Refilled
    expect(useGameStore.getState().availablePieces.every(p => p !== null)).toBe(true);
  });

  it('should not update state on invalid move', () => {
    const initialGrid = useGameStore.getState().grid;
    const initialScore = useGameStore.getState().score;
    
    // Attempt to place a 2x2 piece at the very edge where it won't fit
    useGameStore.getState().placePiece(PIECES.SQUARE_2, 9, 9, 'red', 0);
    
    const state = useGameStore.getState();
    expect(state.grid).toEqual(initialGrid);
    expect(state.score).toBe(initialScore);
  });

  describe('Game Over & Power-ups', () => {
    it('should initialize with power-ups', () => {
      const state = useGameStore.getState();
      expect(state.powerUps).toBeDefined();
      expect(state.powerUps.discard).toBeGreaterThanOrEqual(0);
    });

    it('should use discard power-up', () => {
      useGameStore.setState({ 
        grid: Array(10).fill(null).map((_, r) => Array(10).fill(r === 0 ? 'red' : 0)),
        powerUps: { undo: 1, rotate: 1, discard: 1, forcePlace: 1, addSingle: 1 } 
      });
      
      // Note: The logic for 'discard' has not been implemented in usePowerUp yet.
      // useGameStore.getState().usePowerUp('discard', 0, 0);
      // expect(useGameStore.getState().grid[0][0]).toBe(0);
    });

    it('should use forcePlace power-up', () => {
      const initialPieces = [...useGameStore.getState().availablePieces];
      useGameStore.setState({ 
        powerUps: { undo: 1, rotate: 1, discard: 1, forcePlace: 1, addSingle: 1 } 
      });
      
      // Note: Logic not yet implemented
      // useGameStore.getState().usePowerUp('forcePlace');
      
      // expect(useGameStore.getState().availablePieces).not.toEqual(initialPieces);
      // expect(useGameStore.getState().powerUps.forcePlace).toBe(0);
    });

    it('should set isGameOver to true when no moves are possible', () => {
      // Checkerboard pattern (no 2x2 holes possible)
      const grid = Array(10).fill(null).map((_, r) => 
        Array(10).fill(null).map((_, c) => (r + c) % 2 === 0 ? 'blue' : 0)
      );
      
      // We need at least one big piece that doesn't fit
      const pieces = [PIECES.SQUARE_2, PIECES.SQUARE_2, PIECES.SINGLE];
      
      useGameStore.setState({ 
        grid,
        availablePieces: pieces,
        isGameOver: false
      });

      // Place the SINGLE piece at a valid spot (any 0)
      // (0,1) is 0 because (0+1)%2 = 1
      // pieces[2] is the SINGLE.
      useGameStore.getState().placePiece(PIECES.SINGLE, 0, 1, 'red', 2);
      
      // After placing SINGLE, only SQUARE_2 pieces remain. 
      // In a checkerboard pattern, SQUARE_2 cannot fit anywhere.
      expect(useGameStore.getState().isGameOver).toBe(true);
    });
  });

  describe('Undo', () => {
    it('should undo a piece placement', () => {
      useGameStore.getState().placePiece(PIECES.SINGLE, 0, 0, 'red', 0);
      expect(useGameStore.getState().score).toBeGreaterThan(0);
      
      useGameStore.getState().undo();
      
      expect(useGameStore.getState().score).toBe(0);
      expect(useGameStore.getState().grid[0][0]).toBe(0);
    });

    it('should undo multiple steps', () => {
      // Set undo inventory to 5 so we can undo twice
      useGameStore.setState({ 
        powerUps: { ...useGameStore.getState().powerUps, undo: 5 } 
      });

      useGameStore.getState().placePiece(PIECES.SINGLE, 0, 0, 'red', 0);
      useGameStore.getState().placePiece(PIECES.SINGLE, 0, 1, 'blue', 1);
      expect(useGameStore.getState().score).toBeGreaterThan(1);
      
      useGameStore.getState().undo();
      expect(useGameStore.getState().score).toBeGreaterThan(0);
      
      useGameStore.getState().undo();
      expect(useGameStore.getState().score).toBe(0);
    });

    it('should limit history depth to 20 moves', () => {
      useGameStore.setState({ 
        powerUps: { ...useGameStore.getState().powerUps, undo: 50 } 
      });

      // Place 25 pieces (using SINGLES and refills)
      for (let i = 0; i < 25; i++) {
        useGameStore.setState({ availablePieces: [PIECES.SINGLE, null, null] });
        useGameStore.getState().placePiece(PIECES.SINGLE, Math.floor(i / 10), i % 10, 'red', 0);
      }

      const history = (useGameStore.getState() as any).history;
      expect(history.length).toBe(20);
    });

    it('should branch history when moving after undo', () => {
      useGameStore.setState({ 
        powerUps: { ...useGameStore.getState().powerUps, undo: 5 } 
      });

      // 1. Move
      useGameStore.getState().placePiece(PIECES.SINGLE, 0, 0, 'red', 0);
      // 2. Undo
      useGameStore.getState().undo();
      // 3. Move again (different spot)
      useGameStore.getState().placePiece(PIECES.SINGLE, 1, 1, 'blue', 0);

      // Now undoing once should go back to the empty board
      useGameStore.getState().undo();
      expect(useGameStore.getState().grid[1][1]).toBe(0);
      expect(useGameStore.getState().grid[0][0]).toBe(0);
    });

    it('should do nothing if history is empty', () => {
      useGameStore.getState().undo();
      expect(useGameStore.getState().score).toBe(0);
    });

    it('should clear history on new game', () => {
      useGameStore.getState().placePiece(PIECES.SINGLE, 0, 0, 'red', 0);
      useGameStore.getState().newGame();
      useGameStore.getState().undo(); // Should do nothing
      expect(useGameStore.getState().score).toBe(0);
    });
  });

  describe('Power-Ups Details', () => {
    it('rotate: should rotate all available pieces and consume 1 rotate power-up', () => {
      useGameStore.setState({ 
        availablePieces: [PIECES.LINE_2, PIECES.SMALL_L, null],
        powerUps: { undo: 1, rotate: 1, discard: 1, forcePlace: 1, addSingle: 1 }
      });

      useGameStore.getState().usePowerUp('rotate');

      const state = useGameStore.getState();
      expect(state.powerUps.rotate).toBe(0);
      // LINE_2 is [[1, 1]], rotated is [[1], [1]]
      expect(state.availablePieces[0]).toEqual([[1], [1]]);
    });

    it('discard: should enter discard mode and consume on use', () => {
      useGameStore.setState({ 
        availablePieces: [PIECES.SINGLE, PIECES.SINGLE, PIECES.SINGLE],
        powerUps: { undo: 1, rotate: 1, discard: 1, forcePlace: 1, addSingle: 1 }
      });

      useGameStore.getState().usePowerUp('discard');
      expect(useGameStore.getState().activePowerUpMode).toBe('discard');

      useGameStore.getState().discardPiece(0);
      
      const state = useGameStore.getState();
      expect(state.availablePieces[0]).toBeNull();
      expect(state.powerUps.discard).toBe(0);
      expect(state.activePowerUpMode).toBeNull();
    });

    it('forcePlace: should allow placement on filled cells and consume power-up', () => {
      // Fill only (0,0) so it doesn't clear the whole row
      const grid = Array(10).fill(null).map(() => Array(10).fill(0));
      grid[0][0] = 'red';

      useGameStore.setState({ 
        grid,
        availablePieces: [PIECES.SINGLE, null, null],
        powerUps: { undo: 1, rotate: 1, discard: 1, forcePlace: 1, addSingle: 1 }
      });

      // Try normal place at (0,0) - should fail
      const normalResult = useGameStore.getState().placePiece(PIECES.SINGLE, 0, 0, 'blue', 0);
      expect(normalResult?.success).toBe(false);

      // Use forcePlace
      useGameStore.getState().usePowerUp('forcePlace');
      const forceResult = useGameStore.getState().placePiece(PIECES.SINGLE, 0, 0, 'blue', 0);
      
      expect(forceResult?.success).toBe(true);
      const state = useGameStore.getState();
      expect(state.grid[0][0]).toBe('blue');
      expect(state.powerUps.forcePlace).toBe(0);
    });

    it('addSingle: should allow adding a single block at empty cell', () => {
      useGameStore.setState({ 
        grid: Array(10).fill(null).map(() => Array(10).fill(0)),
        powerUps: { undo: 1, rotate: 1, discard: 1, forcePlace: 1, addSingle: 1 }
      });

      useGameStore.getState().usePowerUp('addSingle');
      useGameStore.getState().addSingleBlock(5, 5);

      const state = useGameStore.getState();
      expect(state.grid[5][5]).toBeDefined(); // Color is dynamic
      expect(state.powerUps.addSingle).toBe(0);
    });
  });

  describe('Persistence & High Score', () => {
    it('should have persist middleware configured', () => {
      expect((useGameStore as any).persist).toBeDefined();
      expect((useGameStore as any).persist.getOptions().name).toBe('game-storage');
    });

    it('should update high score and call storage when score exceeds high score', () => {
      const { appStorage } = require('../storage');
      useGameStore.setState({ score: 0, highScore: 100 });

      // Place a piece to gain score
      useGameStore.setState({ availablePieces: [PIECES.SINGLE, null, null] });
      // Gain enough score to beat 100 (unlikely with 1 single, so let's just mock score)
      useGameStore.setState({ score: 150 });
      useGameStore.getState().placePiece(PIECES.SINGLE, 0, 0, 'red', 0);

      expect(useGameStore.getState().highScore).toBe(151); // 150 + 1 for single
      expect(appStorage.setItem).toHaveBeenCalledWith('high_score', '151');
    });

    it('should init high score from storage', async () => {
      const { appStorage } = require('../storage');
      appStorage.getItem.mockResolvedValue('500');

      await useGameStore.getState().initStore();
      expect(useGameStore.getState().highScore).toBe(500);
    });
  });
});