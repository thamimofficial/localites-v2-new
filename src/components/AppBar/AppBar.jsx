import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import userLocation from '../UserLocation/userLocation';
import CartIcon from '../CoreComponent/CartIcon/CartIcon';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import StorageService from '../../services/StorageService/storageService';
import Images from '../../constants/Images';
import AlertBox from '../CoreComponent/AlertBox/AlertBox';

export default function AppBar() {
  const navigation = useNavigation();
  const location = userLocation();
  const [token, setToken] = useState(null);
  const [title, setTitle] = useState('');

  const [isModalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [alertMessage, setAlertMessage] = useState(""); // To store the alert message
  const [alertTitle, setAlertTitle] = useState(""); // To store the alert message

  useEffect(() => {
    if (location.code) {
      setTitle(location.code);
    }

    const loadStorage = async () => {
      const storedToken = await StorageService.getItem('sessionId');
      setToken(storedToken);
    };

    loadStorage();
  }, [location.code]);

  const handleCommunityChange = async () => {

    setAlertTitle("Alert")
    setAlertMessage("Do you want to switch to a different community?")
    setModalVisible(true)
  
  

  }
  const onConfirm = async () => {
    AsyncStorage.clear()
    navigation.replace('Location')
    }

  return (
    <View style={[styles.container, styles.parentFlex]}>
      <TouchableOpacity style={[styles.title, styles.parentFlex]} onPress={handleCommunityChange}>
        <Text style={styles.text}>{title}</Text>
        <Icon name="angle-down" size={20} color="black" />
      </TouchableOpacity>

      <View style={[styles.search, styles.parentFlexBox]}>
      {/* <TouchableOpacity >
               <Ionicons name="search" size={20} color="#000" />
         </TouchableOpacity> */}

        <TouchableOpacity onPress={()=>navigation.navigate('QRCodeScanner')}>
               <Ionicons name="scan-sharp" size={20} color="#000" />
         </TouchableOpacity>

        <View>
          {token ? (
            <CartIcon onPress={() => navigation.navigate('ReviewCart')} />
          ) : (
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
               <FontAwesome6 name="cart-shopping" size={20} color="#000" />
            </TouchableOpacity>
          )}
        </View>
      </View>
		
      <AlertBox
        visible={isModalVisible}
        onClose={() => setModalVisible(false)} // Only close when the user clicks "Okay"
        title={alertTitle}
        body={alertMessage} // Show OTP sent message
        buttonText="Ok"
        onConfirm={onConfirm}
        secondButtonText="Close"
        onSecondButton={()=>setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  parentFlex: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    width: '100%',
    height: 46,
  },
  title: {
    gap: 6,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Sora-Regular',
    color: '#1a1c21',
    textAlign: 'left',
  },
  search: {
    gap: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
