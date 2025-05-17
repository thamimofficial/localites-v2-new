// src/components/QRCodeScanner.js
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Camera, useCameraPermission, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import StorageService from '../../services/StorageService/storageService';
import { useNavigation } from '@react-navigation/native';

const QRCodeScanner = () => {
    const navigation = useNavigation()
    const [codeData,setCodeData] = useState()
    const [stallName, setStallName] = useState(null);

  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      codes.forEach(code => {
        console.log(`Scanned code: ${code.value} (type: ${code.type})`);
        setCodeData(code.value)

if(code.value){
    extractStallName(code.value)
}
        
      });
    }
  });


  const extractStallName = async (url) => {
    const code = await StorageService.getItem('communityId')
    if (!url || !url.includes('=')) return null;
    console.log(url.split('=')[1])
    const stallName = url.split('=')[1]
    if(code && stallName){
        navigation.replace("Stall", { code :code, slug: stallName })
    }
    return url.split('=')[1];
  };

  if (!hasPermission) {
    requestPermission();
    return null;
  }

  if (device == null) return null;

  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
      codeScanner={codeScanner}
    />
  );
};

export default QRCodeScanner;
