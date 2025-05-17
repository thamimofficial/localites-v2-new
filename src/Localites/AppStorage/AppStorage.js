import AsyncStorage from '@react-native-async-storage/async-storage';

export const AppStorage = async () => {
  try {
    const imagePath = await AsyncStorage.getItem('imagePath');
    const token = await AsyncStorage.getItem('sessionId');

    const allKeys = await AsyncStorage.getAllKeys();
    console.log('All AsyncStorage Keys:', allKeys);

    // Return the values so they can be used wherever this is called
    return {
      token,
      imagePath,
    };
  } catch (error) {
    console.error('Error fetching AppStorage data:', error);
    return {
      token: null,
      imagePath: null,
    };
  }
};
