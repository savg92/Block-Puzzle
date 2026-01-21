import * as Haptics from 'expo-haptics';

export type HapticType = 'pickup' | 'place' | 'clear' | 'gameOver' | 'tap';

export const triggerHaptic = async (type: HapticType) => {
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
  }
};
