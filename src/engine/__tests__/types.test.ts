import { Grid, Piece, GameState } from '../types';

describe('Engine Types', () => {
  it('should define a valid Grid structure', () => {
    const grid: Grid = [
      [0, 1],
      [1, 0],
    ];
    expect(grid).toBeDefined();
    expect(grid[0][1]).toBe(1);
  });

  it('should define a valid Piece structure', () => {
    const piece: Piece = [
      [1, 1],
      [1, 1],
    ];
    expect(piece).toBeDefined();
    expect(piece.length).toBe(2);
  });

  it('should define a valid GameState structure', () => {
    const gameState: GameState = {
      grid: [[0]],
      score: 100,
      availablePieces: [],
      isGameOver: false,
    };
    expect(gameState.score).toBe(100);
    expect(gameState.isGameOver).toBe(false);
  });
});
