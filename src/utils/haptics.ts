import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export type HapticType = 'pickup' | 'place' | 'clear' | 'gameOver' | 'tap' | 'success';

// iOS 18+ PWA workaround: a hidden checkbox with 'switch' type triggers a light haptic on click
let hapticSwitch: HTMLInputElement | null = null;

const triggerIOS18Haptic = () => {
  if (typeof document === 'undefined') return;
  
  if (!hapticSwitch) {
    hapticSwitch = document.createElement('input');
    hapticSwitch.type = 'checkbox';
    // @ts-ignore - 'switch' is a non-standard attribute supported in iOS 18 Safari
    hapticSwitch.setAttribute('switch', '');
    hapticSwitch.style.position = 'absolute';
    hapticSwitch.style.opacity = '0';
    hapticSwitch.style.pointerEvents = 'none';
    hapticSwitch.style.left = '-9999px';
    hapticSwitch.style.top = '-9999px';
    document.body.appendChild(hapticSwitch);
  }
  
  // Triggering a click on this specific element type causes a tiny haptic on iOS 18+
  hapticSwitch.click();
};

export const triggerHaptic = async (type: HapticType) => {
  if (Platform.OS === 'web') {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    if (isIOS) {
      // Standard Vibration API is not supported on iOS Safari
      triggerIOS18Haptic();
      return;
    }

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

  // Native Platform (iOS/Android via Expo Haptics)
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

/** @internal Only for testing purposes */
export const resetHapticsForTesting = () => {
  hapticSwitch = null;
};
