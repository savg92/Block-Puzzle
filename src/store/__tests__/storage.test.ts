import { appStorage } from '../storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('storage module', () => {
  describe('appStorage adapter', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should set and get items', async () => {
      const data = 'test-value';
      await appStorage.setItem('test-key', data);
      
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('test-key', data);
      
      // Mock the resolve value for the next call
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(data);
      const result = await appStorage.getItem('test-key');
      expect(result).toBe(data);
    });

    it('should return null for non-existent items', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      expect(await appStorage.getItem('non-existent')).toBeNull();
    });

    it('should remove items', async () => {
      await appStorage.removeItem('delete-me');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('delete-me');
    });
  });
});