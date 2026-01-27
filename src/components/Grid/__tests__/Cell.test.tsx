import React from 'react';
import { render } from '@testing-library/react-native';
import { Cell } from '../Cell';
import { ThemeProvider } from '../../../styles/ThemeContext';

describe('Cell', () => {
  it('renders with clearing animation state', () => {
    const { rerender } = render(
      <ThemeProvider>
        <Cell color="red" isClearing={false} />
      </ThemeProvider>
    );
    
    // Trigger isClearing branch
    rerender(
      <ThemeProvider>
        <Cell color="red" isClearing={true} />
      </ThemeProvider>
    );
  });

  it('handles filling a previously cleared cell', () => {
    const { rerender } = render(
      <ThemeProvider>
        <Cell color="red" isClearing={true} />
      </ThemeProvider>
    );
    
    // Fill it
    rerender(
      <ThemeProvider>
        <Cell color="blue" isClearing={false} />
      </ThemeProvider>
    );
  });

  it('renders correctly without onPress', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <Cell color={null} testID="test-cell" />
      </ThemeProvider>
    );
    expect(getByTestId('test-cell')).toBeDefined();
  });

  it('handles other color types', () => {
    const { rerender } = render(
      <ThemeProvider>
        <Cell color="transparent" />
      </ThemeProvider>
    );
    rerender(
      <ThemeProvider>
        <Cell color={0} />
      </ThemeProvider>
    );
  });
});