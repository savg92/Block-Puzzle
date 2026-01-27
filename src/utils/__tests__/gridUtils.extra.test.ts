
import { mapScreenToGrid } from '../gridUtils';

describe('gridUtils extra coverage', () => {
  it('covers non-default gridSize and padding branches in mapScreenToGrid', () => {
    const layout = { x: 0, y: 0, width: 100, height: 100 };
    const gridSize = 5;
    const padding = 0;
    const tolerance = 0;
    
    // innerWidth = 100. cellWidth = 20.
    const pos = mapScreenToGrid(10, 10, layout, gridSize, padding, tolerance);
    expect(pos).toEqual({ row: 0, col: 0 });
    
    const pos2 = mapScreenToGrid(90, 90, layout, gridSize, padding, tolerance);
    expect(pos2).toEqual({ row: 4, col: 4 });
  });
});