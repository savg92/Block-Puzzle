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
    grid: Array(10).fill(null).map(() => Array(10).fill(null)),
  }),
}));

describe('App', () => {
  it('renders correctly', () => {
    const { getByText, getAllByTestId } = render(<App />);
    expect(getByText('Block Puzzle')).toBeTruthy();
    expect(getByText('UI Foundation Ready')).toBeTruthy();
    
    // Check if grid is rendered (100 cells)
    const cells = getAllByTestId(/^cell-\d+-\d+$/);
    expect(cells).toHaveLength(100);
  });
});
