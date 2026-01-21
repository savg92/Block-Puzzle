import { useGameStore } from '../gameStore';

describe('User Preferences State', () => {
  beforeEach(() => {
    useGameStore.getState().newGame();
  });

  it('has default preferences', () => {
    const { preferences } = useGameStore.getState();
    expect(preferences).toBeDefined();
    expect(preferences.soundVolume).toBe(1.0);
    expect(preferences.hapticIntensity).toBe('medium');
    expect(preferences.isMuted).toBe(false);
    expect(preferences.theme).toBe('system');
  });

  it('updates preferences correctly', () => {
    const { updatePreferences } = useGameStore.getState();
    
    updatePreferences({ soundVolume: 0.5, hapticIntensity: 'off' });
    
    const { preferences } = useGameStore.getState();
    expect(preferences.soundVolume).toBe(0.5);
    expect(preferences.hapticIntensity).toBe('off');
    expect(preferences.isMuted).toBe(false); // Unchanged
  });

  it('partialize includes preferences for persistence', () => {
    // @ts-ignore
    const partialize = (useGameStore as any).persist.getOptions().partialize;
    
    const state = {
      preferences: {
        soundVolume: 0.2,
        hapticIntensity: 'high',
        isMuted: true,
        theme: 'dark'
      },
      grid: [],
      // ... other fields
    };

    const persistedState = partialize(state);
    expect(persistedState.preferences).toEqual(state.preferences);
  });
});
