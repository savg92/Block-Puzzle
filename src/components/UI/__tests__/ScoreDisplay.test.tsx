import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { ScoreDisplay } from '../ScoreDisplay';
import { ThemeProvider } from '../../../styles/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock game store
jest.mock('../../../store/gameStore', () => ({
  useGameStore: () => ({
    score: 123,
    highScore: 999,
    initStore: jest.fn(),
  }),
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

  it('renders the high score from store', () => {
    const { getByTestId } = renderWithTheme(<ScoreDisplay />);
    expect(getByTestId('high-score').props.children).toBe(999);
  });
});