import React from 'react';
import { StyleSheet } from 'react-native';
import { render } from '@testing-library/react-native';
import { Grid } from '../Grid';
import { ThemeProvider } from '../../../styles/ThemeContext';
import { useGameStore } from '../../../store/gameStore';

// Mock game store
jest.mock('../../../store/gameStore', () => ({
  useGameStore: jest.fn(),
}));

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('Grid', () => {
  const mockGrid = Array(10).fill(null).map(() => Array(10).fill(0));

  beforeEach(() => {
    (useGameStore as any).mockReturnValue({
      grid: mockGrid,
      setGridLayout: jest.fn(),
      selectedPiece: null,
      hoverPosition: null,
    });
  });

  it('renders 100 cells for a 10x10 grid', () => {
    const { getAllByTestId } = renderWithTheme(<Grid />);
    const cells = getAllByTestId(/cell-\d+-\d+/);
    expect(cells).toHaveLength(100);
  });

  it('renders ghost piece when a piece is hovered', () => {
    // Mock a piece, hover position and grid layout (needed for ghost calc)
    (useGameStore as any).mockReturnValue({
      grid: mockGrid,
      gridLayout: { width: 300, height: 300, x: 0, y: 0 },
      setGridLayout: jest.fn(),
      selectedPiece: [[1, 1]], // 1x2 piece
      hoverPosition: { row: 0, col: 0 },
      clearingCells: null,
    });

    const { getByTestId } = renderWithTheme(<Grid />);
    
    // Check if GhostPiece is rendered via its testID
    const ghostPiece = getByTestId('ghost-piece');
    expect(ghostPiece).toBeTruthy();
  });
});
