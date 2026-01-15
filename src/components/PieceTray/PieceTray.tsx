import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useGameStore } from '../../store/gameStore';
import { DraggablePiece } from '../Piece/DraggablePiece';

export const PieceTray: React.FC = () => {
  const { availablePieces, selectPiece } = useGameStore();

  const handleDragEnd = (absoluteX: number, absoluteY: number) => {
    // This will be connected to drop logic later
    console.log('Piece dropped at:', absoluteX, absoluteY);
    selectPiece(null);
  };

  return (
    <View style={styles.container}>
      {availablePieces.map((piece, index) => (
        <View key={`piece-container-${index}`} style={styles.pieceWrapper}>
          <DraggablePiece
            piece={piece}
            color={getPiceColor(index)}
            onDragEnd={handleDragEnd}
            size={25} // Smaller size for the tray
          />
        </View>
      ))}
    </View>
  );
};

// Utility to get consistent colors for tray positions
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
    backgroundColor: '#0f172a', // slate-900
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
