import React, { useEffect, useState } from 'react';
import { 
  View, Text, Image, TouchableOpacity, StyleSheet, Alert 
} from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api';
import StorageService from '../services/StorageService/storageService';
import Images from '../constants/Images';
import userLocation from '../components/UserLocation/userLocation';
import { DateFormat } from '../components/CoreComponent/GlobalServices/DateFormat';
import Fonts from '../constants/Font';

const Login = ({ navigation }) => {
 
 
const [communityId, setCommunityId] = useState()

const [googleData, setGoogleDate] = useState()

//webClientId: '676812149305-j4k3f1qahnd2m4ebjho0d04jhemr5ha7.apps.googleusercontent.com', // Replace with your Web Client ID
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '4941661864115-rn9hjldu30r4nnd3pk6k5ft7j5hsl7rd.apps.googleusercontent.com', // Replace with your Web Client ID
	    iosClientId: "941661864115-h81um2o01m2boco9poll1lhqsmb36eee.apps.googleusercontent.com",
      offlineAccess: true,
      offlineAccess: true,
      forceCodeForRefreshToken: true, // Required for refresh tokens
    });

    const communityIdfech = async () =>{

      const communityId = await StorageService.getItem('communityId');
      console.log('community id from login', communityId)
      setCommunityId(communityId)
    }
    communityIdfech()
  }, []);




  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut(); // Ensure a fresh login
      const userInfo = await GoogleSignin.signIn();
      

      // console.log('User Info:', userInfo);
      // console.log('User Info:', userInfo.data);
      if (userInfo.data) {
        // console.log('User Info:', userInfo.data.user);
        const userbygamil = userInfo.data.user
        onGoogleLoginSuccess(userbygamil);
        setGoogleDate(userbygamil)
      } else {
       // console.log('User Info data is null');
      }


      // createUser(userInfo.user);
      // Navigate to next screen if needed
      // navigation.navigate('Home', { user: userInfo.user });

    } catch (error) {
      console.log('Google Sign-In Error:', error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Sign-in Cancelled', 'You cancelled the login.');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Sign-in In Progress', 'Please wait...');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Google Play Services Not Available');
      } else {
        Alert.alert('Error', error.message);
      }
    }
  };

 const onGoogleLoginSuccess = async (userbygamil) => {
  const inputData ={
    email: userbygamil.email,
    communityId:communityId,
    displayName: userbygamil.name,
    userId: userbygamil.id,
    externalProvider: "google",
    externalData: {
      email: userbygamil.email,
    userId: userbygamil.id,
      displayName: userbygamil.name,
    },
    currentDate: DateFormat.getCurrentDate()
  }
    try {
      const response = await apiService.post(`/security/registerconsumerforportal`,
        inputData);

      console.log('Google Address:', response.data);
      // console.log('imagStorageUrls:', response.data.config.imagStorageUrl);
      // console.log('sessionID:', response.data.authToken.sessionId);
      if (response.status == 200) {
        if (response.data.authToken.communityId == communityId) {
         console.log('User:', response.data);
          
        //  console.log(communityId, 'Community ID:', response.data.authToken.communityId);
          const user = JSON.stringify(response.data);
          

            await StorageService.setItem('user', user);
            await StorageService.setItem('imagStorageUrl', response.data.config.imagStorageUrl);
            await StorageService.setItem('sessionId', response.data.authToken.sessionId);
            await StorageService.setItem('userId', response.data.authToken.userId.toString()); 
                   
           
            navigation.replace('Home');

      
        } else {
          Alert.alert('Alert',  response.data.authToken.communityMessage);

          AsyncStorage.clear();
          const locationData = {
            communityId:response.data.authToken.communityId,
            code : response.data.authToken.communityCode
          }
     await StorageService.setItem("userLocation",locationData);
     await StorageService.setItem("communityId",response.data.authToken.communityId);
     await StorageService.setItem("code",response.data.authToken.communityCode);
     navigation.replace('Home')



          
        }
      }
    
    } catch (error) {
      console.error('Error fetching default address:', error);
    } finally {
    // console.log('Default Address:');
    }
  };




  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log in within seconds</Text>
      <Text style={styles.subtitle}>
      Use your email, mobile number, or Google account to continue with Localites (it's free)!
      </Text>

      <Image 
        source={
          typeof Images?.siginIn === 'string'
            ? { uri: Images.siginIn }
            : Images?.siginIn
        }
      style={styles.image} />
    
      <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('GmailOtpScreen')}>
        <Text style={styles.primaryButtonText}>Continue with Mobile or Email</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>Or</Text>

      <TouchableOpacity style={styles.socialButton} onPress={signInWithGoogle}>
        <Text style={styles.socialButtonText}>Sign in with Google</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity style={styles.socialButton}>
        <Text style={styles.socialButtonText}>Sign in with Apple</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
       fontFamily:Fonts.bold,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
       fontFamily:Fonts.bold,
  },
  image: {
    width: 250,
    height: 180,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: 'orange',
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
       fontFamily:Fonts.bold,
    paddingVertical: 16
  },
  orText: {
    fontSize: 14,
    color: '#777',
    marginVertical: 10,
  },
  socialButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  socialButtonText: {
    fontSize: 16,
       fontFamily:Fonts.regular,
    alignItems: 'center',
    paddingVertical: 16
  },

});

export default Login;
