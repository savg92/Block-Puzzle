import { renderHook } from '@testing-library/react-native';
import { useSensoryFeedback } from '../useSensoryFeedback';
import { triggerHaptic } from '../../utils/haptics';
import { audioManager } from '../../utils/audio';
import { useGameStore } from '../../store/gameStore';

jest.mock('../../utils/haptics', () => ({
  triggerHaptic: jest.fn(),
}));

jest.mock('../../utils/audio', () => ({
  audioManager: {
    playSound: jest.fn(),
  },
}));

// Mock store to control preferences
jest.mock('../../store/gameStore', () => ({
  useGameStore: jest.fn(),
}));

describe('useSensoryFeedback', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useGameStore as unknown as jest.Mock).mockReturnValue({
      preferences: {
        isMuted: false,
        hapticIntensity: 'medium',
      },
    });
  });

  it('triggers pickup feedback', () => {
    const { result } = renderHook(() => useSensoryFeedback());
    result.current.playPickup();
    expect(triggerHaptic).toHaveBeenCalledWith('pickup');
    expect(audioManager.playSound).toHaveBeenCalledWith('pickup');
  });

  it('triggers place feedback', () => {
    const { result } = renderHook(() => useSensoryFeedback());
    result.current.playPlace();
    expect(triggerHaptic).toHaveBeenCalledWith('place');
    expect(audioManager.playSound).toHaveBeenCalledWith('place');
  });

  it('triggers clear feedback', () => {
    const { result } = renderHook(() => useSensoryFeedback());
    result.current.playClear();
    expect(triggerHaptic).toHaveBeenCalledWith('clear');
    expect(audioManager.playSound).toHaveBeenCalledWith('clear');
  });

  it('triggers gameOver feedback', () => {
    const { result } = renderHook(() => useSensoryFeedback());
    result.current.playGameOver();
    expect(triggerHaptic).toHaveBeenCalledWith('gameOver');
    expect(audioManager.playSound).toHaveBeenCalledWith('gameOver');
  });

  it('triggers tap feedback', () => {
    const { result } = renderHook(() => useSensoryFeedback());
    result.current.playTap();
    expect(triggerHaptic).toHaveBeenCalledWith('tap');
    expect(audioManager.playSound).toHaveBeenCalledWith('tap');
  });

  it('triggers success feedback', () => {
    const { result } = renderHook(() => useSensoryFeedback());
    result.current.playSuccess();
    expect(triggerHaptic).toHaveBeenCalledWith('success');
    expect(audioManager.playSound).toHaveBeenCalledWith('success');
  });

  it('does not trigger audio if muted', () => {
    (useGameStore as unknown as jest.Mock).mockReturnValue({
      preferences: {
        isMuted: true,
        hapticIntensity: 'medium',
      },
    });
    const { result } = renderHook(() => useSensoryFeedback());
    result.current.playPickup();
    expect(triggerHaptic).toHaveBeenCalled();
    expect(audioManager.playSound).not.toHaveBeenCalled();
  });

  it('does not trigger haptics if intensity is off', () => {
    (useGameStore as unknown as jest.Mock).mockReturnValue({
      preferences: {
        isMuted: false,
        hapticIntensity: 'off',
      },
    });
    const { result } = renderHook(() => useSensoryFeedback());
    result.current.playPickup();
    expect(triggerHaptic).not.toHaveBeenCalled();
    expect(audioManager.playSound).toHaveBeenCalled();
  });

  it('does not trigger anything if muted and intensity is off', () => {
    (useGameStore as unknown as jest.Mock).mockReturnValue({
      preferences: {
        isMuted: true,
        hapticIntensity: 'off',
      },
    });
    const { result } = renderHook(() => useSensoryFeedback());
    result.current.playPickup();
    expect(triggerHaptic).not.toHaveBeenCalled();
    expect(audioManager.playSound).not.toHaveBeenCalled();
  });
});
