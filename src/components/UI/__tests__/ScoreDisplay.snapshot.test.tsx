import React from 'react';
import { render } from '@testing-library/react-native';
import { ScoreDisplay } from '../ScoreDisplay';
import { useGameStore } from '../../../store/gameStore';

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
    });

    const { toJSON } = render(<ScoreDisplay />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders correctly with non-zero score', () => {
    (useGameStore as any).mockReturnValue({
      score: 1250,
      highScore: 5000,
      initStore: jest.fn(),
    });

    const { toJSON } = render(<ScoreDisplay />);
    expect(toJSON()).toMatchSnapshot();
  });
});
