export const mapScreenToGrid = (
  x: number,
  y: number,
  gridLayout: { x: number; y: number; width: number; height: number },
  gridSize: number = 10,
  padding: number = 4,
  tolerance: number = 30 // Allow finger to be slightly outside grid
): { row: number; col: number } | null => {
  // 1. Calculate the active area (inner grid after padding)
  const innerX = gridLayout.x + padding;
  const innerY = gridLayout.y + padding;
  const innerWidth = gridLayout.width - padding * 2;
  const innerHeight = gridLayout.height - padding * 2;

  // 2. Check with tolerance
  if (
    x < innerX - tolerance || 
    x >= innerX + innerWidth + tolerance || 
    y < innerY - tolerance || 
    y >= innerY + innerHeight + tolerance
  ) {
    return null;
  }

  // 3. Calculate cell size
  const cellWidth = innerWidth / gridSize;
  const cellHeight = innerHeight / gridSize;

  // 4. Map coordinates to indices and clamp
  let col = Math.floor((x - innerX) / cellWidth);
  let row = Math.floor((y - innerY) / cellHeight);

  // Clamp to valid grid range [0, gridSize-1]
  col = Math.max(0, Math.min(col, gridSize - 1));
  row = Math.max(0, Math.min(row, gridSize - 1));

  return { row, col };
};

export const calculateGridDimensions = (
  width: number,
  height: number,
  gridSize: number = 10,
  padding: number = 4
) => {
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  
  const cellWidth = innerWidth / gridSize;
  const cellHeight = innerHeight / gridSize;
  
  return { cellWidth, cellHeight, innerWidth, innerHeight };
};

export const mapGridToLocal = (
  row: number,
  col: number,
  cellWidth: number,
  cellHeight: number,
  padding: number = 4
) => {
  const x = padding + col * cellWidth;
  const y = padding + row * cellHeight;
  
  return { x, y };
};