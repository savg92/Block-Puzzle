import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useGameStore } from '../../store/gameStore';
import { DraggablePiece } from '../Piece/DraggablePiece';
import { mapScreenToGrid } from '../../utils/gridUtils';
import { Piece } from '../../engine/types';

export const PieceTray: React.FC = () => {
  const { availablePieces, selectPiece, selectedPiece, gridLayout, placePiece } = useGameStore();

  const handleDragEnd = (piece: Piece, absoluteX: number, absoluteY: number) => {
    if (gridLayout) {
      const dropPos = mapScreenToGrid(absoluteX, absoluteY, gridLayout);
      if (dropPos) {
        placePiece(piece, dropPos.row, dropPos.col);
      }
    }
    selectPiece(null);
  };

  return (
    <View testID="piece-tray" style={styles.container}>
      {availablePieces.map((piece, index) => {
        // Dim the piece if another piece is selected
        const isDimmed = selectedPiece !== null && selectedPiece !== piece;
        
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
              color={getPiceColor(index)}
              onDragEnd={(x, y) => handleDragEnd(piece, x, y)}
              size={25}
            />
          </View>
        );
      })}
    </View>
  );
};

const getPiceColor = (index: number): any => {
  const colors = ['orange', 'blue', 'green'] as const;
  return colors[index % colors.length];
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