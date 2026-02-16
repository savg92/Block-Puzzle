import React from 'react';
import { render } from '@testing-library/react-native';
import { PowerUpNotification } from '../PowerUpNotification';
import { useGameStore } from '../../../store/gameStore';
import { ThemeProvider } from '../../../styles/ThemeContext';

// Mock useGameStore
jest.mock('../../../store/gameStore', () => ({
  useGameStore: jest.fn(),
}));

describe('PowerUpNotification', () => {
  const mockClearNotification = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when no power up is earned', () => {
    (useGameStore as unknown as jest.Mock).mockReturnValue({
      lastEarnedPowerUp: null,
      notificationId: 0,
      clearNotification: mockClearNotification,
    });

    const { queryByText } = render(
      <ThemeProvider>
        <PowerUpNotification />
      </ThemeProvider>
    );

    expect(queryByText('Power-Up Earned!')).toBeNull();
  });

  it('renders notification when power up is earned', () => {
    (useGameStore as unknown as jest.Mock).mockReturnValue({
      lastEarnedPowerUp: 'rotate',
      notificationId: 1,
      clearNotification: mockClearNotification,
      preferences: { isMuted: false },
    });

    const { getByText } = render(
      <ThemeProvider>
        <PowerUpNotification />
      </ThemeProvider>
    );

    expect(getByText('Power-Up Earned!')).toBeTruthy();
    expect(getByText(/Rotate/)).toBeTruthy();
  });

  it('updates when notificationId changes', () => {
    (useGameStore as unknown as jest.Mock).mockReturnValue({
      lastEarnedPowerUp: 'undo',
      notificationId: 2,
      clearNotification: mockClearNotification,
      preferences: { isMuted: false },
    });

    const { rerender, getByText } = render(
      <ThemeProvider>
        <PowerUpNotification />
      </ThemeProvider>
    );

    (useGameStore as unknown as jest.Mock).mockReturnValue({
      lastEarnedPowerUp: 'undo',
      notificationId: 3,
      clearNotification: mockClearNotification,
      preferences: { isMuted: false },
    });

    rerender(
      <ThemeProvider>
        <PowerUpNotification />
      </ThemeProvider>
    );

    expect(getByText(/Undo/)).toBeTruthy();
  });
});
