import { createMMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

const storage = createMMKV({
  id: 'game-storage',
});

/**
 * mmkvStorage implements Zustand's StateStorage interface using MMKV.
 * This provides high-performance, synchronous persistence.
 */
export const mmkvStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
    removeItem: (name) => {
      return storage.remove(name);
    },
  };
  