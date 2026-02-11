import { createAudioPlayer, useAudioPlayer, AudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { audioManager } from '../audio';

// Mock the whole module
jest.mock('expo-audio', () => {
  const mockPlayer = {
    play: jest.fn(),
    remove: jest.fn(),
    addListener: jest.fn().mockReturnValue({
      remove: jest.fn(),
    }),
    volume: 1.0,
    muted: false,
  };
  return {
    useAudioPlayer: jest.fn().mockReturnValue(mockPlayer),
    useAudioPlayerStatus: jest.fn(),
    createAudioPlayer: jest.fn().mockReturnValue(mockPlayer),
  };
});

describe('audioManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    audioManager.setVolume(1.0);
    audioManager.setMuted(false);
  });

  it('plays tap sound', async () => {
    await audioManager.playSound('tap');
    expect(createAudioPlayer).toHaveBeenCalled();
  });

  it('plays sound with asset', async () => {
    // Manually inject a dummy asset for testing
    // @ts-ignore
    audioManager.assets.tap = { uri: 'real-asset' };
    
    await audioManager.playSound('tap');
    expect(createAudioPlayer).toHaveBeenCalledWith(
      { uri: 'real-asset' }
    );
    
    // Clean up
    // @ts-ignore
    audioManager.assets.tap = null;
  });

  it('unloads sound when finished', async () => {
    let callback: any;
    const mockRemove = jest.fn();
    (createAudioPlayer as jest.Mock).mockReturnValue({
      play: jest.fn(),
      remove: mockRemove,
      addListener: (event: string, cb: any) => { 
        if (event === 'playbackStatusUpdate') callback = cb;
        return { remove: jest.fn() };
      },
      volume: 1.0,
    });

    // @ts-ignore
    audioManager.assets.tap = { uri: 'test' };
    await audioManager.playSound('tap');
    
    // Simulate finish
    callback({ didJustFinish: true });
    expect(mockRemove).toHaveBeenCalled();
    
    // Simulate non-finish update
    mockRemove.mockClear();
    callback({ didJustFinish: false });
    expect(mockRemove).not.toHaveBeenCalled();
    
    // @ts-ignore
    audioManager.assets.tap = null;
  });

  it('handles playback errors', async () => {
    (createAudioPlayer as jest.Mock).mockImplementation(() => {
      throw new Error('Playback failed');
    });
    const spy = jest.spyOn(console, 'error').mockImplementation();
    
    // @ts-ignore
    audioManager.assets.tap = { uri: 'test' };
    await audioManager.playSound('tap');
    
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
    // @ts-ignore
    audioManager.assets.tap = null;
  });

  it('plays sound when asset is provided', async () => {
    // @ts-ignore
    audioManager.assets.tap = { uri: 'test-asset' };
    await audioManager.playSound('tap');
    expect(createAudioPlayer).toHaveBeenCalledWith({ uri: 'test-asset' });
    // @ts-ignore
    audioManager.assets.tap = null;
  });

  it('sets volume', async () => {
    const mockPlayer = {
      play: jest.fn(),
      remove: jest.fn(),
      addListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
      volume: 1.0,
    };
    (createAudioPlayer as jest.Mock).mockReturnValue(mockPlayer);

    audioManager.setVolume(0.5);
    expect(audioManager.getVolume()).toBe(0.5);
    await audioManager.playSound('pickup');
    expect(mockPlayer.volume).toBe(0.5);
  });

  it('handles muted state', async () => {
    audioManager.setMuted(true);
    expect(audioManager.getIsMuted()).toBe(true);
    await audioManager.playSound('tap');
    expect(createAudioPlayer).not.toHaveBeenCalled();
  });

  it('handles zero volume as muted', async () => {
    audioManager.setVolume(0);
    await audioManager.playSound('tap');
    expect(createAudioPlayer).not.toHaveBeenCalled();
  });

  it('does not create player when not in test env and asset is missing', async () => {
    const originalEnv = process.env.NODE_ENV;
    // @ts-ignore
    process.env.NODE_ENV = 'production';
    
    await audioManager.playSound('tap');
    expect(createAudioPlayer).not.toHaveBeenCalled();
    
    // @ts-ignore
    process.env.NODE_ENV = originalEnv;
  });

  it('bounds volume between 0 and 1', () => {
    audioManager.setVolume(1.5);
    expect(audioManager.getVolume()).toBe(1.0);
    audioManager.setVolume(-0.5);
    expect(audioManager.getVolume()).toBe(0);
  });

  it('warns when asset is missing in test environment', async () => {
    // @ts-ignore
    const originalAsset = audioManager.assets.success;
    // @ts-ignore
    audioManager.assets.success = null;
    const spy = jest.spyOn(console, 'warn').mockImplementation();
    await audioManager.playSound('success');
    expect(spy).toHaveBeenCalledWith('Sound asset for success not found.');
    spy.mockRestore();
    // @ts-ignore
    audioManager.assets.success = originalAsset;
  });
});
