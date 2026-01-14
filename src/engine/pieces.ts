import { Piece } from './types';

export type PieceType =
  | 'SINGLE'
  | 'LINE_2'
  | 'LINE_3'
  | 'LINE_4'
  | 'LINE_5'
  | 'SQUARE_2'
  | 'SQUARE_3'
  | 'SMALL_L'
  | 'BIG_L';

export const PIECES: Record<PieceType, Piece> = {
  SINGLE: [[1]],

  LINE_2: [[1, 1]],
  LINE_3: [[1, 1, 1]],
  LINE_4: [[1, 1, 1, 1]],
  LINE_5: [[1, 1, 1, 1, 1]],

  SQUARE_2: [
    [1, 1],
    [1, 1],
  ],

  SQUARE_3: [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ],

  SMALL_L: [
    [1, 1],
    [0, 1],
  ],

  BIG_L: [
    [1, 1, 1],
    [1, 0, 0],
    [1, 0, 0],
  ],
};

/**
 * Rotates a piece 90 degrees clockwise.
 * @param piece The piece matrix to rotate
 * @returns A new, rotated piece matrix
 */
export const rotatePiece = (piece: Piece): Piece => {
  const rows = piece.length;
  const cols = piece[0].length;
  
  // Create a new matrix with swapped dimensions (rows -> cols, cols -> rows)
  const rotated: Piece = Array.from({ length: cols }, () => Array(rows).fill(0));

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // New column is original row (inverted)
      // New row is original column
      rotated[c][rows - 1 - r] = piece[r][c];
    }
  }

  return rotated;
};
