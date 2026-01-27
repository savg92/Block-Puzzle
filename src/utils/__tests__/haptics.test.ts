import * as Haptics from 'expo-haptics';
import { triggerHaptic, HapticType } from '../haptics';

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

describe('haptics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  it('triggers light impact for tap', async () => {
    await triggerHaptic('tap');
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
  });

  it('triggers success notification for success', async () => {
    await triggerHaptic('success');
    expect(Haptics.notificationAsync).toHaveBeenCalledWith(Haptics.NotificationFeedbackType.Success);
  });

  it('does nothing for invalid haptic type', async () => {
    // @ts-ignore
    await triggerHaptic('invalid');
    expect(Haptics.impactAsync).not.toHaveBeenCalled();
    expect(Haptics.notificationAsync).not.toHaveBeenCalled();
  });

  it('triggers light impact for tap explicitly', async () => {
    await triggerHaptic('tap');
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
  });
});
