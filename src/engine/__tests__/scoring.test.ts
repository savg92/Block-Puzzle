import { calculateScore } from '../scoring';
import { Piece } from '../types';

describe('calculateScore', () => {
  const piece1: Piece = [[1]]; // 1 block
  const piece3: Piece = [[1, 1, 1]]; // 3 blocks
  const pieceSquare: Piece = [
      [1, 1],
      [1, 1]
  ]; // 4 blocks
  const pieceWithEmpty: Piece = [
      [1, 0],
      [0, 1]
  ]; // 2 blocks

  it('should return points for placement only (0 lines cleared)', () => {
    expect(calculateScore(piece1, 0)).toBe(1);
    expect(calculateScore(piece3, 0)).toBe(3);
    expect(calculateScore(pieceSquare, 0)).toBe(4);
    expect(calculateScore(pieceWithEmpty, 0)).toBe(2);
    expect(calculateScore([[0, 0], [0, 0]], 0)).toBe(0);
  });

  it('should add points for cleared lines', () => {
    // 1 block placed + 1 line cleared
    // 1 + 10 = 11
    expect(calculateScore(piece1, 1)).toBe(11);
    
    // 3 blocks placed + 1 line cleared
    // 3 + 10 = 13
    expect(calculateScore(piece3, 1)).toBe(13);
  });

  it('should include bonuses for multi-line clears', () => {
    // 1 block placed + 2 lines cleared
    // Placement: 1
    // Base Line Score: 10 * 2 = 20
    // Bonus: 2 lines -> moderate bonus. Let's assume the formula:
    // Score = Placement + (10 * lines) + (lines > 1 ? (lines * 10) : 0) ?
    // Let's test the formula derived:
    // Score = blocks + 10 * lines + (lines * (lines - 1) * 5)
    
    // 2 lines: 1 + 20 + (2*1*5) = 31
    expect(calculateScore(piece1, 2)).toBe(31);

    // 3 lines: 1 + 30 + (3*2*5) = 61
    expect(calculateScore(piece1, 3)).toBe(61);
    
    // 4 lines: 1 + 40 + (4*3*5) = 101
    expect(calculateScore(piece1, 4)).toBe(101);
  });
});
