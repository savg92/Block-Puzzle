import React from 'react';
import { render } from '@testing-library/react-native';
import { Grid } from '../Grid';
import { useGameStore } from '../../../store/gameStore';
import { ThemeProvider } from '../../../styles/ThemeContext';

// Mock the store
jest.mock('../../../store/gameStore', () => ({
  useGameStore: jest.fn(),
}));

describe('Grid Snapshots', () => {
  const mockGrid = Array(10).fill(null).map(() => Array(10).fill(0));

  it('renders empty grid correctly', () => {
    (useGameStore as any).mockReturnValue({
      grid: mockGrid,
      gridLayout: null,
      setGridLayout: jest.fn(),
      selectedPiece: null,
      hoverPosition: null,
      activePowerUpMode: null,
      addSingleBlock: jest.fn(),
      clearingCells: null,
      setClearingCells: jest.fn(),
    });

    const { toJSON } = render(
      <ThemeProvider>
        <Grid />
      </ThemeProvider>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders grid with some pieces correctly', () => {
    const populatedGrid = mockGrid.map(row => [...row]);
    populatedGrid[0][0] = 'red';
    populatedGrid[0][1] = 'red';
    populatedGrid[5][5] = 'blue';

    (useGameStore as any).mockReturnValue({
      grid: populatedGrid,
      gridLayout: null,
      setGridLayout: jest.fn(),
      selectedPiece: null,
      hoverPosition: null,
      activePowerUpMode: null,
      addSingleBlock: jest.fn(),
      clearingCells: null,
      setClearingCells: jest.fn(),
    });

    const { toJSON } = render(
      <ThemeProvider>
        <Grid />
      </ThemeProvider>
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
