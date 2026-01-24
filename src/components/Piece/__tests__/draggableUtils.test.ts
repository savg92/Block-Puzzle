
import { calculatePiecePosition } from '../DraggablePiece';

describe('calculatePiecePosition', () => {
  const PIECE_WIDTH = 100;
  const PIECE_HEIGHT = 100;
  const LIFT = 50;

  it('calculates position correctly when grabbed at top-left (0,0)', () => {
    const fingerX = 200;
    const fingerY = 300;
    const grabX = 0;
    const grabY = 0;

    const result = calculatePiecePosition(
      fingerX,
      fingerY,
      grabX,
      grabY,
      PIECE_WIDTH,
      PIECE_HEIGHT,
      LIFT
    );

    // Piece Top Left should be exactly at finger position (shifted by lift)
    expect(result.pieceTopLeftX).toBe(200);
    expect(result.pieceTopLeftY).toBe(300 - LIFT);

    // Center should be offset by half width/height
    expect(result.centerX).toBe(200 + 50);
    expect(result.centerY).toBe(300 - LIFT + 50);
  });

  it('calculates position correctly when grabbed at center (50,50)', () => {
    const fingerX = 200;
    const fingerY = 300;
    const grabX = 50;
    const grabY = 50;

    const result = calculatePiecePosition(
      fingerX,
      fingerY,
      grabX,
      grabY,
      PIECE_WIDTH,
      PIECE_HEIGHT,
      LIFT
    );

    // Piece Top Left should be shifted back by grab amount
    expect(result.pieceTopLeftX).toBe(200 - 50); // 150
    expect(result.pieceTopLeftY).toBe(300 - 50 - LIFT); // 200

    // Center should be exactly at finger position (shifted by lift)
    // because we grabbed at the center
    expect(result.centerX).toBe(200);
    expect(result.centerY).toBe(300 - LIFT);
  });

  it('calculates position correctly when grabbed at bottom-right (100,100)', () => {
    const fingerX = 200;
    const fingerY = 300;
    const grabX = 100;
    const grabY = 100;

    const result = calculatePiecePosition(
      fingerX,
      fingerY,
      grabX,
      grabY,
      PIECE_WIDTH,
      PIECE_HEIGHT,
      LIFT
    );

    // Piece Top Left
    expect(result.pieceTopLeftX).toBe(200 - 100); // 100
    expect(result.pieceTopLeftY).toBe(300 - 100 - LIFT); // 150

    // Center
    expect(result.centerX).toBe(100 + 50); // 150
    expect(result.centerY).toBe(150 + 50); // 200
  });
});
