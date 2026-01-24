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

  it('bounds volume between 0 and 1', () => {
    audioManager.setVolume(1.5);
    expect(audioManager.getVolume()).toBe(1.0);
    audioManager.setVolume(-0.5);
    expect(audioManager.getVolume()).toBe(0);
  });
});
