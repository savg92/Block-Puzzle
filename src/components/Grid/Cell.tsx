import React from 'react';
import { View } from 'react-native';

interface CellProps {
  row: number;
  col: number;
  color?: string | null;
  testID?: string;
}

export const Cell: React.FC<CellProps> = ({ color, testID }) => {
  return (
    <View
      testID={testID}
      className="w-8 h-8 rounded-sm m-0.5 border"
      style={{
        backgroundColor: color || '#1E293B', // Default to surface color if null
        borderColor: color ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
      }}
    />
  );
};