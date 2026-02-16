import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useGameStore } from '../../store/gameStore';
import { DraggablePiece } from '../Piece/DraggablePiece';
import { mapScreenToGrid } from '../../utils/gridUtils';
import { Piece } from '../../engine/types';
import { Theme } from '../../styles/theme';
import { useTheme } from '../../styles/ThemeContext';
import { getPieceColor } from '../../engine/pieces';
import { useSensoryFeedback } from '../../hooks/useSensoryFeedback';
import { useResponsiveSize } from '../../hooks/useResponsiveSize';

export const PieceTray: React.FC = () => {
  const { theme } = useTheme();
  const { availablePieces, selectPiece, selectedPiece, gridLayout, placePiece, activePowerUpMode, discardPiece, setClearingCells } = useGameStore();
  const { playPlace, playClear, playGameOver, playTap } = useSensoryFeedback();
  const rs = useResponsiveSize();

  const handleDragEnd = useCallback((
    piece: Piece, 
    colorKey: keyof Theme['colors'], 
    absoluteX: number, 
    absoluteY: number, 
    index: number,
    gridPos?: { row: number; col: number }
  ) => {
    if (gridLayout) {
      // Use the pre-calculated grid position if available (from Centroid Logic)
      // Otherwise fall back to mapping the top-left coordinate
      const dropPos = gridPos || mapScreenToGrid(absoluteX, absoluteY, gridLayout, 10, 8);
      
      if (dropPos) {
        const colorHex = (theme.colors as any)[colorKey];
        const result = placePiece(piece, dropPos.row, dropPos.col, colorHex, index);
        
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
    }
    selectPiece(null);
  }, [gridLayout, placePiece, playGameOver, playClear, playPlace, selectPiece, setClearingCells, theme.colors]);

  const handlePress = useCallback((index: number) => {
    if (activePowerUpMode === 'discard') {
      const success = discardPiece(index);
      if (success) {
        playTap();
      }
    }
  }, [activePowerUpMode, discardPiece, playTap]);

  const dynamicStyles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: '100%',
      height: rs.trayHeight,
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingHorizontal: rs.trayPaddingH,
    },
    pieceWrapper: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: rs.trayMinHeight,
      paddingVertical: Math.floor(10 * rs.scale),
    },
  });

  return (
    <View testID="piece-tray" style={dynamicStyles.container}>
      {availablePieces.map((piece, index) => {
        if (!piece) {
          return (
            <View 
              key={`piece-placeholder-${index}`} 
              style={dynamicStyles.pieceWrapper} 
            />
          );
        }

        // Dim the piece if another piece is selected
        const isDimmed = selectedPiece !== null && selectedPiece !== piece;
        const colorKey = getPieceColor(piece);
        
        return (
          <View 
            key={`piece-container-${index}`} 
            testID="piece-tray-item"
            style={[
              dynamicStyles.pieceWrapper,
              { opacity: isDimmed ? 0.4 : 1 }
            ]}
          >
            <DraggablePiece
              piece={piece}
              color={colorKey}
              onDragEnd={(x, y, gridPos) => handleDragEnd(piece, colorKey, x, y, index, gridPos)}
              onPress={() => handlePress(index)}
              size={rs.pieceSize}
            />
          </View>
        );
      })}
    </View>
  );
};