import React from 'react';
import { render } from '@testing-library/react-native';
import { Grid } from '../Grid';
import { ThemeProvider } from '../../../styles/ThemeContext';

// Mock game store
jest.mock('../../../store/gameStore', () => ({
  useGameStore: () => ({
    grid: Array(10).fill(null).map(() => Array(10).fill(null)),
  }),
}));

// Mock storage
jest.mock('../../../store/storage', () => ({
  storage: {
    getString: jest.fn(() => 'system'),
    set: jest.fn(),
  },
}));

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('Grid', () => {
  it('renders 100 cells for a 10x10 grid', () => {
    const { getAllByTestId } = renderWithTheme(<Grid />);
    const cells = getAllByTestId(/cell-\d+-\d+/);
    expect(cells).toHaveLength(100);
  });

  it('renders empty cells with the correct style', () => {
    const { getByTestId } = renderWithTheme(<Grid />);
    const cell = getByTestId('cell-0-0');
    // Check for some visual indicator of emptiness if applicable, 
    // but for now just that it exists and is rendered.
    expect(cell).toBeDefined();
  });
});
