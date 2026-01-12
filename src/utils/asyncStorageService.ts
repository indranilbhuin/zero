import {createMMKV} from 'react-native-mmkv';

const storage = createMMKV({
  id: 'zero-app-storage',
});

const StorageService = {
  async setItem(key: string, value: string): Promise<void> {
    storage.set(key, value);
  },

  async getItem(key: string): Promise<string | null> {
    return storage.getString(key) ?? null;
  },

  async removeItem(key: string): Promise<void> {
    storage.remove(key);
  },

  async clear(): Promise<void> {
    storage.clearAll();
  },

  setItemSync(key: string, value: string): void {
    storage.set(key, value);
  },

  getItemSync(key: string): string | null {
    return storage.getString(key) ?? null;
  },

  removeItemSync(key: string): void {
    storage.remove(key);
  },

  clearSync(): void {
    storage.clearAll();
  },

  getBoolean(key: string): boolean {
    return storage.getBoolean(key) ?? false;
  },

  setBoolean(key: string, value: boolean): void {
    storage.set(key, value);
  },

  getNumber(key: string): number | null {
    return storage.getNumber(key) ?? null;
  },

  setNumber(key: string, value: number): void {
    storage.set(key, value);
  },

  contains(key: string): boolean {
    return storage.contains(key);
  },

  getAllKeys(): string[] {
    return storage.getAllKeys();
  },
};

export {storage};

export default StorageService;
