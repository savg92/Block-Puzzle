import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { triggerHaptic, resetHapticsForTesting } from '../haptics';

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
  const originalUserAgent = global.navigator?.userAgent;
  const originalPlatform = global.navigator?.platform;
  const originalMaxTouchPoints = global.navigator?.maxTouchPoints;

  beforeEach(() => {
    jest.clearAllMocks();
    resetHapticsForTesting();
    Platform.OS = 'ios';
    
    // Mock navigator
    Object.defineProperty(global.navigator, 'vibrate', {
      writable: true,
      value: jest.fn(),
    });
    Object.defineProperty(global.navigator, 'userAgent', {
      writable: true,
      configurable: true,
      value: 'iPhone',
    });
    Object.defineProperty(global.navigator, 'platform', {
      writable: true,
      configurable: true,
      value: 'iPhone',
    });
    Object.defineProperty(global.navigator, 'maxTouchPoints', {
      writable: true,
      configurable: true,
      value: 0,
    });

    // Mock document.createElement for iOS workaround
    if (typeof document !== 'undefined') {
      const mockElement = {
        setAttribute: jest.fn(),
        style: {},
        click: jest.fn(),
      };
      jest.spyOn(document, 'createElement').mockReturnValue(mockElement as any);
      jest.spyOn(document.body, 'appendChild').mockImplementation(() => mockElement as any);
    }
  });

  afterAll(() => {
    Object.defineProperty(global.navigator, 'vibrate', { value: originalVibrate });
    Object.defineProperty(global.navigator, 'userAgent', { value: originalUserAgent });
    Object.defineProperty(global.navigator, 'platform', { value: originalPlatform });
  });

  describe('Native Platform', () => {
    it('triggers light impact for pickup', async () => {
      await triggerHaptic('pickup');
      expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
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

    it('triggers iOS workaround on iOS web', async () => {
      // Mocking iOS user agent
      Object.defineProperty(global.navigator, 'userAgent', { value: 'iPhone' });
      
      await triggerHaptic('pickup');
      
      expect(document.createElement).toHaveBeenCalledWith('input');
      expect(document.body.appendChild).toHaveBeenCalled();
    });

    it('triggers vibrate for pickup on non-iOS web', async () => {
      // Mocking Android user agent
      Object.defineProperty(global.navigator, 'userAgent', { value: 'Android' });
      
      await triggerHaptic('pickup');
      expect(global.navigator.vibrate).toHaveBeenCalledWith(20);
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });

    it('triggers vibrate for place on non-iOS web', async () => {
      Object.defineProperty(global.navigator, 'userAgent', { value: 'Android' });
      await triggerHaptic('place');
      expect(global.navigator.vibrate).toHaveBeenCalledWith(30);
    });

    it('triggers vibrate for clear on non-iOS web', async () => {
      Object.defineProperty(global.navigator, 'userAgent', { value: 'Android' });
      await triggerHaptic('clear');
      expect(global.navigator.vibrate).toHaveBeenCalledWith([40, 60, 40]);
    });

    it('triggers vibrate for gameOver on non-iOS web', async () => {
      Object.defineProperty(global.navigator, 'userAgent', { value: 'Android' });
      await triggerHaptic('gameOver');
      expect(global.navigator.vibrate).toHaveBeenCalledWith(70);
    });

    it('triggers iOS workaround on iPad (MacIntel with touch points)', async () => {
      // Mocking iPad (MacIntel)
      Object.defineProperty(global.navigator, 'userAgent', { value: 'MacIntel' });
      Object.defineProperty(global.navigator, 'platform', { value: 'MacIntel' });
      // @ts-ignore
      global.navigator.maxTouchPoints = 5;
      
      await triggerHaptic('pickup');
      expect(document.createElement).toHaveBeenCalledWith('input');
    });

    it('triggers vibrate for success on non-iOS web', async () => {
      Object.defineProperty(global.navigator, 'userAgent', { value: 'Android' });
      await triggerHaptic('success');
      expect(global.navigator.vibrate).toHaveBeenCalledWith([40, 60, 40]);
    });

    it('triggers vibrate for tap on non-iOS web', async () => {
      Object.defineProperty(global.navigator, 'userAgent', { value: 'Android' });
      await triggerHaptic('tap');
      expect(global.navigator.vibrate).toHaveBeenCalledWith(20);
    });

    it('does nothing when navigator.vibrate is missing on non-iOS web', async () => {
      Object.defineProperty(global.navigator, 'userAgent', { value: 'Android' });
      Object.defineProperty(global.navigator, 'vibrate', { value: undefined });
      
      await triggerHaptic('pickup');
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });

    it('does nothing for unknown haptic type on web', async () => {
      Object.defineProperty(global.navigator, 'userAgent', { value: 'Android' });
      // @ts-ignore
      await triggerHaptic('unknown');
      expect(global.navigator.vibrate).not.toHaveBeenCalled();
    });
  });

  describe('Native Platform - Unknown Type', () => {
    it('does nothing for unknown haptic type on native', async () => {
      Platform.OS = 'ios';
      // @ts-ignore
      await triggerHaptic('unknown');
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
      expect(Haptics.notificationAsync).not.toHaveBeenCalled();
    });

    it('triggers success for success type on native', async () => {
      Platform.OS = 'ios';
      await triggerHaptic('success');
      expect(Haptics.notificationAsync).toHaveBeenCalledWith(Haptics.NotificationFeedbackType.Success);
    });

    it('triggers light impact for tap type on native', async () => {
      Platform.OS = 'ios';
      await triggerHaptic('tap');
      expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
    });
  });
});
