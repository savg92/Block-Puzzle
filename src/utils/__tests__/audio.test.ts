import { Audio } from 'expo-av';
import { audioManager } from '../audio';

jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn().mockResolvedValue({
        sound: {
          playAsync: jest.fn(),
          unloadAsync: jest.fn(),
          setVolumeAsync: jest.fn(),
          setStatusAsync: jest.fn(),
          setOnPlaybackStatusUpdate: jest.fn(),
        },
        status: { isLoaded: true },
      }),
    },
  },
}));

describe('audioManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    audioManager.setVolume(1.0);
    audioManager.setMuted(false);
  });

  it('plays tap sound', async () => {
    await audioManager.playSound('tap');
    expect(Audio.Sound.createAsync).toHaveBeenCalled();
  });

  it('plays sound with asset', async () => {
    // Manually inject a dummy asset for testing
    // @ts-ignore
    audioManager.assets.tap = { uri: 'real-asset' };
    
    await audioManager.playSound('tap');
    expect(Audio.Sound.createAsync).toHaveBeenCalledWith(
      { uri: 'real-asset' },
      expect.anything()
    );
    
    // Clean up
    // @ts-ignore
    audioManager.assets.tap = null;
  });

  it('unloads sound when finished', async () => {
    let callback: any;
    const mockUnload = jest.fn();
    (Audio.Sound.createAsync as jest.Mock).mockResolvedValue({
      sound: {
        playAsync: jest.fn(),
        unloadAsync: mockUnload,
        setOnPlaybackStatusUpdate: (cb: any) => { callback = cb; },
      },
      status: { isLoaded: true },
    });

    // @ts-ignore
    audioManager.assets.tap = { uri: 'test' };
    await audioManager.playSound('tap');
    
    // Simulate finish
    callback({ isLoaded: true, didJustFinish: true });
    expect(mockUnload).toHaveBeenCalled();
    
    // @ts-ignore
    audioManager.assets.tap = null;
  });

  it('handles playback errors', async () => {
    (Audio.Sound.createAsync as jest.Mock).mockRejectedValue(new Error('Playback failed'));
    const spy = jest.spyOn(console, 'error').mockImplementation();
    
    // @ts-ignore
    audioManager.assets.tap = { uri: 'test' };
    await audioManager.playSound('tap');
    
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
    // @ts-ignore
    audioManager.assets.tap = null;
  });

  it('sets volume', async () => {
    audioManager.setVolume(0.5);
    expect(audioManager.getVolume()).toBe(0.5);
    await audioManager.playSound('pickup');
    expect(Audio.Sound.createAsync).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ volume: 0.5 })
    );
  });

  it('handles muted state', async () => {
    audioManager.setMuted(true);
    expect(audioManager.getIsMuted()).toBe(true);
    await audioManager.playSound('tap');
    expect(Audio.Sound.createAsync).not.toHaveBeenCalled();
  });

  it('handles zero volume as muted', async () => {
    audioManager.setVolume(0);
    await audioManager.playSound('tap');
    expect(Audio.Sound.createAsync).not.toHaveBeenCalled();
  });

  it('bounds volume between 0 and 1', () => {
    audioManager.setVolume(1.5);
    expect(audioManager.getVolume()).toBe(1.0);
    audioManager.setVolume(-0.5);
    expect(audioManager.getVolume()).toBe(0);
  });
});
