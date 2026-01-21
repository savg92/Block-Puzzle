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

  it('triggers medium impact for drop', async () => {
    await triggerHaptic('drop');
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
