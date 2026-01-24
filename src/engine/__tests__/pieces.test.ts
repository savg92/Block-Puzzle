import { PIECES, rotatePiece, getRandomPieces, getPieceColor } from '../pieces';
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

  it('should return the original piece after 4 rotations (360 degrees)', () => {
    const original = PIECES.SMALL_L;
    let piece = original;
    for (let i = 0; i < 4; i++) {
      piece = rotatePiece(piece);
    }
    expect(piece).toEqual(original);
  });

  it('should handle single cell pieces correctly', () => {
    const single = PIECES.SINGLE;
    const rotated = rotatePiece(single);
    expect(rotated).toEqual(single);
  });

  it('should rotate a non-square asymmetric piece correctly at each step', () => {
    const piece: Piece = [
      [1, 1, 0],
      [0, 1, 0]
    ];
    // Original (2x3):
    // 1 1 0
    // 0 1 0

    // 90 deg (3x2):
    // 0 1
    // 1 1
    // 0 0
    const rot90 = rotatePiece(piece);
    expect(rot90).toEqual([
      [0, 1],
      [1, 1],
      [0, 0]
    ]);

    // 180 deg (2x3):
    // 0 1 0
    // 0 1 1
    const rot180 = rotatePiece(rot90);
    expect(rot180).toEqual([
      [0, 1, 0],
      [0, 1, 1]
    ]);
  });
});

describe('getRandomPieces', () => {
  it('should return the requested number of pieces', () => {
    const pieces = getRandomPieces(3);
    expect(pieces).toHaveLength(3);
  });

  it('should return pieces that might be rotated', () => {
    // We can't guarantee a rotation with 1 call, but we can check if it's possible
    // Over many calls, we should see pieces that aren't the original
    let foundRotated = false;
    for (let i = 0; i < 20; i++) {
      const pieces = getRandomPieces(1);
      const piece = pieces[0];
      
      // Check if this piece matches any canonical piece exactly
      const isOriginal = Object.values(PIECES).some(p => JSON.stringify(p) === JSON.stringify(piece));
      if (!isOriginal) {
        foundRotated = true;
        break;
      }
    }
    // Note: For some pieces (like SINGLE, SQUARE_2), all rotations look the same.
    // But for LINE_2, some rotations will be different (1x2 vs 2x1).
    // So foundRotated should eventually be true.
    expect(foundRotated).toBe(true);
  });
});

describe('getPieceColor', () => {
  it('should map pieces to correct colors', () => {
    expect(getPieceColor(PIECES.SINGLE)).toBe('cyan');
    expect(getPieceColor(PIECES.LINE_2)).toBe('purple');
    expect(getPieceColor(PIECES.LINE_3)).toBe('blue');
    expect(getPieceColor(PIECES.LINE_4)).toBe('red');
    expect(getPieceColor(PIECES.LINE_5)).toBe('pink');
    expect(getPieceColor(PIECES.SQUARE_2)).toBe('green');
    expect(getPieceColor(PIECES.SQUARE_3)).toBe('green');
    expect(getPieceColor(PIECES.SMALL_L)).toBe('orange');
    expect(getPieceColor(PIECES.BIG_L)).toBe('orange');
  });

  it('should maintain the same color regardless of rotation', () => {
    const rotatedL = rotatePiece(PIECES.BIG_L);
    expect(getPieceColor(rotatedL)).toBe('orange');
    
    const rotatedLine = rotatePiece(PIECES.LINE_3);
    expect(getPieceColor(rotatedLine)).toBe('blue');
  });
});
