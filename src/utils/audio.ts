import { createAudioPlayer, AudioPlayer } from 'expo-audio';

export type SoundType = 'tap' | 'pickup' | 'place' | 'clear' | 'gameOver';

class AudioManager {
  private volume: number = 1.0;
  private isMuted: boolean = false;
  private players: Set<AudioPlayer> = new Set();

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
      
      let player: AudioPlayer;
      
      if (!asset) {
        console.warn(`Sound asset for ${type} not found.`);
        // For testing purposes, we still want to create a player if it's mocked
        if (process.env.NODE_ENV === 'test') {
          player = createAudioPlayer({ uri: 'dummy' });
        } else {
          return;
        }
      } else {
        player = createAudioPlayer(asset);
      }

      player.volume = this.volume;
      this.players.add(player);
      
      player.play();
      
      // Remove player after it finishes playing to free up resources
      const subscription = player.addListener('playbackStatusUpdate', (status) => {
        if (status.didJustFinish) {
          subscription.remove();
          this.players.delete(player);
          player.remove();
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
