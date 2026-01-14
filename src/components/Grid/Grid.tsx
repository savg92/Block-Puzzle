import React from 'react';
import { View } from 'react-native';
import { Cell } from './Cell';
import { useGameStore } from '../../store/gameStore';

export const Grid: React.FC = () => {
  const { grid } = useGameStore();

  return (
    <View 
      style={{
        padding: 4, // Padding around the cells
        borderRadius: 8,
        backgroundColor: '#0f172a', // slate-950
        borderWidth: 4,
        borderColor: '#1e293b',     // slate-800
      }}
    >
      {grid.map((row, rowIndex) => (
        <View 
          key={`row-${rowIndex}`} 
          style={{ flexDirection: 'row' }}
        >
          {row.map((cell, colIndex) => (
            <Cell
              key={`cell-${rowIndex}-${colIndex}`}
              color={cell}
              testID={`cell-${rowIndex}-${colIndex}`}
            />
          ))}
        </View>
      ))}
    </View>
  );
};
