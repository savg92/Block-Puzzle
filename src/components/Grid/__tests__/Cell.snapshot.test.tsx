import React from 'react';
import { render } from '@testing-library/react-native';
import { Cell } from '../Cell';
import { ThemeProvider } from '../../../styles/ThemeContext';
import { useGameStore } from '../../../store/gameStore';

// Mock the store
jest.mock('../../../store/gameStore', () => ({
  useGameStore: jest.fn(),
}));

describe('Cell Snapshots', () => {
  beforeEach(() => {
    (useGameStore as any).mockReturnValue({
      preferences: { theme: 'dark' },
    });
  });

  it('renders empty cell correctly', () => {
    const { toJSON } = render(
      <ThemeProvider>
        <Cell color={0} />
      </ThemeProvider>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders filled cell correctly', () => {
    const { toJSON } = render(
      <ThemeProvider>
        <Cell color="red" />
      </ThemeProvider>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders clearing cell correctly', () => {
    const { toJSON } = render(
      <ThemeProvider>
        <Cell color="blue" isClearing={true} />
      </ThemeProvider>
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
