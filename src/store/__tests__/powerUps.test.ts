import { useGameStore } from '../gameStore';

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

describe('Power-Ups State', () => {
  beforeEach(() => {
    useGameStore.getState().newGame();
  });

  it('should initialize with inventory for all 5 power-ups', () => {
    const state = useGameStore.getState();
    expect(state.powerUps).toEqual({
      undo: 1,
      rotate: 1,
      discard: 1,
      forcePlace: 1,
      addSingle: 1,
    });
  });

  it('should initialize activePowerUpMode as null', () => {
    const state = useGameStore.getState();
    // @ts-ignore - property not yet on type
    expect(state.activePowerUpMode).toBeNull();
  });

  it('should consume undo inventory when used', () => {
    // Manually set inventory
    useGameStore.setState({
      powerUps: {
        undo: 5,
        rotate: 1,
        discard: 1,
        forcePlace: 1,
        addSingle: 1
      }
    });

    // Mock pieces to ensure we can place them
    const piece = [[1]];
    useGameStore.getState().placePiece(piece, 0, 0, 'red');
    
    // Verify move happened
    expect(useGameStore.getState().score).toBeGreaterThan(0);
    
    // Perform Undo
    useGameStore.getState().undo();
    
    // Verify Undo happened
    const state = useGameStore.getState();
    expect(state.score).toBe(0);
    
    // Verify inventory consumption
    expect(state.powerUps.undo).toBe(4);
  });

  it('should rotate all available pieces and consume inventory', () => {
    // Setup specific pieces we know (e.g. Line-2 horizontal)
    // LINE_2 is [[1, 1]]
    const line2 = [[1, 1]];
    useGameStore.setState({
      availablePieces: [line2, null, line2],
      powerUps: { ...useGameStore.getState().powerUps, rotate: 1 }
    });

    // Verify initial state
    let state = useGameStore.getState();
    expect(state.availablePieces[0]).toEqual(line2);
    
    // Perform Rotate
    useGameStore.getState().usePowerUp('rotate');
    
    // Verify Rotation
    state = useGameStore.getState();
    // Rotated Line-2 should be [[1], [1]] (Vertical)
    const expectedRotated = [[1], [1]];
    expect(state.availablePieces[0]).toEqual(expectedRotated);
    expect(state.availablePieces[1]).toBeNull(); // Should stay null
    expect(state.availablePieces[2]).toEqual(expectedRotated);
    
    // Verify Inventory
    expect(state.powerUps.rotate).toBe(0);
  });

  it('should not rotate if inventory is 0', () => {
    const line2 = [[1, 1]];
    useGameStore.setState({
      availablePieces: [line2, null, line2],
      powerUps: { ...useGameStore.getState().powerUps, rotate: 0 }
    });

    useGameStore.getState().usePowerUp('rotate');
    
    const state = useGameStore.getState();
    expect(state.availablePieces[0]).toEqual(line2); // Unchanged
    expect(state.powerUps.rotate).toBe(0);
  });

  describe('Discard Power-Up', () => {
    it('should toggle discard mode', () => {
      useGameStore.getState().usePowerUp('discard');
      expect(useGameStore.getState().activePowerUpMode).toBe('discard');
      
      useGameStore.getState().usePowerUp('discard');
      expect(useGameStore.getState().activePowerUpMode).toBeNull();
    });

    it('should discard a piece, consume inventory, and reset mode', () => {
      const line2 = [[1, 1]];
      useGameStore.setState({
        availablePieces: [line2, null, line2],
        powerUps: { ...useGameStore.getState().powerUps, discard: 1 },
        activePowerUpMode: 'discard'
      });

      // @ts-ignore - discardPiece not yet defined
      useGameStore.getState().discardPiece(0);

      const state = useGameStore.getState();
      expect(state.availablePieces[0]).toBeNull();
      expect(state.powerUps.discard).toBe(0);
      expect(state.activePowerUpMode).toBeNull();
    });

    it('should NOT discard if not in discard mode', () => {
      const line2 = [[1, 1]];
      useGameStore.setState({
        availablePieces: [line2, null, line2],
        powerUps: { ...useGameStore.getState().powerUps, discard: 1 },
        activePowerUpMode: null
      });

      // @ts-ignore
      useGameStore.getState().discardPiece(0);

      const state = useGameStore.getState();
      expect(state.availablePieces[0]).toEqual(line2);
      expect(state.powerUps.discard).toBe(1);
    });
    
    it('should refill tray if last piece is discarded', () => {
        // Setup: Only 1 piece left
        const line2 = [[1, 1]];
        useGameStore.setState({
          availablePieces: [null, null, line2],
          powerUps: { ...useGameStore.getState().powerUps, discard: 1 },
          activePowerUpMode: 'discard'
        });
  
        // @ts-ignore
        useGameStore.getState().discardPiece(2);
  
        const state = useGameStore.getState();
        // Should be refilled (3 pieces, none null)
        expect(state.availablePieces.every(p => p !== null)).toBe(true);
        expect(state.availablePieces.length).toBe(3);
    });
  });
});
