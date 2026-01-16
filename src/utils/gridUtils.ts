export const mapScreenToGrid = (
  x: number,
  y: number,
  gridLayout: { x: number; y: number; width: number; height: number },
  gridSize: number = 10,
  padding: number = 4
): { row: number; col: number } | null => {
  // 1. Calculate the active area (inner grid after padding)
  const innerX = gridLayout.x + padding;
  const innerY = gridLayout.y + padding;
  const innerWidth = gridLayout.width - padding * 2;
  const innerHeight = gridLayout.height - padding * 2;

  // 2. Check if the point is within the inner grid boundaries
  if (
    x < innerX || 
    x >= innerX + innerWidth || 
    y < innerY || 
    y >= innerY + innerHeight
  ) {
    return null;
  }

  // 3. Calculate cell size
  const cellWidth = innerWidth / gridSize;
  const cellHeight = innerHeight / gridSize;

  // 4. Map coordinates to indices
  const col = Math.floor((x - innerX) / cellWidth);
  const row = Math.floor((y - innerY) / cellHeight);

  return { row, col };
};