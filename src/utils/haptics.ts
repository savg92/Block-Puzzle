import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export type HapticType = 'pickup' | 'place' | 'clear' | 'gameOver' | 'tap' | 'success';

// iOS 18+ PWA workaround: toggling a checkbox with 'switch' attribute
// triggers a native system haptic click via the label element.
// Using a label click is more reliable than checkbox.click() for
// maintaining user activation context.
let hapticCheckbox: HTMLInputElement | null = null;
let hapticLabel: HTMLLabelElement | null = null;

const ensureHapticElements = () => {
  if (typeof document === 'undefined') return false;

  if (!hapticCheckbox) {
    hapticCheckbox = document.createElement('input');
    hapticCheckbox.type = 'checkbox';
    hapticCheckbox.id = '__haptic_switch';
    // @ts-ignore - 'switch' is a non-standard attribute supported in iOS 18 Safari
    hapticCheckbox.setAttribute('switch', '');
    hapticCheckbox.style.position = 'fixed';
    hapticCheckbox.style.opacity = '0';
    hapticCheckbox.style.pointerEvents = 'none';
    hapticCheckbox.style.width = '0';
    hapticCheckbox.style.height = '0';
    hapticCheckbox.style.left = '-9999px';
    hapticCheckbox.style.top = '-9999px';
    document.body.appendChild(hapticCheckbox);

    hapticLabel = document.createElement('label');
    hapticLabel.setAttribute('for', '__haptic_switch');
    hapticLabel.style.position = 'fixed';
    hapticLabel.style.opacity = '0';
    hapticLabel.style.pointerEvents = 'none';
    hapticLabel.style.width = '0';
    hapticLabel.style.height = '0';
    hapticLabel.style.left = '-9999px';
    hapticLabel.style.top = '-9999px';
    document.body.appendChild(hapticLabel);
  }

  return true;
};

const triggerIOS18Haptic = () => {
  if (!ensureHapticElements() || !hapticLabel) return;

  // Clicking the label toggles the associated checkbox,
  // which triggers the native iOS haptic feedback
  hapticLabel.click();
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
  hapticCheckbox = null;
  hapticLabel = null;
};
