import React from 'react';
import { render } from '@testing-library/react-native';
import { DraggablePiece } from '../DraggablePiece';
import { ThemeProvider } from '../../../styles/ThemeContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Mock game store
const mockSelectPiece = jest.fn();
jest.mock('../../../store/gameStore', () => ({
  useGameStore: () => ({
    selectPiece: mockSelectPiece,
  }),
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

describe('DraggablePiece', () => {
  const mockPiece = [[1, 1], [1, 1]];
  
  beforeEach(() => {
    mockSelectPiece.mockClear();
  });

  it('renders the piece correctly', () => {
    const { getByTestId } = renderWithContext(
      <DraggablePiece piece={mockPiece} color="blue" onDragEnd={() => {}} />
    );
    expect(getByTestId('draggable-piece')).toBeDefined();
  });

  // Note: Testing actual gesture start is complex in this environment, 
  // but we will verify the code integration in the next step.
  // For now, we confirm it doesn't crash and renders correctly.
});