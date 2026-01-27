import { GameEngine } from '../index';
import { PIECES } from '../pieces';
import { Grid } from '../types';

describe('GameEngine Integration', () => {
    const createSmallBoard = (size: number): Grid => 
        Array.from({ length: size }, () => Array(size).fill(0));

    it('should handle a simple placement and scoring sequence', () => {
        const board = createSmallBoard(3);
        const engine = new GameEngine(board);
        
        // Initial state
        expect(engine.getScore()).toBe(0);
        
        // Place a single piece at (0,0)
        const piece = PIECES.SINGLE;
        const result = engine.makeMove(piece, 0, 0);
        
        expect(result.success).toBe(true);
        expect(engine.getScore()).toBe(1); // 1 block
        expect(engine.getGrid()[0][0]).toBe(1);
        expect(result.clearedLines).toBe(0);
    });

    it('should handle line clearing and scoring', () => {
        // 2x2 board
        const board = [
            [1, 0],
            [0, 0]
        ];
        const engine = new GameEngine(board);
        
        // Place a single piece at (0,1) to clear top row
        const piece = PIECES.SINGLE;
        const result = engine.makeMove(piece, 0, 1);
        
        expect(result.success).toBe(true);
        expect(result.clearedLines).toBe(1);
        
        // Score: 1 (placement) + 10 (1 line) = 11
        expect(engine.getScore()).toBe(11);
        
        // Top row should be cleared
        expect(engine.getGrid()[0]).toEqual([0, 0]);
        expect(engine.getGrid()[1]).toEqual([0, 0]);
    });

    it('should return failure if move is invalid', () => {
        const board = createSmallBoard(2);
        const engine = new GameEngine(board);
        const result = engine.makeMove(PIECES.SQUARE_2, 1, 1); // Out of bounds
        expect(result.success).toBe(false);
    });

    it('should handle ignoreCollision option', () => {
        const board = [
            [1, 0],
            [0, 0]
        ];
        const engine = new GameEngine(board);
        
        // Place a single piece at (0,0) where there is already a block
        // Without ignoreCollision, it should fail
        const result1 = engine.makeMove(PIECES.SINGLE, 0, 0);
        expect(result1.success).toBe(false);
        
        // With ignoreCollision, it should succeed
        const result2 = engine.makeMove(PIECES.SINGLE, 0, 0, 1, { ignoreCollision: true });
        expect(result2.success).toBe(true);
        expect(engine.getGrid()[0][0]).toBe(1);
    });

    it('should still succeed if ignoreCollision is true even if canPlacePiece would return false', () => {
        const board = [[1]];
        const engine = new GameEngine(board);
        // Piece is SINGLE, (0,0) is occupied. 
        // canPlacePiece would return false.
        const result = engine.makeMove(PIECES.SINGLE, 0, 0, 1, { ignoreCollision: true });
        expect(result.success).toBe(true);
    });

    it('should return fullRows and fullCols in result', () => {
        const board = [
            [1, 0],
            [0, 0]
        ];
        const engine = new GameEngine(board);
        const result = engine.makeMove(PIECES.SINGLE, 0, 1);
        
        expect(result.success).toBe(true);
        expect(result.fullRows).toEqual([0]);
        expect(result.fullCols).toEqual([]);
    });

    it('should handle options.ignoreCollision being false explicitly', () => {
        const board = [[1]];
        const engine = new GameEngine(board);
        const result = engine.makeMove(PIECES.SINGLE, 0, 0, 1, { ignoreCollision: false });
        expect(result.success).toBe(false);
    });

    it('should handle options being undefined explicitly', () => {
        const board = [[0]];
        const engine = new GameEngine(board);
        const result = engine.makeMove(PIECES.SINGLE, 0, 0, 1, undefined);
        expect(result.success).toBe(true);
    });

    it('should detect game over', () => {
        const board = [
            [1, 1],
            [1, 1]
        ];
        const engine = new GameEngine(board);
        
        // All pieces should fail to fit
        expect(engine.checkGameOver([PIECES.SINGLE])).toBe(true);
    });

    it('should fail if move is out of bounds even with ignoreCollision', () => {
        const board = [[0]];
        const engine = new GameEngine(board);
        // Place piece way out of bounds
        expect(() => engine.makeMove(PIECES.SINGLE, 10, 10, 1, { ignoreCollision: true })).toThrow();
    });

    it('should initialize with provided score', () => {
        const board = [[0]];
        const engine = new GameEngine(board, 100);
        expect(engine.getScore()).toBe(100);
    });
});
