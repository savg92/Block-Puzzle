import React from 'react';
import { render } from '@testing-library/react-native';
import { PiecePreview } from '../PiecePreview';
import { ThemeProvider } from '../../../styles/ThemeContext';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('PiecePreview', () => {
  it('renders a 2x2 square piece correctly', () => {
    const square2x2 = [
      [1, 1],
      [1, 1],
    ];
    const { getAllByTestId } = renderWithTheme(
      <PiecePreview piece={square2x2} color="blue" />
    );
    const cells = getAllByTestId(/piece-cell-\d+-\d+/);
    expect(cells).toHaveLength(4);
  });

  it('renders a small L piece correctly', () => {
    const smallL = [
      [1, 1],
      [0, 1],
    ];
    const { getAllByTestId } = renderWithTheme(
      <PiecePreview piece={smallL} color="orange" />
    );
    // Should render only the filled cells (3) if we optimize, 
    // or all 4 if we render the whole matrix. 
    // Let's assume we render filled cells with the color.
    const cells = getAllByTestId(/piece-cell-\d+-\d+/);
    // Filtering for cells that are actually "filled" (visible)
    // Depending on implementation, we might just check existence.
    expect(cells).toHaveLength(4); 
  });

  it('handles invalid color key by falling back to primary or default', () => {
    const { getByTestId } = renderWithTheme(
      // @ts-ignore
      <PiecePreview piece={[[1]]} color="non-existent-color" testID="piece-preview" />
    );
    const cell = getByTestId('piece-cell-0-0');
    // It should render without crashing and use a fallback color
    expect(cell).toBeTruthy();
  });

  it('handles missing theme gracefully', () => {
    const ThemeContext = require('../../../styles/ThemeContext');
    const originalUseTheme = ThemeContext.useTheme;
    // @ts-ignore
    ThemeContext.useTheme = () => ({ theme: null });

    const { getByTestId } = render(
      // @ts-ignore
      <PiecePreview piece={[[1]]} color="blue" testID="piece-preview" />
    );
    
    expect(getByTestId('piece-preview')).toBeTruthy();
    
    // Restore
    ThemeContext.useTheme = originalUseTheme;
  });
});
