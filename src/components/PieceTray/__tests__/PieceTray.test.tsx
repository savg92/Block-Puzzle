import React from 'react';
import { render } from '@testing-library/react-native';
import { PieceTray } from '../PieceTray';
import { ThemeProvider } from '../../../styles/ThemeContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

// Mock game store
const mockPieces = [[[1, 1], [0, 1]], [[1, 1], [1, 1]], [[1, 1, 1]]];
jest.mock('../../../store/gameStore', () => ({
  useGameStore: () => ({
    availablePieces: mockPieces,
    selectedPiece: mockPieces[0], // Mock the first piece as selected
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
  it('renders draggable pieces', () => {
    const { getAllByTestId } = renderWithContext(<PieceTray />);
    const draggablePieces = getAllByTestId('draggable-piece');
    expect(draggablePieces).toHaveLength(3);
  });

  it('applies dimmed style to unselected pieces if one is selected', () => {
    const { getAllByTestId } = renderWithContext(<PieceTray />);
    const containers = getAllByTestId('piece-tray-item');
    
    // Flatten styles to check opacity accurately
    const style0 = StyleSheet.flatten(containers[0].props.style);
    const style1 = StyleSheet.flatten(containers[1].props.style);
    const style2 = StyleSheet.flatten(containers[2].props.style);

    // The first one is selected (not dimmed), others should be dimmed
    expect(style0.opacity).toBe(1);
    expect(style1.opacity).toBeLessThan(1);
    expect(style2.opacity).toBeLessThan(1);
  });
});