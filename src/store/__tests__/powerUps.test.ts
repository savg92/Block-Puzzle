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
    useGameStore.getState().applyPowerUp('rotate');
    
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

    useGameStore.getState().applyPowerUp('rotate');
    
    const state = useGameStore.getState();
    expect(state.availablePieces[0]).toEqual(line2); // Unchanged
    expect(state.powerUps.rotate).toBe(0);
  });

  describe('Discard Power-Up', () => {
    it('should toggle discard mode', () => {
      useGameStore.getState().applyPowerUp('discard');
      expect(useGameStore.getState().activePowerUpMode).toBe('discard');
      
      useGameStore.getState().applyPowerUp('discard');
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

  describe('Force Place Power-Up', () => {
    it('should bypass collision and consume inventory', () => {
        // Setup: Place a block at 0,0
        const filledGrid = Array(10).fill(null).map(() => Array(10).fill(0));
        filledGrid[0][0] = 'blue';
        
        useGameStore.setState({
            grid: filledGrid,
            activePowerUpMode: 'forcePlace',
            powerUps: { ...useGameStore.getState().powerUps, forcePlace: 1 }
        });

        // Try to place a piece at 0,0 (normally would fail)
        const piece = [[1]];
        useGameStore.getState().placePiece(piece, 0, 0, 'red', 0);

        const state = useGameStore.getState();
        expect(state.grid[0][0]).toBe('red'); // Overwritten
        expect(state.powerUps.forcePlace).toBe(0);
        expect(state.activePowerUpMode).toBeNull();
    });
  });

  describe('Add Single Power-Up', () => {
    it('should place a single block in empty cell', () => {
        useGameStore.setState({
            activePowerUpMode: 'addSingle',
            powerUps: { ...useGameStore.getState().powerUps, addSingle: 1 }
        });

        // @ts-ignore
        useGameStore.getState().addSingleBlock(5, 5);

        const state = useGameStore.getState();
        expect(state.grid[5][5]).not.toBe(0);
        expect(state.powerUps.addSingle).toBe(0);
        expect(state.activePowerUpMode).toBeNull();
    });

    it('should NOT place block in occupied cell', () => {
        const filledGrid = Array(10).fill(null).map(() => Array(10).fill(0));
        filledGrid[5][5] = 'blue';

        useGameStore.setState({
            grid: filledGrid,
            activePowerUpMode: 'addSingle',
            powerUps: { ...useGameStore.getState().powerUps, addSingle: 1 }
        });

        // @ts-ignore
        useGameStore.getState().addSingleBlock(5, 5);

        const state = useGameStore.getState();
        expect(state.grid[5][5]).toBe('blue'); // Unchanged
        expect(state.powerUps.addSingle).toBe(1);
    });
  });

  describe('Power-Up Acquisition', () => {
    it('should award a power-up when score crosses 500 milestone', () => {
        const piece = [[1]]; // 1 block = 1 point
        // Total score will be 490 + 1 + 10 (line) = 501
        
        // Mock grid to have 9 cells in row 5
        const mockGrid = Array(10).fill(null).map(() => Array(10).fill(0));
        for(let i=1; i<10; i++) mockGrid[5][i] = 'blue';

        useGameStore.setState({ 
            grid: mockGrid,
            availablePieces: [piece, null, null],
            score: 490,
            scoreAtLastPowerUp: 0,
            powerUps: { undo: 0, rotate: 0, discard: 0, forcePlace: 0, addSingle: 0 }
        });

        useGameStore.getState().placePiece(piece, 5, 0, 'red', 0);

        const state = useGameStore.getState();
        expect(state.score).toBe(501);
        expect(state.scoreAtLastPowerUp).toBe(500);
        
        const totalPowerUps = Object.values(state.powerUps).reduce((a: number, b: number) => a + b, 0);
        expect(totalPowerUps).toBe(1);
    });

    it('should award a power-up for a combo clear (3+ lines)', () => {
        useGameStore.setState({
            score: 0,
            scoreAtLastPowerUp: 0,
            powerUps: { undo: 0, rotate: 0, discard: 0, forcePlace: 0, addSingle: 0 }
        });

        // Setup a 3-line clear
        const mockGrid = Array(10).fill(null).map(() => Array(10).fill(0));
        for(let r=0; r<3; r++) {
            for(let c=1; c<10; c++) mockGrid[r][c] = 'blue';
        }
        useGameStore.setState({ grid: mockGrid });

        const piece = [[1], [1], [1]]; // 3 vertical blocks
        useGameStore.getState().placePiece(piece, 0, 0, 'red', 0);

        const state = useGameStore.getState();
        expect(state.score).toBeGreaterThan(0);
        
        const totalPowerUps = Object.values(state.powerUps).reduce((a: number, b: number) => a + b, 0);
        // Should get 1 for the 3-line clear
        expect(totalPowerUps).toBe(1);
    });

    it('should award TWO power-ups if both milestone and combo are met', () => {
        useGameStore.setState({
            score: 450,
            scoreAtLastPowerUp: 0,
            powerUps: { undo: 0, rotate: 0, discard: 0, forcePlace: 0, addSingle: 0 }
        });

        // Setup a 3-line clear
        const mockGrid = Array(10).fill(null).map(() => Array(10).fill(0));
        for(let r=0; r<3; r++) {
            for(let c=1; c<10; c++) mockGrid[r][c] = 'blue';
        }
        useGameStore.setState({ grid: mockGrid });

        const piece = [[1], [1], [1]]; // 3 vertical blocks
        useGameStore.getState().placePiece(piece, 0, 0, 'red', 0);

        const state = useGameStore.getState();
        // Score: 3 blocks + 30 (lines) + 30 (bonus) = 63. Total: 450 + 63 = 513
        expect(state.score).toBe(513);
        expect(state.scoreAtLastPowerUp).toBe(500);
        
        const totalPowerUps = Object.values(state.powerUps).reduce((a: number, b: number) => a + b, 0);
        expect(totalPowerUps).toBe(2);
    });
  });
});
