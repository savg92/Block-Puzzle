import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useGameStore } from '../../store/gameStore';
import { DraggablePiece } from '../Piece/DraggablePiece';
import { mapScreenToGrid } from '../../utils/gridUtils';
import { Piece } from '../../engine/types';
import { theme } from '../../styles/theme';
import { getPieceColor } from '../../engine/pieces';

export const PieceTray: React.FC = () => {
  const { availablePieces, selectPiece, selectedPiece, gridLayout, placePiece, activePowerUpMode, discardPiece } = useGameStore();

  const handleDragEnd = (
    piece: Piece, 
    colorKey: keyof typeof theme.colors.blocks, 
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
        const colorHex = theme.colors.blocks[colorKey];
        placePiece(piece, dropPos.row, dropPos.col, colorHex, index);
      }
    }
    selectPiece(null);
  };

  const handlePress = (index: number) => {
    if (activePowerUpMode === 'discard') {
      discardPiece(index);
    }
  };

  return (
    <View testID="piece-tray" style={styles.container}>
      {availablePieces.map((piece, index) => {
        if (!piece) {
          return (
            <View 
              key={`piece-placeholder-${index}`} 
              style={styles.pieceWrapper} 
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
              styles.pieceWrapper,
              { opacity: isDimmed ? 0.4 : 1 }
            ]}
          >
            <DraggablePiece
              piece={piece}
              color={colorKey}
              onDragEnd={(x, y, gridPos) => handleDragEnd(piece, colorKey, x, y, index, gridPos)}
              onPress={() => handlePress(index)}
              size={25}
            />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    height: 120,
    backgroundColor: '#0f172a',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingHorizontal: 20,
  },
  pieceWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 80,
  },
});