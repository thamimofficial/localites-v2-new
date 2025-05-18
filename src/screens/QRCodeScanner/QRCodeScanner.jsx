// src/components/QRCodeScanner.js
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Camera, useCameraPermission, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import StorageService from '../../services/StorageService/storageService';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const FRAME_SIZE = width * 0.6;

const QRCodeScanner = () => {
  const navigation = useNavigation();
  const [codeData, setCodeData] = useState();

  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      codes.forEach(code => {
        console.log(`Scanned code: ${code.value} (type: ${code.type})`);
        setCodeData(code.value);
        if (code.value) {
          extractStallName(code.value);
        }
      });
    }
  });

  const extractStallName = async (url) => {
    const code = await StorageService.getItem('communityId');
    if (!url || !url.includes('=')) return null;
    const stallName = url.split('=')[1];
    if (code && stallName) {
      navigation.replace("Stall", { code: code, slug: stallName });
    }
    return stallName;
  };

  if (!hasPermission) {
    requestPermission();
    return null;
  }

  if (device == null) return null;

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
      />

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      {/* QR Frame Overlay */}
      <View style={styles.qrFrameContainer}>
        <View style={styles.qrFrame} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 8,
    zIndex: 100,
  },
  qrFrameContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrFrame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    borderWidth: 2,
    borderColor: '#00FF00',
    borderRadius: 12,
  },
});

export default QRCodeScanner;
