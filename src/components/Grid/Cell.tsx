import React from 'react';
import { View } from 'react-native';

interface CellProps {
  color?: string | number | null;
  size?: number;
  testID?: string;
}

export const Cell: React.FC<CellProps> = ({ color, size = 30, testID }) => {
  const isFilled = typeof color === 'string';
  const isEmpty = !color || color === 0;
  
  return (
    <View
      testID={testID}
      style={{
        width: size,
        height: size,
        borderRadius: 4,
        margin: 1,
        backgroundColor: isFilled ? (color as string) : (isEmpty ? '#1e293b' : 'transparent'),
        borderColor: isFilled ? 'rgba(255,255,255,0.3)' : '#334155',
        borderWidth: isEmpty && color !== 'transparent' ? 1 : 0,
      }}
    />
  );
};
