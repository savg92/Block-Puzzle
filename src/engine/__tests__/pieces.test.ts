import { PIECES, rotatePiece } from '../pieces';
import { Piece } from '../types';

describe('Canonical Pieces', () => {
  it('should have exactly 9 pieces', () => {
    expect(Object.keys(PIECES).length).toBe(9);
  });

  it('should have correct shape for BIG_L', () => {
    const expected = [
      [1, 1, 1],
      [1, 0, 0],
      [1, 0, 0],
    ];
    expect(PIECES.BIG_L).toEqual(expected);
  });
});

describe('rotatePiece', () => {
  it('should rotate a square matrix 90 degrees clockwise', () => {
    const piece: Piece = [
      [1, 2],
      [3, 4],
    ];
    // 90 deg clockwise:
    // [3, 1]
    // [4, 2]
    const rotated = rotatePiece(piece);
    expect(rotated).toEqual([
      [3, 1],
      [4, 2],
    ]);
  });

  it('should rotate a 3x3 matrix correctly', () => {
     const piece: Piece = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];
    // [7, 4, 1]
    // [8, 5, 2]
    // [9, 6, 3]
    const rotated = rotatePiece(piece);
    expect(rotated).toEqual([
        [7, 4, 1],
        [8, 5, 2],
        [9, 6, 3]
    ]);
  });

  it('should handle rectangular pieces (rotation changes dimensions)', () => {
      // 2x3 matrix
      const piece: Piece = [
          [1, 1, 1],
          [0, 0, 0]
      ];
      // Becomes 3x2
      // [0, 1]
      // [0, 1]
      // [0, 1]
      const rotated = rotatePiece(piece);
      expect(rotated).toEqual([
          [0, 1],
          [0, 1],
          [0, 1]
      ]);
  });
});
