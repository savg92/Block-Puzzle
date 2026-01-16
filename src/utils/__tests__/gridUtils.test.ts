import { mapScreenToGrid } from '../gridUtils';

describe('gridUtils', () => {
  describe('mapScreenToGrid', () => {
    const gridLayout = {
      x: 50,
      y: 100,
      width: 300,
      height: 300,
    };
    const gridSize = 10;
    const padding = 4; // Based on Grid.tsx padding

    it('returns null if coordinates are outside the grid', () => {
      expect(mapScreenToGrid(0, 0, gridLayout, gridSize, padding)).toBeNull();
      expect(mapScreenToGrid(400, 400, gridLayout, gridSize, padding)).toBeNull();
    });

    it('correctly maps the top-left cell (0,0)', () => {
      // Cell (0,0) starts at x: 50 + 4 = 54, y: 100 + 4 = 104
      const result = mapScreenToGrid(60, 110, gridLayout, gridSize, padding);
      expect(result).toEqual({ row: 0, col: 0 });
    });

    it('correctly maps the bottom-right cell (9,9)', () => {
      // innerWidth = 300 - 8 = 292. cellWidth = 29.2
      // col 9 starts at 54 + 9 * 29.2 = 54 + 262.8 = 316.8
      const result = mapScreenToGrid(320, 370, gridLayout, gridSize, padding);
      expect(result).toEqual({ row: 9, col: 9 });
    });

    it('handles boundary cases (exactly on the edge)', () => {
      // Exactly at the start of cell 0,0
      expect(mapScreenToGrid(54, 104, gridLayout, gridSize, padding)).toEqual({ row: 0, col: 0 });
      
      // innerX + innerWidth = 54 + 292 = 346
      // Exactly at the end of cell 9,9 (inclusive start, exclusive end)
      expect(mapScreenToGrid(345.9, 395.9, gridLayout, gridSize, padding)).toEqual({ row: 9, col: 9 });
    });

    it('returns null for values outside each boundary', () => {
      // innerX = 54, innerY = 104, innerWidth = 292, innerHeight = 292
      // rightEdge = 346, bottomEdge = 396
      
      expect(mapScreenToGrid(53.9, 110, gridLayout, gridSize, padding)).toBeNull(); // x < innerX
      expect(mapScreenToGrid(346, 110, gridLayout, gridSize, padding)).toBeNull();  // x >= innerX + innerWidth
      expect(mapScreenToGrid(60, 103.9, gridLayout, gridSize, padding)).toBeNull(); // y < innerY
      expect(mapScreenToGrid(60, 396, gridLayout, gridSize, padding)).toBeNull();   // y >= innerY + innerHeight
    });

    it('works with custom gridSize and padding', () => {
      const customGridSize = 5;
      const customPadding = 10;
      // innerX = 50 + 10 = 60, innerY = 100 + 10 = 110
      // innerWidth = 300 - 20 = 280. cellWidth = 280 / 5 = 56
      
      const result = mapScreenToGrid(65, 115, gridLayout, customGridSize, customPadding);
      expect(result).toEqual({ row: 0, col: 0 });
    });

    it('works with default parameters', () => {
      // Uses gridSize=10, padding=4
      const result = mapScreenToGrid(60, 110, gridLayout);
      expect(result).toEqual({ row: 0, col: 0 });
    });
  });
});