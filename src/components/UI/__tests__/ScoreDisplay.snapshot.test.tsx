import React from 'react';
import { render } from '@testing-library/react-native';
import { ScoreDisplay } from '../ScoreDisplay';
import { useGameStore } from '../../../store/gameStore';
import { ThemeProvider } from '../../../styles/ThemeContext';

// Mock the store
jest.mock('../../../store/gameStore', () => ({
  useGameStore: jest.fn(),
}));

describe('ScoreDisplay Snapshots', () => {
  it('renders correctly with zero score', () => {
    (useGameStore as any).mockReturnValue({
      score: 0,
      highScore: 0,
      initStore: jest.fn(),
      preferences: { theme: 'dark' },
    });

    const { toJSON } = render(
      <ThemeProvider>
        <ScoreDisplay />
      </ThemeProvider>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders correctly with non-zero score', () => {
    (useGameStore as any).mockReturnValue({
      score: 1250,
      highScore: 5000,
      initStore: jest.fn(),
      preferences: { theme: 'dark' },
    });

    const { toJSON } = render(
      <ThemeProvider>
        <ScoreDisplay />
      </ThemeProvider>
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
