import React from 'react';
import { render } from '@testing-library/react-native';
import App from './App';

// Mock storage
jest.mock('./store/storage', () => ({
  storage: {
    getString: jest.fn(),
    set: jest.fn(),
  },
}));

describe('App', () => {
  it('renders correctly', () => {
    const { getByText } = render(<App />);
    expect(getByText('Block Puzzle')).toBeTruthy();
    expect(getByText('UI Foundation Ready')).toBeTruthy();
  });
});