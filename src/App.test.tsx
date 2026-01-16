import React from 'react';
import { render } from '@testing-library/react-native';
import App from './App';

// Mock storage
jest.mock('./store/storage', () => ({
  storage: {
    getString: jest.fn(() => 'system'),
    set: jest.fn(),
  },
}));

// Mock game store
jest.mock('./store/gameStore', () => ({
  useGameStore: () => ({
    grid: Array.from({ length: 10 }, () => Array(10).fill(0)),
    score: 0,
    availablePieces: [],
    selectedPiece: null,
    isGameOver: false,
    newGame: jest.fn(),
    initStore: jest.fn(),
  }),
}));

describe('App', () => {
  it('renders correctly', () => {
    const { getByText, getAllByTestId } = render(<App />);
    expect(getByText('Block Puzzle')).toBeTruthy();
    
    // Check if grid is rendered (100 cells)
    const cells = getAllByTestId(/^cell-\d+-\d+$/);
    expect(cells).toHaveLength(100);
  });
});