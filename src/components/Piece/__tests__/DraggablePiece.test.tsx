import React from 'react';
import { render } from '@testing-library/react-native';
import { DraggablePiece } from '../DraggablePiece';
import { ThemeProvider } from '../../../styles/ThemeContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
  
  it('renders the piece correctly', () => {
    const { getByTestId } = renderWithContext(
      <DraggablePiece piece={mockPiece} color="blue" onDragEnd={() => {}} />
    );
    expect(getByTestId('draggable-piece')).toBeDefined();
  });
});
