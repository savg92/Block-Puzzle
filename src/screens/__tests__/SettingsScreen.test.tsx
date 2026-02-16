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
  showPieceShadow: true,
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
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when visible', () => {
    const { getByText } = renderWithTheme(
      <SettingsScreen visible={true} onClose={onClose} />
    );
    expect(getByText('SETTINGS')).toBeTruthy();
  });

  it('handles mute toggle', () => {
    const { getByTestId } = renderWithTheme(
      <SettingsScreen visible={true} onClose={onClose} />
    );
    
    const muteToggle = getByTestId('mute-toggle');
    fireEvent(muteToggle, 'valueChange', true);
    
    expect(mockUpdatePreferences).toHaveBeenCalledWith({ isMuted: true });
  });

  it('handles haptic intensity change', () => {
    const { getByText } = renderWithTheme(
      <SettingsScreen visible={true} onClose={onClose} />
    );
    
    fireEvent.press(getByText('High'));
    expect(mockUpdatePreferences).toHaveBeenCalledWith({ hapticIntensity: 'high' });
    
    fireEvent.press(getByText('Off'));
    expect(mockUpdatePreferences).toHaveBeenCalledWith({ hapticIntensity: 'off' });
  });

  it('handles theme change', () => {
    const { getByText } = renderWithTheme(
      <SettingsScreen visible={true} onClose={onClose} />
    );
    
    fireEvent.press(getByText('Dark'));
    expect(mockUpdatePreferences).toHaveBeenCalledWith({ theme: 'dark' });
    
    fireEvent.press(getByText('Light'));
    expect(mockUpdatePreferences).toHaveBeenCalledWith({ theme: 'light' });
  });

  it('handles shadow toggle', () => {
    const { getByTestId } = renderWithTheme(
      <SettingsScreen visible={true} onClose={onClose} />
    );
    
    const shadowToggle = getByTestId('shadow-toggle');
    fireEvent(shadowToggle, 'valueChange', false);
    
    expect(mockUpdatePreferences).toHaveBeenCalledWith({ showPieceShadow: false });
  });

  it('calls onClose when close button pressed', () => {
    const { getByText } = renderWithTheme(
      <SettingsScreen visible={true} onClose={onClose} />
    );
    
    fireEvent.press(getByText('✕'));
    expect(onClose).toHaveBeenCalled();
  });
});