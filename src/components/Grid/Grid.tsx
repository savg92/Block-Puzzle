import React from 'react';
import { View } from 'react-native';
import { Cell } from './Cell';
import { useGameStore } from '../../store/gameStore';

export const Grid: React.FC = () => {
  const { grid } = useGameStore();

  return (
    <View className="bg-slate-800 p-1 rounded-md shadow-2xl border-4 border-slate-700">
      {grid.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} className="flex-row">
          {row.map((cell, colIndex) => (
            <Cell
              key={`cell-${rowIndex}-${colIndex}`}
              row={rowIndex}
              col={colIndex}
              color={cell}
              testID={`cell-${rowIndex}-${colIndex}`}
            />
          ))}
        </View>
      ))}
    </View>
  );
};
