import { triggerHaptic, HapticType } from '../utils/haptics';
import { audioManager, SoundType } from '../utils/audio';
import { useGameStore } from '../store/gameStore';

export const useSensoryFeedback = () => {
  const { preferences } = useGameStore();

  const playFeedback = (type: HapticType & SoundType) => {
    // Audio
    if (!preferences.isMuted) {
      audioManager.playSound(type);
    }

    // Haptics
    if (preferences.hapticIntensity !== 'off') {
      triggerHaptic(type);
    }
  };

  return {
    playPickup: () => playFeedback('pickup'),
    playPlace: () => playFeedback('place'),
    playClear: () => playFeedback('clear'),
    playGameOver: () => playFeedback('gameOver'),
    playTap: () => playFeedback('tap'),
    playSuccess: () => playFeedback('success'),
  };
};
