import React, { useRef } from 'react';
import { View } from 'react-native';
import { Cell } from './Cell';
import { useGameStore } from '../../store/gameStore';
import { canPlacePiece } from '../../engine/board';

export const Grid: React.FC = () => {
  const { grid, selectedPiece, hoverPosition, setGridLayout } = useGameStore();
  const gridRef = useRef<View>(null);

  const isGhostCell = (row: number, col: number) => {
    if (!selectedPiece || !hoverPosition) return false;
    
    // Check if the piece fits at this position
    if (!canPlacePiece(grid, selectedPiece, hoverPosition.row, hoverPosition.col)) {
      return false;
    }

    const pieceRows = selectedPiece.length;
    const pieceCols = selectedPiece[0].length;

    const r = row - hoverPosition.row;
    const c = col - hoverPosition.col;

    return r >= 0 && r < pieceRows && c >= 0 && c < pieceCols && selectedPiece[r][c] === 1;
  };

  const handleLayout = () => {
    if (gridRef.current) {
      gridRef.current.measureInWindow((x, y, width, height) => {
        setGridLayout({ x, y, width, height });
      });
    }
  };

  return (
    <View 
      ref={gridRef}
      testID="grid-container"
      onLayout={handleLayout}
      style={{
        padding: 4, // Padding around the cells
        borderRadius: 8,
        backgroundColor: '#0f172a', // slate-950
        borderWidth: 4,
        borderColor: '#1e293b',     // slate-800
      }}
    >
      {grid.map((row, rowIndex) => (
        <View 
          key={`row-${rowIndex}`} 
          style={{ flexDirection: 'row' }}
        >
          {row.map((cell, colIndex) => {
            const isGhost = isGhostCell(rowIndex, colIndex);
            return (
              <Cell
                key={`cell-${rowIndex}-${colIndex}`}
                color={cell || (isGhost ? 'rgba(255, 255, 255, 0.3)' : null)}
                testID={`cell-${rowIndex}-${colIndex}`}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
};
