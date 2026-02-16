import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export type HapticType = 'pickup' | 'place' | 'clear' | 'gameOver' | 'tap' | 'success';

export const triggerHaptic = async (type: HapticType) => {
  if (Platform.OS === 'web') {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      switch (type) {
        case 'tap':
        case 'pickup':
          navigator.vibrate(20);
          break;
        case 'place':
          navigator.vibrate(30);
          break;
        case 'clear':
        case 'success':
          navigator.vibrate([40, 60, 40]);
          break;
        case 'gameOver':
          navigator.vibrate(70);
          break;
        default:
          break;
      }
    }
    return;
  }

  switch (type) {
    case 'tap':
    case 'pickup':
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      break;
    case 'place':
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      break;
    case 'clear':
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      break;
    case 'gameOver':
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      break;
    case 'success':
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      break;
    default:
      break;
  }
};
