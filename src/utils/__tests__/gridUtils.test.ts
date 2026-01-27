
import { calculateGridDimensions, mapGridToLocal, mapScreenToGrid } from '../gridUtils';

describe('gridUtils', () => {
  describe('calculateGridDimensions', () => {
    it('calculates correct cell size with default padding', () => {
      // Width 108, Height 108. Padding 4.
      // Inner = 100, 100.
      // GridSize 10. Cell = 10.
      const dimensions = calculateGridDimensions(108, 108, 10, 4);
      expect(dimensions.cellWidth).toBe(10);
      expect(dimensions.cellHeight).toBe(10);
      expect(dimensions.innerWidth).toBe(100);
    });

    it('works with default parameters', () => {
      const dimensions = calculateGridDimensions(108, 108);
      expect(dimensions.cellWidth).toBe(10);
      expect(dimensions.cellHeight).toBe(10);
    });

    it('works with non-default parameters', () => {
      const dimensions = calculateGridDimensions(200, 200, 8, 10);
      // Inner = 200 - 20 = 180. Cell = 180 / 8 = 22.5
      expect(dimensions.cellWidth).toBe(22.5);
      expect(dimensions.innerWidth).toBe(180);
    });
  });

  describe('mapGridToLocal', () => {
    it('calculates 0,0 position correctly', () => {
      // Padding 4. Cell 10.
      const pos = mapGridToLocal(0, 0, 10, 10, 4);
      expect(pos.x).toBe(4); // Padding
      expect(pos.y).toBe(4);
    });

    it('works with default padding', () => {
      const pos = mapGridToLocal(0, 0, 10, 10);
      expect(pos.x).toBe(4);
      expect(pos.y).toBe(4);
    });

    it('works with non-default padding', () => {
      const pos = mapGridToLocal(1, 1, 20, 20, 10);
      expect(pos.x).toBe(30); // 10 + 1 * 20
      expect(pos.y).toBe(30);
    });

    it('calculates 1,1 position correctly', () => {
      const pos = mapGridToLocal(1, 1, 10, 10, 4);
      expect(pos.x).toBe(14); // 4 + 10
      expect(pos.y).toBe(14);
    });

    it('calculates 9,9 position correctly', () => {
      const pos = mapGridToLocal(9, 9, 10, 10, 4);
      expect(pos.x).toBe(94); // 4 + 90
      expect(pos.y).toBe(94);
    });
  });

  describe('mapScreenToGrid', () => {
    const layout = { x: 50, y: 100, width: 208, height: 208 }; // inner = 200x200
    const gridSize = 10;
    const padding = 4;

    it('maps center of a cell correctly', () => {
      // Cell (0,0) is from (54, 104) to (74, 124)
      const pos = mapScreenToGrid(64, 114, layout, gridSize, padding);
      expect(pos).toEqual({ row: 0, col: 0 });
    });

    it('maps bottom-right corner correctly', () => {
      // Cell (9,9) is from (234, 284) to (254, 304)
      const pos = mapScreenToGrid(240, 290, layout, gridSize, padding);
      expect(pos).toEqual({ row: 9, col: 9 });
    });

    it('works with default parameters', () => {
      const pos = mapScreenToGrid(64, 114, layout);
      expect(pos).toEqual({ row: 0, col: 0 });
    });

    it('works with default tolerance', () => {
      // inner grid: x: 54 to 254, y: 104 to 304
      // default tolerance is 30.
      // 54 - 20 = 34 (should be inside)
      const pos = mapScreenToGrid(34, 114, layout);
      expect(pos).toEqual({ row: 0, col: 0 });
    });

    it('returns null for points outside the grid', () => {
      expect(mapScreenToGrid(0, 0, layout, gridSize, padding, 0)).toBeNull();
      expect(mapScreenToGrid(1000, 1000, layout, gridSize, padding, 0)).toBeNull();
    });

    it('returns null for points within outer padding', () => {
      // Point at (52, 102) is within the 4px padding (starts at 50, 100)
      expect(mapScreenToGrid(52, 102, layout, gridSize, padding, 0)).toBeNull();
    });

    it('uses tolerance correctly for all boundaries', () => {
      const tolerance = 10;
      // inner grid: x: 54 to 254, y: 104 to 304
      
      // Just inside left tolerance
      expect(mapScreenToGrid(45, 114, layout, gridSize, padding, tolerance)).toEqual({ row: 0, col: 0 });
      // Just outside left tolerance
      expect(mapScreenToGrid(43, 114, layout, gridSize, padding, tolerance)).toBeNull();

      // Just inside right tolerance
      expect(mapScreenToGrid(263, 114, layout, gridSize, padding, tolerance)).toEqual({ row: 0, col: 9 });
      // Just outside right tolerance
      expect(mapScreenToGrid(265, 114, layout, gridSize, padding, tolerance)).toBeNull();

      // Just inside top tolerance
      expect(mapScreenToGrid(64, 95, layout, gridSize, padding, tolerance)).toEqual({ row: 0, col: 0 });
      // Just outside top tolerance
      expect(mapScreenToGrid(64, 93, layout, gridSize, padding, tolerance)).toBeNull();

      // Just inside bottom tolerance
      expect(mapScreenToGrid(64, 313, layout, gridSize, padding, tolerance)).toEqual({ row: 9, col: 0 });
      // Just outside bottom tolerance
      expect(mapScreenToGrid(64, 315, layout, gridSize, padding, tolerance)).toBeNull();
    });

    it('handles boundary edges (exclusive of far edge)', () => {
        // Inner grid ends at 50+4+200 = 254
        expect(mapScreenToGrid(253.9, 303.9, layout, gridSize, padding, 0)).toEqual({ row: 9, col: 9 });
        expect(mapScreenToGrid(254, 304, layout, gridSize, padding, 0)).toBeNull();
    });

    it('handles boundary edges inclusive of top-left', () => {
        // Inner grid starts at 50+4 = 54
        expect(mapScreenToGrid(54, 104, layout, gridSize, padding, 0)).toEqual({ row: 0, col: 0 });
    });
  });
});