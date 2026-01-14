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

    it('should detect game over', () => {
        const board = [
            [1, 1],
            [1, 1]
        ];
        const engine = new GameEngine(board);
        
        // All pieces should fail to fit
        expect(engine.checkGameOver([PIECES.SINGLE])).toBe(true);
    });
});
