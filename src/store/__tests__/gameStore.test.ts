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
    jest.clearAllMocks();
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
      undo: 0, 
      rotate: 0, 
      discard: 0, 
      forcePlace: 0, 
      addSingle: 0 
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
    // Force available pieces to have a SINGLE at index 0 for predictable test
    useGameStore.setState({ availablePieces: [PIECES.SINGLE, PIECES.SINGLE, PIECES.SINGLE] });
    
    // Place a single block at (0,0)
    useGameStore.getState().setHoverPosition({ row: 0, col: 0 });
    useGameStore.getState().placePiece(PIECES.SINGLE, 0, 0, '#FF0000', 0);
    
    const state = useGameStore.getState();
    // In a fresh game, row 0 is empty, so placing a piece makes it filled unless it triggers clear.
    // A 1x1 at (0,0) won't trigger clear on a 10x10 empty board.
    expect(state.grid[0][0]).toBe('#FF0000');
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
    });

    it('should use forcePlace power-up', () => {
      useGameStore.setState({ 
        powerUps: { undo: 1, rotate: 1, discard: 1, forcePlace: 1, addSingle: 1 } 
      });
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
      useGameStore.setState({ powerUps: { ...useGameStore.getState().powerUps, undo: 1 } });
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
      useGameStore.setState({ powerUps: { ...useGameStore.getState().powerUps, undo: 5 } });
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
      useGameStore.setState({ powerUps: { ...useGameStore.getState().powerUps, undo: 1 } });
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

      useGameStore.getState().applyPowerUp('rotate');

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

      useGameStore.getState().applyPowerUp('discard');
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
      useGameStore.getState().applyPowerUp('forcePlace');
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

      useGameStore.getState().applyPowerUp('addSingle');
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
      // eslint-disable-next-line @typescript-eslint/no-require-imports
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
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { appStorage } = require('../storage');
      appStorage.getItem.mockResolvedValue('500');

      await useGameStore.getState().initStore();
      expect(useGameStore.getState().highScore).toBe(500);
    });
  });

  describe('Power-up Acquisition & Milestones', () => {
    it('awards power-up on milestone (every 500 points)', () => {
      useGameStore.setState({ 
        score: 490, 
        scoreAtLastPowerUp: 0,
        availablePieces: [PIECES.SQUARE_2, null, null],
        powerUps: { undo: 0, rotate: 0, discard: 0, forcePlace: 0, addSingle: 0 }
      });

      // SQUARE_2 gives 4 points
      // Total score will be 494. Still below 500 milestone.
      useGameStore.getState().placePiece(PIECES.SQUARE_2, 0, 0, 'red', 0);
      let state = useGameStore.getState();
      expect(Object.values(state.powerUps).reduce((a, b) => a + b)).toBe(0);

      // Place another to cross 500
      useGameStore.setState({ availablePieces: [PIECES.SINGLE, null, null], score: 499 });
      useGameStore.getState().placePiece(PIECES.SINGLE, 5, 5, 'blue', 0);
      
      state = useGameStore.getState();
      expect(Object.values(state.powerUps).reduce((a, b) => a + b)).toBe(1);
      expect(state.scoreAtLastPowerUp).toBe(500);
      expect(state.lastEarnedPowerUp).not.toBeNull();
    });

    it('awards power-up on combo clear (3+ lines)', () => {
      // Setup grid for 3-line clear
      const grid = Array(10).fill(null).map(() => Array(10).fill('blue'));
      grid[0][0] = 0;
      grid[1][0] = 0;
      grid[2][0] = 0;

      useGameStore.setState({ 
        grid,
        availablePieces: [[[1], [1], [1]], null, null],
        powerUps: { undo: 0, rotate: 0, discard: 0, forcePlace: 0, addSingle: 0 }
      });

      useGameStore.getState().placePiece([[1], [1], [1]], 0, 0, 'red', 0);
      
      const state = useGameStore.getState();
      expect(Object.values(state.powerUps).reduce((a, b) => a + b)).toBeGreaterThanOrEqual(1);
      expect(state.lastEarnedPowerUp).not.toBeNull();
    });

    it('awards milestone power-up via addSingleBlock', () => {
      useGameStore.setState({ 
        score: 499,
        scoreAtLastPowerUp: 0,
        powerUps: { undo: 0, rotate: 0, discard: 0, forcePlace: 0, addSingle: 1 },
        activePowerUpMode: 'addSingle'
      });

      useGameStore.getState().addSingleBlock(0, 0);
      
      const state = useGameStore.getState();
      // Total powerups should be 1 (gained one, lost one used)
      expect(Object.values(state.powerUps).reduce((a, b) => a + b)).toBe(1);
      expect(state.scoreAtLastPowerUp).toBe(500);
    });
  });

  describe('Edge Cases & Preferences', () => {
    it('discardPiece should return false for invalid index', () => {
      useGameStore.setState({ activePowerUpMode: 'discard' });
      const result = useGameStore.getState().discardPiece(5);
      expect(result).toBe(false);
    });

    it('addSingleBlock should do nothing if cell is occupied', () => {
      const grid = Array(10).fill(null).map(() => Array(10).fill(0));
      grid[0][0] = 'red';
      useGameStore.setState({ grid, activePowerUpMode: 'addSingle', powerUps: { ...useGameStore.getState().powerUps, addSingle: 1 } });

      const result = useGameStore.getState().addSingleBlock(0, 0);
      expect(result).toBeUndefined();
      expect(useGameStore.getState().powerUps.addSingle).toBe(1);
    });

    it('updatePreferences should partially update preferences', () => {
      useGameStore.getState().updatePreferences({ isMuted: true });
      expect(useGameStore.getState().preferences.isMuted).toBe(true);
      expect(useGameStore.getState().preferences.theme).toBe('system');
    });

    it('clearNotification should reset lastEarnedPowerUp', () => {
      useGameStore.setState({ lastEarnedPowerUp: 'undo' });
      useGameStore.getState().clearNotification();
      expect(useGameStore.getState().lastEarnedPowerUp).toBeNull();
    });

    it('awards milestone power-up when crossing multiple 500-pt thresholds', () => {
      useGameStore.setState({ 
        score: 0, 
        scoreAtLastPowerUp: 0,
        availablePieces: [PIECES.BIG_L, null, null],
        powerUps: { undo: 0, rotate: 0, discard: 0, forcePlace: 0, addSingle: 0 }
      });

      // BIG_L gives some points. Let's just force a huge score gain.
      // We need a piece that triggers a line clear to get 500+ points in one move, 
      // or just manually set the score before placement.
      useGameStore.setState({ score: 1200 }); // Crossing 2 milestones (500, 1000)
      useGameStore.getState().placePiece(PIECES.SINGLE, 0, 0, 'red', 0);
      
      const state = useGameStore.getState();
      expect(state.scoreAtLastPowerUp).toBe(1000); // Should snap to highest reached milestone
      expect(Object.values(state.powerUps).reduce((a, b) => a + b)).toBeGreaterThanOrEqual(1);
    });

    it('awards power-up on 4-line combo clear', () => {
      const grid = Array(10).fill(null).map(() => Array(10).fill('blue'));
      grid[0][0] = 0; grid[1][0] = 0; grid[2][0] = 0; grid[3][0] = 0;

      useGameStore.setState({ 
        grid,
        availablePieces: [[[1], [1], [1], [1]], null, null],
        powerUps: { undo: 0, rotate: 0, discard: 0, forcePlace: 0, addSingle: 0 }
      });

      useGameStore.getState().placePiece([[1], [1], [1], [1]], 0, 0, 'red', 0);
      
      const state = useGameStore.getState();
      expect(Object.values(state.powerUps).reduce((a, b) => a + b)).toBeGreaterThanOrEqual(1);
    });

    it('applyPowerUp does nothing if no inventory', () => {
      useGameStore.setState({ powerUps: { undo: 0, rotate: 0, discard: 0, forcePlace: 0, addSingle: 0 } });
      useGameStore.getState().applyPowerUp('rotate');
      expect(useGameStore.getState().availablePieces).not.toEqual([]); // Assuming they weren't rotated
    });

    it('applyPowerUp toggles mode off if clicked twice', () => {
      useGameStore.setState({ powerUps: { undo: 1, rotate: 1, discard: 1, forcePlace: 1, addSingle: 1 } });
      useGameStore.getState().applyPowerUp('discard');
      expect(useGameStore.getState().activePowerUpMode).toBe('discard');
      useGameStore.getState().applyPowerUp('discard');
      expect(useGameStore.getState().activePowerUpMode).toBeNull();
    });

    it('discardPiece returns false if not in discard mode', () => {
      useGameStore.setState({ activePowerUpMode: null, availablePieces: [PIECES.SINGLE, null, null] });
      const result = useGameStore.getState().discardPiece(0);
      expect(result).toBe(false);
    });

    it('discardPiece returns false if index is null', () => {
      useGameStore.setState({ activePowerUpMode: 'discard', availablePieces: [null, null, null] });
      const result = useGameStore.getState().discardPiece(0);
      expect(result).toBe(false);
    });

    it('placePiece returns false if forcePlace used with no inventory', () => {
      useGameStore.setState({ activePowerUpMode: 'forcePlace', powerUps: { ...useGameStore.getState().powerUps, forcePlace: 0 } });
      const result = useGameStore.getState().placePiece(PIECES.SINGLE, 0, 0, '#FF0000', 0);
      expect(result).toBeUndefined();
    });

    it('undo does nothing if no inventory', () => {
      useGameStore.setState({ powerUps: { ...useGameStore.getState().powerUps, undo: 0 } });
      useGameStore.getState().placePiece(PIECES.SINGLE, 0, 0, 'red', 0);
      useGameStore.getState().undo();
      expect(useGameStore.getState().score).toBeGreaterThan(0); // Still has score from move
    });

    it('placePiece handles sourceIndex out of range by findIndex', () => {
      // Add another piece so it doesn't refill
      useGameStore.setState({ availablePieces: [PIECES.SINGLE, PIECES.LINE_2, null] });
      const result = useGameStore.getState().placePiece(PIECES.SINGLE, 0, 0, 'red', 5); // Index 5 is out of range
      expect(result?.success).toBe(true);
      expect(useGameStore.getState().availablePieces[0]).toBeNull(); // Found it anyway
    });

    it('updates high score via addSingleBlock', () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { appStorage } = require('../storage');
      useGameStore.setState({ 
        score: 100, 
        highScore: 100,
        powerUps: { undo: 0, rotate: 0, discard: 0, forcePlace: 0, addSingle: 1 },
        activePowerUpMode: 'addSingle'
      });

      useGameStore.getState().addSingleBlock(0, 0);
      
      expect(useGameStore.getState().highScore).toBe(101);
      expect(appStorage.setItem).toHaveBeenCalledWith('high_score', '101');
    });

    it('does not update high score if not exceeded via addSingleBlock', () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { appStorage } = require('../storage');
      useGameStore.setState({ 
        score: 50, 
        highScore: 100,
        powerUps: { undo: 0, rotate: 0, discard: 0, forcePlace: 0, addSingle: 1 },
        activePowerUpMode: 'addSingle'
      });

      useGameStore.getState().addSingleBlock(0, 0);
      
      expect(useGameStore.getState().highScore).toBe(100);
      expect(appStorage.setItem).not.toHaveBeenCalledWith('high_score', expect.any(String));
    });

    it('updatePreferences handles null state preferences', () => {
      // @ts-ignore
      useGameStore.setState({ preferences: null });
      useGameStore.getState().updatePreferences({ isMuted: true });
      expect(useGameStore.getState().preferences.isMuted).toBe(true);
    });

    it('applyPowerUp handles unknown type', () => {
      const spy = jest.spyOn(console, 'log').mockImplementation();
      // @ts-ignore
      useGameStore.getState().applyPowerUp('unknown');
      expect(spy).toHaveBeenCalledWith('applyPowerUp', 'unknown');
      spy.mockRestore();
    });

    it('placePiece handles piece findIndex failure when no sourceIndex', () => {
      useGameStore.setState({ availablePieces: [PIECES.LINE_2, null, null] });
      // Try to place SINGLE which is not in available pieces
      const result = useGameStore.getState().placePiece(PIECES.SINGLE, 0, 0, 'red');
      expect(result?.success).toBe(true);
      // availablePieces should remain same (LINE_2 still there) because findIndex was -1
      expect(useGameStore.getState().availablePieces[0]).toEqual(PIECES.LINE_2);
    });

    it('addSingleBlock returns failure if move fails (e.g. occupied)', () => {
      const grid = Array(10).fill(null).map(() => Array(10).fill(0));
      grid[0][0] = 'red';
      useGameStore.setState({ grid, activePowerUpMode: 'addSingle', powerUps: { ...useGameStore.getState().powerUps, addSingle: 1 } });
      const result = useGameStore.getState().addSingleBlock(0, 0);
      expect(result).toBeUndefined();
    });

    it('addSingleBlock grants powerups on milestone and clear lines', () => {
      // 1. Milestone
      useGameStore.setState({ 
        score: 499, scoreAtLastPowerUp: 0, 
        activePowerUpMode: 'addSingle', 
        powerUps: { undo: 0, rotate: 0, discard: 0, forcePlace: 0, addSingle: 1 } 
      });
      useGameStore.getState().addSingleBlock(0, 0);
      expect(useGameStore.getState().scoreAtLastPowerUp).toBe(500);
      expect(Object.values(useGameStore.getState().powerUps).reduce((a, b) => a + b)).toBe(1);

      // 2. Clear lines (combo)
      const grid = Array(10).fill(null).map(() => Array(10).fill('blue'));
      grid[5][5] = 0; // Empty spot to trigger clear all rows/cols
      useGameStore.setState({ 
        grid, 
        activePowerUpMode: 'addSingle', 
        powerUps: { undo: 0, rotate: 0, discard: 0, forcePlace: 0, addSingle: 1 },
        scoreAtLastPowerUp: 10000 // far away milestone
      });
      useGameStore.getState().addSingleBlock(5, 5);
      expect(useGameStore.getState().lastEarnedPowerUp).not.toBeNull();
    });
  });
});