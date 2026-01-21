import * as Haptics from 'expo-haptics';

export type HapticType = 'pickup' | 'drop' | 'clear' | 'gameOver';

export const triggerHaptic = async (type: HapticType) => {
  switch (type) {
    case 'pickup':
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      break;
    case 'drop':
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
