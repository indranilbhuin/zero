import AsyncStorage from '@react-native-async-storage/async-storage';

const AsyncStorageService = {
  async setItem(key: string, value: string) {
    try {
      await AsyncStorage?.setItem(key, value);
    } catch (error) {
      console.error('AsyncStorage setItem error:', error);
      throw error;
    }
  },

  async getItem(key: string) {
    try {
      const value = await AsyncStorage?.getItem(key);
      return value ?? null;
    } catch (error) {
      console.error('AsyncStorage getItem error:', error);
      throw error;
    }
  },

  async removeItem(key: string) {
    try {
      await AsyncStorage?.removeItem(key);
    } catch (error) {
      console.error('AsyncStorage removeItem error:', error);
      throw error;
    }
  },

  async clear() {
    try {
      await AsyncStorage?.clear();
    } catch (error) {
      console.error('AsyncStorage clear error:', error);
      throw error;
    }
  },
};

export default AsyncStorageService;
