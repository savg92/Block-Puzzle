import React from 'react';
import { View } from 'react-native';
import { theme } from '../../styles/theme';

interface PiecePreviewProps {
  piece: number[][];
  color: keyof typeof theme.colors.blocks;
  size?: number;
  testID?: string;
}

export const PiecePreview: React.FC<PiecePreviewProps> = ({ 
  piece, 
  color, 
  size = 20,
  testID 
}) => {
  const blockColor = theme.colors.blocks[color] || theme.colors.primary;

  return (
    <View 
      testID={testID}
      style={{ padding: 4 }}
    >
      {piece.map((row, rowIndex) => (
        <View 
          key={`piece-row-${rowIndex}`} 
          style={{ flexDirection: 'row' }}
        >
          {row.map((cell, colIndex) => (
            <View
              key={`piece-cell-${rowIndex}-${colIndex}`}
              testID={`piece-cell-${rowIndex}-${colIndex}`}
              style={{
                width: size,
                height: size,
                margin: 1,
                borderRadius: 2,
                backgroundColor: cell ? blockColor : 'transparent',
                borderColor: cell ? 'rgba(255,255,255,0.2)' : 'transparent',
                borderWidth: cell ? 1 : 0,
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
};
