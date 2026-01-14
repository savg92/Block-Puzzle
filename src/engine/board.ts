import { Grid, Piece } from './types';

/**
 * Checks if a piece can be placed on the grid at the specified position.
 * @param grid The current game board
 * @param piece The piece to place
 * @param row The row index of the top-left corner of the piece
 * @param col The column index of the top-left corner of the piece
 * @returns true if the piece fits, false otherwise
 */
export const canPlacePiece = (
  grid: Grid,
  piece: Piece,
  row: number,
  col: number
): boolean => {
  const pieceHeight = piece.length;
  const pieceWidth = piece[0].length;
  const gridHeight = grid.length;
  const gridWidth = grid[0].length;

  for (let r = 0; r < pieceHeight; r++) {
    for (let c = 0; c < pieceWidth; c++) {
      // If the piece part is empty (0), it doesn't matter what's on the grid
      if (piece[r][c] === 0) continue;

      const targetRow = row + r;
      const targetCol = col + c;

      // Check boundaries
      if (
        targetRow < 0 ||
        targetRow >= gridHeight ||
        targetCol < 0 ||
        targetCol >= gridWidth
      ) {
        return false;
      }

      // Check collision
      if (grid[targetRow][targetCol] !== 0) {
        return false;
      }
    }
  }

  return true;
};
