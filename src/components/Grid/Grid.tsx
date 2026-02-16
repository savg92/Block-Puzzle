import React, { useRef, memo, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { Cell } from './Cell';
import { GhostPiece } from '../Piece/GhostPiece';
import { useGameStore } from '../../store/gameStore';
import { useTheme } from '../../styles/ThemeContext';
import { canPlacePiece } from '../../engine/board';
import { getPieceColor } from '../../engine/pieces';
import { calculateGridDimensions, mapGridToLocal } from '../../utils/gridUtils';
import { useSensoryFeedback } from '../../hooks/useSensoryFeedback';

export const Grid: React.FC = memo(() => {
  const { theme } = useTheme();
  const { grid, gridLayout, setGridLayout, selectedPiece, hoverPosition, activePowerUpMode, addSingleBlock, clearingCells, setClearingCells, preferences } = useGameStore();
  const gridRef = useRef<View>(null);
  const { playPlace, playClear, playGameOver } = useSensoryFeedback();

  const handleLayout = () => {
    if (gridRef.current) {
      gridRef.current.measureInWindow((x, y, width, height) => {
        setGridLayout({ x, y, width, height });
      });
    }
  };

  const handleCellPress = useCallback((row: number, col: number) => {
    if (activePowerUpMode === 'addSingle') {
      const result = addSingleBlock(row, col);
      if (result?.success) {
        if (result.isGameOver) {
          playGameOver();
        } else if (result.clearedLines > 0) {
          playClear();
          // Trigger animation
          setClearingCells({ rows: result.fullRows, cols: result.fullCols });
          setTimeout(() => {
            setClearingCells(null);
          }, 150);
        } else {
          playPlace();
        }
      }
    }
  }, [activePowerUpMode, addSingleBlock, playGameOver, playClear, playPlace, setClearingCells]);

  // Calculate ghost parameter
  const ghost = useMemo(() => {
    if (!selectedPiece || !hoverPosition || !gridLayout) return null;
    
    // Check if the piece fits at this position
    const isForcePlace = activePowerUpMode === 'forcePlace';
    const canPlace = canPlacePiece(grid, selectedPiece, hoverPosition.row, hoverPosition.col);
    
    // If we are forcing, we only check bounds (which canPlacePiece does internally, but returns false if occupied).
    // We need to verify bounds specifically if we want to show ghost for forcePlace.
    // However, canPlacePiece returns false for collision OR bounds.
    // Let's rely on a helper or check bounds manually if forcePlace is true.
    
    // Actually, we can check basic bounds here:
    const rows = selectedPiece.length;
    const cols = selectedPiece[0].length;
    if (hoverPosition.row + rows > 10 || hoverPosition.col + cols > 10) return null;

    // If not force place, strict check
    if (!isForcePlace && !canPlace) {
      return null;
    }

    const { cellWidth, cellHeight } = calculateGridDimensions(
       gridLayout.width, 
       gridLayout.height, 
       10, 
       8 // padding (4 border + 4 padding)
    );
    
    // Calculate local position for the ghost
    const { x, y } = mapGridToLocal(
       hoverPosition.row, 
       hoverPosition.col, 
       cellWidth, 
       cellHeight,
       8 // padding (4 border + 4 padding)
    );

    return {
      x,
      y,
      piece: selectedPiece,
      color: getPieceColor(selectedPiece),
      size: cellWidth - 2 // Account for margin
    };
  }, [selectedPiece, hoverPosition, grid, gridLayout, activePowerUpMode]);

  return (
    <View 
      ref={gridRef}
      testID="grid-container"
      onLayout={handleLayout}
      style={{
        padding: 4, // Padding around the cells
        borderRadius: 8,
        backgroundColor: theme.colors.surface,
        borderWidth: 4,
        borderColor: theme.colors.surfaceVariant,
      }}
    >
      {grid.map((row, rowIndex) => (
        <View 
          key={`row-${rowIndex}`} 
          style={{ flexDirection: 'row' }}
        >
          {row.map((cell, colIndex) => {
            const isClearing = !!clearingCells && (
              clearingCells.rows.includes(rowIndex) || 
              clearingCells.cols.includes(colIndex)
            );

            return (
              <Cell
                key={`cell-${rowIndex}-${colIndex}`}
                color={cell || null}
                testID={`cell-${rowIndex}-${colIndex}`}
                onPress={() => handleCellPress(rowIndex, colIndex)}
                isClearing={isClearing}
              />
            );
          })}
        </View>
      ))}
      
      {ghost && preferences.showPieceShadow && (
        <GhostPiece 
          piece={ghost.piece}
          color={ghost.color}
          x={ghost.x}
          y={ghost.y}
          visible={true}
          size={ghost.size}
        />
      )}
    </View>
  );
});

Grid.displayName = 'Grid';
