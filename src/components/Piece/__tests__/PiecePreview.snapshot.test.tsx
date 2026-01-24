import React from 'react';
import { render } from '@testing-library/react-native';
import { PiecePreview } from '../PiecePreview';
import { PIECES } from '../../../engine/pieces';
import { ThemeProvider } from '../../../styles/ThemeContext';

describe('PiecePreview Snapshots', () => {
  it('renders SINGLE piece correctly', () => {
    const { toJSON } = render(
      <ThemeProvider>
        <PiecePreview piece={PIECES.SINGLE} color="cyan" />
      </ThemeProvider>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders BIG_L piece correctly', () => {
    const { toJSON } = render(
      <ThemeProvider>
        <PiecePreview piece={PIECES.BIG_L} color="orange" />
      </ThemeProvider>
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
