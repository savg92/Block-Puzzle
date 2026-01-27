import React from 'react';
import { render } from '@testing-library/react-native';
import { GhostPiece } from '../GhostPiece';
import { ThemeProvider } from '../../../styles/ThemeContext';
import { PIECES } from '../../../engine/pieces';

describe('GhostPiece', () => {
  it('renders correctly when visible', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <GhostPiece 
          piece={PIECES.SINGLE} 
          color="primary" 
          x={100} 
          y={200} 
          visible={true} 
        />
      </ThemeProvider>
    );

    const ghost = getByTestId('ghost-piece');
    expect(ghost).toBeTruthy();
  });

  it('renders correctly when not visible', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <GhostPiece 
          piece={PIECES.SINGLE} 
          color="primary" 
          x={100} 
          y={200} 
          visible={false} 
        />
      </ThemeProvider>
    );

    const ghost = getByTestId('ghost-piece');
    expect(ghost).toBeTruthy();
  });
});
