import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { triggerHaptic } from '../haptics';

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
  NotificationFeedbackType: {
    Success: 'success',
    Error: 'error',
    Warning: 'warning',
  },
}));

jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
}));

describe('haptics', () => {
  const originalVibrate = global.navigator?.vibrate;

  beforeEach(() => {
    jest.clearAllMocks();
    Platform.OS = 'ios';
    // @ts-ignore
    global.navigator.vibrate = jest.fn();
  });

  afterAll(() => {
    // @ts-ignore
    global.navigator.vibrate = originalVibrate;
  });

  describe('Native Platform', () => {
    it('triggers light impact for pickup', async () => {
      await triggerHaptic('pickup');
      expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
      expect(global.navigator.vibrate).not.toHaveBeenCalled();
    });

    it('triggers medium impact for place', async () => {
      await triggerHaptic('place');
      expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Medium);
    });

    it('triggers success notification for clear', async () => {
      await triggerHaptic('clear');
      expect(Haptics.notificationAsync).toHaveBeenCalledWith(Haptics.NotificationFeedbackType.Success);
    });

    it('triggers heavy impact for game over', async () => {
      await triggerHaptic('gameOver');
      expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Heavy);
    });
  });

  describe('Web Platform', () => {
    beforeEach(() => {
      Platform.OS = 'web';
    });

    it('triggers vibrate for pickup', async () => {
      await triggerHaptic('pickup');
      expect(global.navigator.vibrate).toHaveBeenCalledWith(10);
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });

    it('triggers vibrate for place', async () => {
      await triggerHaptic('place');
      expect(global.navigator.vibrate).toHaveBeenCalledWith(20);
    });

    it('triggers vibrate for clear', async () => {
      await triggerHaptic('clear');
      expect(global.navigator.vibrate).toHaveBeenCalledWith([30, 50, 30]);
    });

    it('triggers vibrate for gameOver', async () => {
      await triggerHaptic('gameOver');
      expect(global.navigator.vibrate).toHaveBeenCalledWith(50);
    });
  });
});
