import React, { useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const BackButton = ({ replaceTo }) => {
  const navigation = useNavigation();

  const handleBack = () => {
    if (replaceTo) {
      navigation.replace(replaceTo);
    } else {
      navigation.goBack();
    }
    return true;
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBack
      );
      return () => backHandler.remove();
    }
  }, []);

  return (
    <TouchableOpacity style={styles.button} onPress={handleBack}>
      <Ionicons name="arrow-back" size={24} color="#000" style={styles.icon} />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    alignSelf: 'center',
  },
});
