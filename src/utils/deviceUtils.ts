import { Platform } from 'react-native';

/**
 * Detects if the current device is a touch-enabled device.
 * This is useful for providing extra hit area or visual feedback.
 */
export const isTouchDevice = (): boolean => {
  if (Platform.OS !== 'web') return true;

  if (typeof window === 'undefined') return false;

  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore
    navigator.msMaxTouchPoints > 0
  );
};

/**
 * Detects if the app is running in a standalone PWA mode.
 */
export const isStandalonePWA = (): boolean => {
  if (Platform.OS !== 'web') return false;
  if (typeof window === 'undefined') return false;

  // @ts-ignore - 'standalone' is non-standard but supported in older browsers/iOS
  const isStandalone = window.navigator.standalone === true;
  const isDisplayModeStandalone = window.matchMedia('(display-mode: standalone)').matches;

  return isStandalone || isDisplayModeStandalone;
};
