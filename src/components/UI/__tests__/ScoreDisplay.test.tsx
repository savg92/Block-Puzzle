import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { ScoreDisplay } from '../ScoreDisplay';
import { ThemeProvider } from '../../../styles/ThemeContext';

// Mock game store
jest.mock('../../../store/gameStore', () => ({
  useGameStore: () => ({
    score: 123,
  }),
}));

// Mock storage for high score
jest.mock('../../../store/storage', () => ({
  storage: {
    getString: jest.fn(() => '999'), // Higher than 123
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

describe('ScoreDisplay', () => {
  it('renders the labels', () => {
    const { getByText } = renderWithTheme(<ScoreDisplay />);
    expect(getByText('SCORE')).toBeTruthy();
    expect(getByText('BEST')).toBeTruthy();
  });

  it('renders the current score', () => {
    const { getByTestId } = renderWithTheme(<ScoreDisplay />);
    expect(getByTestId('current-score').props.children).toBe(123);
  });

  it('renders the high score from storage', async () => {
    const { getByTestId } = renderWithTheme(<ScoreDisplay />);
    await waitFor(() => {
      expect(getByTestId('high-score').props.children).toBe(999);
    });
  });
});
