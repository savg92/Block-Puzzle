import React from 'react';
import { View } from 'react-native';
import { theme } from '../../styles/theme';
import { Cell } from '../Grid/Cell';

interface PiecePreviewProps {
  piece: number[][];
  color: keyof typeof theme.colors.blocks;
  size?: number;
  testID?: string;
}

export const PiecePreview: React.FC<PiecePreviewProps> = ({ 
  piece, 
  color, 
  size = 29, // Adjusted to 29px per user feedback
  testID 
}) => {
  const blockColor = theme.colors.blocks[color] || theme.colors.primary;

  return (
    <View 
      testID={testID}
      style={{ padding: 0 }}
    >
      {piece.map((row, rowIndex) => (
        <View 
          key={`piece-row-${rowIndex}`} 
          style={{ flexDirection: 'row' }}
        >
          {row.map((cellValue, colIndex) => (
            <Cell
              key={`piece-cell-${rowIndex}-${colIndex}`}
              testID={`piece-cell-${rowIndex}-${colIndex}`}
              size={size}
              color={cellValue ? blockColor : 'transparent'}
            />
          ))}
        </View>
      ))}
    </View>
  );
};