import AsyncStorage from '@react-native-async-storage/async-storage';

const StorageService = {
  // Save data
  setItem: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('AsyncStorage setItem error:', error);
    }
  },

  // Get data
  getItem: async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('AsyncStorage getItem error:', error);
      return null;
    }
  },

  // Remove data
  removeItem: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('AsyncStorage removeItem error:', error);
    }
  },

  // Clear all data
  clear: async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('AsyncStorage clear error:', error);
    }
  },

  // Get all keys
  getAllKeys: async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys;
    } catch (error) {
      console.error('AsyncStorage getAllKeys error:', error);
      return [];
    }
  }
};

export default StorageService;
