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
});
