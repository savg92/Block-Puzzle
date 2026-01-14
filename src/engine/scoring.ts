import { Piece } from './types';

/**
 * Calculates the score for a move.
 * Formula:
 * - Placement: +1 per block in the piece.
 * - Lines: +10 per line cleared.
 * - Bonus: +5 * lines * (lines - 1) for multi-line clears.
 * 
 * @param piece The piece that was placed
 * @param linesCleared The number of lines cleared in this move
 * @returns The total score for this move
 */
export const calculateScore = (piece: Piece, linesCleared: number): number => {
  let score = 0;

  // Placement Score
  for (const row of piece) {
    for (const cell of row) {
      if (cell !== 0) {
        score += 1;
      }
    }
  }

  // Line Score
  if (linesCleared > 0) {
    score += 10 * linesCleared;
    
    // Multi-line Bonus (Quadratic growth)
    // 2 lines -> 10 bonus
    // 3 lines -> 30 bonus
    // 4 lines -> 60 bonus
    if (linesCleared > 1) {
        score += 5 * linesCleared * (linesCleared - 1);
    }
  }

  return score;
};
