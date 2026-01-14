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

/**
 * Places a piece on the grid and returns a new grid state.
 * Throws an error if the placement is invalid.
 * @param grid The current game board
 * @param piece The piece to place
 * @param row The row index
 * @param col The column index
 * @returns A new grid with the piece placed
 */
export const placePiece = (
  grid: Grid,
  piece: Piece,
  row: number,
  col: number
): Grid => {
  if (!canPlacePiece(grid, piece, row, col)) {
    throw new Error('Invalid piece placement');
  }

  // Deep copy the grid to ensure immutability
  const newGrid = grid.map((r) => [...r]);

  const pieceHeight = piece.length;
  const pieceWidth = piece[0].length;

  for (let r = 0; r < pieceHeight; r++) {
    for (let c = 0; c < pieceWidth; c++) {
      if (piece[r][c] !== 0) {
        newGrid[row + r][col + c] = 1; // Mark as filled
      }
    }
  }

  return newGrid;
};

/**
 * Checks for full rows and columns, clears them, and returns a new grid.
 * @param grid The current game board
 * @returns An object containing the new grid and the number of lines cleared
 */
export const clearLines = (grid: Grid): { grid: Grid; clearedLines: number } => {
  const rows = grid.length;
  const cols = grid[0].length;
  
  const fullRows = new Set<number>();
  const fullCols = new Set<number>();

  // Identify full rows
  for (let r = 0; r < rows; r++) {
    if (grid[r].every((cell) => cell !== 0)) {
      fullRows.add(r);
    }
  }

  // Identify full columns
  for (let c = 0; c < cols; c++) {
    let isFull = true;
    for (let r = 0; r < rows; r++) {
      if (grid[r][c] === 0) {
        isFull = false;
        break;
      }
    }
    if (isFull) {
      fullCols.add(c);
    }
  }

  const clearedLines = fullRows.size + fullCols.size;

  if (clearedLines === 0) {
    return { grid, clearedLines: 0 };
  }

  // Create new grid with cleared lines
  const newGrid = grid.map((row, r) => {
    return row.map((cell, c) => {
      // If this cell belongs to a full row or full column, clear it
      if (fullRows.has(r) || fullCols.has(c)) {
        return 0;
      }
      return cell;
    });
  });

  return { grid: newGrid, clearedLines };
};
