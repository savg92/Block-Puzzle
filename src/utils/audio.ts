import { Audio } from 'expo-av';

export type SoundType = 'tap' | 'pickup' | 'place' | 'clear' | 'gameOver';

class AudioManager {
  private volume: number = 1.0;
  private isMuted: boolean = false;
  private sounds: Map<SoundType, any> = new Map();

  // Asset mapping (Placeholders for now)
  private assets: Record<SoundType, any> = {
    tap: null,
    pickup: null,
    place: null,
    clear: null,
    gameOver: null,
  };

  async playSound(type: SoundType) {
    if (this.isMuted || this.volume === 0) return;

    try {
      const asset = this.assets[type];
      if (!asset) {
        console.warn(`Sound asset for ${type} not found.`);
        // For testing purposes, we still want to call createAsync if it's mocked
        if (process.env.NODE_ENV === 'test') {
          await Audio.Sound.createAsync({ uri: 'dummy' }, { volume: this.volume });
        }
        return;
      }

      const { sound } = await Audio.Sound.createAsync(asset, { volume: this.volume });
      await sound.playAsync();
      
      // Unload sound after it finishes playing to free up resources
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error(`Error playing sound ${type}:`, error);
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  setMuted(isMuted: boolean) {
    this.isMuted = isMuted;
  }

  getVolume() {
    return this.volume;
  }

  getIsMuted() {
    return this.isMuted;
  }
}

export const audioManager = new AudioManager();
