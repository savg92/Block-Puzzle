import { canPlacePiece, placePiece, clearLines, canAnyPieceFit } from './board';
import { calculateScore } from './scoring';
import { Grid, Piece } from './types';

export interface MoveResult {
  success: boolean;
  clearedLines: number;
  scoreGained: number;
  fullRows: number[];
  fullCols: number[];
}

/**
 * GameEngine provides a unified interface for the core game logic.
 * It is designed to be used by the state management layer (Zustand).
 */
export class GameEngine {
  private grid: Grid;
  private score: number;

  constructor(initialGrid: Grid, initialScore: number = 0) {
    this.grid = initialGrid.map((row) => [...row]);
    this.score = initialScore;
  }

  /**
   * Attempts to make a move.
   * Updates the internal state if the move is valid.
   */
  public makeMove(piece: Piece, row: number, col: number, color: string | number = 1, options?: { ignoreCollision?: boolean }): MoveResult {
    const ignoreCollision = options?.ignoreCollision ?? false;
    if (!ignoreCollision) {
      if (!canPlacePiece(this.grid, piece, row, col)) {
        return { success: false, clearedLines: 0, scoreGained: 0, fullRows: [], fullCols: [] };
      }
    }

    // 1. Place the piece
    const placedGrid = placePiece(this.grid, piece, row, col, color, options?.ignoreCollision);

    // 2. Clear lines
    const { grid: clearedGrid, clearedLines, fullRows, fullCols } = clearLines(placedGrid);

    // 3. Calculate score
    const scoreGained = calculateScore(piece, clearedLines);

    // 4. Update state
    this.grid = clearedGrid;
    this.score += scoreGained;

    return {
      success: true,
      clearedLines,
      scoreGained,
      fullRows,
      fullCols,
    };
  }

  /**
   * Checks if the game is over given a set of available pieces.
   */
  public checkGameOver(availablePieces: Piece[]): boolean {
    return !canAnyPieceFit(this.grid, availablePieces);
  }

  public getGrid(): Grid {
    return this.grid.map((row) => [...row]);
  }

  public getScore(): number {
    return this.score;
  }
}
