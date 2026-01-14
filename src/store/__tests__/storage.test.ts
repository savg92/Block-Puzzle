import { mmkvStorage, storage } from '../storage';

// Mock MMKV
jest.mock('react-native-mmkv', () => {
  return {
    createMMKV: jest.fn().mockImplementation(() => {
      const mockStorage: Record<string, string> = {};
      return {
        set: (key: string, value: string) => {
          mockStorage[key] = value;
        },
        getString: (key: string) => mockStorage[key] || undefined,
        remove: (key: string) => {
          const existed = !!mockStorage[key];
          delete mockStorage[key];
          return existed;
        },
      };
    }),
  };
});

describe('storage module', () => {
  describe('mmkvStorage adapter', () => {
    it('should set and get items', () => {
      const data = { foo: 'bar' };
      mmkvStorage.setItem('test-key', JSON.stringify(data));
      
      const result = mmkvStorage.getItem('test-key');
      expect(result).toBe(JSON.stringify(data));
    });

    it('should return null for non-existent items', () => {
      expect(mmkvStorage.getItem('non-existent')).toBeNull();
    });

    it('should remove items', () => {
      mmkvStorage.setItem('delete-me', 'val');
      mmkvStorage.removeItem('delete-me');
      expect(mmkvStorage.getItem('delete-me')).toBeNull();
    });
  });

  describe('storage instance', () => {
    it('should be defined', () => {
      expect(storage).toBeDefined();
    });

    it('should allow setting and getting strings', () => {
      storage.set('test', 'value');
      expect(storage.getString('test')).toBe('value');
    });
  });
});