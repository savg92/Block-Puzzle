import React from 'react';
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

  it('renders ghost cells when a piece is hovered', () => {
    // Mock a piece and a hover position
    (useGameStore as any).mockReturnValue({
      grid: mockGrid,
      setGridLayout: jest.fn(),
      selectedPiece: [[1, 1]], // 1x2 piece
      hoverPosition: { row: 0, col: 0 },
    });

    const { getByTestId } = renderWithTheme(<Grid />);
    
    // Cell (0,0) and (0,1) should have ghost color
    // In Grid.tsx: color={cell || (isGhost ? 'rgba(255, 255, 255, 0.3)' : null)}
    const cell00 = getByTestId('cell-0-0');
    const cell01 = getByTestId('cell-0-1');
    const cell02 = getByTestId('cell-0-2');

    expect(cell00.props.style.backgroundColor).toBe('rgba(255, 255, 255, 0.3)');
    expect(cell01.props.style.backgroundColor).toBe('rgba(255, 255, 255, 0.3)');
    // Cell (0,2) is not part of the 1x2 piece
    expect(cell02.props.style.backgroundColor).not.toBe('rgba(255, 255, 255, 0.3)');
  });
});
