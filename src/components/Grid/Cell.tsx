import React from 'react';
import { View } from 'react-native';

interface CellProps {
  row: number;
  col: number;
  color?: string | number | null;
  testID?: string;
}

export const Cell: React.FC<CellProps> = ({ color, testID }) => {
  // If color is 0 (number), it means empty. If it's a string, it's a filled color.
  const isFilled = typeof color === 'string';
  
  return (
    <View
      testID={testID}
      style={{
        width: 30,
        height: 30,
        borderRadius: 4,
        margin: 2,
        backgroundColor: isFilled ? (color as string) : '#1e293b', // slate-800 for empty
        borderColor: '#334155', // slate-700
        borderWidth: isFilled ? 0 : 1,
      }}
    />
  );
};
