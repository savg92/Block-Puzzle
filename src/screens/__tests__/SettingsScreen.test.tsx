import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SettingsScreen } from '../SettingsScreen';
import { ThemeProvider } from '../../styles/ThemeContext';

// Mock game store
const mockUpdatePreferences = jest.fn();
const mockPreferences = {
  soundVolume: 1.0,
  isMuted: false,
  hapticIntensity: 'medium',
  theme: 'system',
};

jest.mock('../../store/gameStore', () => ({
  useGameStore: () => ({
    preferences: mockPreferences,
    updatePreferences: mockUpdatePreferences,
  }),
}));

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('SettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = renderWithTheme(<SettingsScreen visible={true} onClose={jest.fn()} />);
    expect(getByText('SETTINGS')).toBeTruthy();
    expect(getByText('Sound')).toBeTruthy();
    expect(getByText('Haptics')).toBeTruthy();
    expect(getByText('Theme')).toBeTruthy();
  });

  it('calls updatePreferences when toggling mute', () => {
    const { getByTestId } = renderWithTheme(<SettingsScreen visible={true} onClose={jest.fn()} />);
    const muteToggle = getByTestId('mute-toggle');
    fireEvent(muteToggle, 'onValueChange', true);
    expect(mockUpdatePreferences).toHaveBeenCalledWith({ isMuted: true });
  });

  it('calls updatePreferences when changing haptic intensity', () => {
    const { getByText } = renderWithTheme(<SettingsScreen visible={true} onClose={jest.fn()} />);
    fireEvent.press(getByText('High'));
    expect(mockUpdatePreferences).toHaveBeenCalledWith({ hapticIntensity: 'high' });
  });
});