import { canPlacePiece, placePiece } from '../board';
import { Grid, Piece } from '../types';

describe('canPlacePiece', () => {
  // ... existing tests ...
  // 3x3 Grid for simplicity
  const emptyGrid: Grid = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  const piece2x1: Piece = [[1], [1]]; // 2 rows, 1 col

  it('should return true for valid placement', () => {
    expect(canPlacePiece(emptyGrid, piece2x1, 0, 0)).toBe(true);
    expect(canPlacePiece(emptyGrid, piece2x1, 1, 2)).toBe(true); // Bottom-right alignment
  });

  it('should return false when piece goes out of bounds', () => {
    // Try to place 2-tall piece at row 2 (index 2) -> extends to index 3 (invalid)
    expect(canPlacePiece(emptyGrid, piece2x1, 2, 0)).toBe(false);
    // Try to place at negative index
    expect(canPlacePiece(emptyGrid, piece2x1, -1, 0)).toBe(false);
    // Try to place out of bounds column
    expect(canPlacePiece(emptyGrid, piece2x1, 0, 3)).toBe(false);
  });

  it('should return false when overlapping existing blocks', () => {
    const filledGrid: Grid = [
      [1, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    // Overlap at (0,0)
    expect(canPlacePiece(filledGrid, piece2x1, 0, 0)).toBe(false);
  });

  it('should ignore 0s in the piece definition', () => {
      // Piece that looks like:
      // [1, 0]
      // [1, 1]
      const lPiece: Piece = [
          [1, 0],
          [1, 1]
      ];
      
      const grid: Grid = [
          [0, 1, 0],
          [0, 0, 0],
          [0, 0, 0]
      ];
      
      // Place at (0,0). Piece covers:
      // (0,0) -> 1
      // (0,1) -> 0 (should not collide with grid 1)
      // (1,0) -> 1
      // (1,1) -> 1
      expect(canPlacePiece(grid, lPiece, 0, 0)).toBe(true);
  });
});

describe('placePiece', () => {
    const emptyGrid: Grid = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ];
    const piece: Piece = [[1], [1]];

    it('should return a new grid with the piece placed', () => {
        const newGrid = placePiece(emptyGrid, piece, 0, 0);
        
        // Original grid should remain unchanged (immutability)
        expect(emptyGrid).toEqual([
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ]);

        // New grid should have the piece
        expect(newGrid).toEqual([
            [1, 0, 0],
            [1, 0, 0],
            [0, 0, 0],
        ]);
        
        // Ensure it's a deep copy
        expect(newGrid).not.toBe(emptyGrid);
        expect(newGrid[0]).not.toBe(emptyGrid[0]);
    });

    it('should throw an error if placement is invalid', () => {
        expect(() => placePiece(emptyGrid, piece, -1, 0)).toThrow();
    });
});
