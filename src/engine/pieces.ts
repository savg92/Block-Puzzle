import { Piece } from './types';
import { theme } from '../styles/theme';

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

/**
 * Returns a specified number of random pieces with random orientations.
 */
export const getRandomPieces = (count: number): Piece[] => {
  const allPieces = Object.values(PIECES);
  const selected: Piece[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * allPieces.length);
    let piece = allPieces[randomIndex];
    
    // Apply random rotation (0 to 3 times)
    const rotations = Math.floor(Math.random() * 4);
    for (let r = 0; r < rotations; r++) {
      piece = rotatePiece(piece);
    }
    
    selected.push(piece);
  }
  return selected;
};

/**
 * Determines the color key for a given piece based on its shape.
 */
import { Theme } from '../styles/theme';
export const getPieceColor = (piece: Piece): keyof Theme['colors'] => {
  const cellCount = piece.flat().reduce((sum, cell) => sum + cell, 0);
  const rows = piece.length;
  const cols = piece[0].length;
  const maxDim = Math.max(rows, cols);

  switch (cellCount) {
    case 1: // SINGLE
      return 'cyan';
    case 2: // LINE_2
      return 'purple';
    case 3: // LINE_3 or SMALL_L
      // LINE_3 is 1x3 or 3x1 (maxDim 3)
      // SMALL_L is 2x2 (maxDim 2)
      return maxDim === 3 ? 'blue' : 'orange';
    case 4: // LINE_4 or SQUARE_2
      // LINE_4 is 1x4 or 4x1 (maxDim 4)
      // SQUARE_2 is 2x2 (maxDim 2)
      return maxDim === 4 ? 'red' : 'green';
    case 5: // LINE_5 or BIG_L
      // LINE_5 is 1x5 or 5x1 (maxDim 5)
      // BIG_L is 3x3 (maxDim 3)
      return maxDim === 5 ? 'pink' : 'orange';
    case 9: // SQUARE_3
      return 'green';
    default:
      return 'blue'; // Fallback
  }
};
