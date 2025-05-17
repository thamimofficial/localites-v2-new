import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  Easing,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/Colors';

const { width, height } = Dimensions.get('window');

const ImagePopupModal = ({ visible, onClose,header = " " }) => {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.5,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          }}
        >
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close-circle" size={28} color="red" />
          </TouchableOpacity>
          <Image
            source={{
              uri: 'https://localitesstrg.blob.core.windows.net/localites-app-ctn/treasure-hunt/treasure-hunt-won-image.jpg',
            }}
            resizeMode="contain"
            style={styles.image}
          />
        </Animated.View>
      </View>
    </Modal>
  );
};

export default ImagePopupModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    zIndex: 1,
  },
  image: {
    width: width * 0.8,
    height: height * 0.45,
  },
});
