import React from 'react';
import { render } from '@testing-library/react-native';
import { PieceTray } from '../PieceTray';
import { ThemeProvider } from '../../../styles/ThemeContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Mock game store
jest.mock('../../../store/gameStore', () => ({
  useGameStore: () => ({
    availablePieces: [[[1, 1], [0, 1]], [[1, 1], [1, 1]], [[1, 1, 1]]],
    selectedPiece: null,
    selectPiece: jest.fn(),
  }),
}));

// Mock storage
jest.mock('../../../store/storage', () => ({
  storage: {
    getString: jest.fn(() => 'system'),
    set: jest.fn(),
  },
}));

const renderWithContext = (component: React.ReactElement) => {
  return render(
    <GestureHandlerRootView>
      <ThemeProvider>
        {component}
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

describe('PieceTray', () => {
  it('renders three draggable pieces from the store', () => {
    const { getAllByTestId } = renderWithContext(<PieceTray />);
    const draggablePieces = getAllByTestId('draggable-piece');
    expect(draggablePieces).toHaveLength(3);
  });
});