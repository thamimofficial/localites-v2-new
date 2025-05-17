import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, Dimensions } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import StorageService from '../../services/StorageService/storageService';
import { apiBase, apiService } from '../../services/api';
import Loader from '../Loader/Loader';
import BackButton from '../CoreComponent/BackButton/BackButton';
import Images from '../../constants/Images';
import axios from 'axios';
import Fonts from '../../constants/Font';
import Colors from '../../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

const{width,height} = Dimensions.get('window')

export default function Profile() {
  let userObj = {
    id: 0,
    firstName: "",
    mobile: "",
    email: "",
    profileImagePath: "null",
    isMobileVerified: false,
    isEmailVerified: false,
    enableMobileVerification: 0,
  };

  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(userObj);
  const [loading, setLoading] = useState(false);
  const[uploading,setUploading] = useState(false);

  const handleInputChange = (name, value) => {
    setUserInfo({ ...userInfo, [name]: value });
  };

  const getUserProfile = async () => {
    const token = await StorageService.getItem('sessionId');
    const userId = await StorageService.getItem('userId');

    const options = {
      mediaType: 'photo',
      quality: 0.7,
      maxWidth: 800,
      maxHeight: 800,
    };
  
    try {
      setLoading(true);
      const response = await apiService.get(`/user/profile/${userId}`, token);
      setUserInfo(response.data);
    } catch (error) {
      console.log("Error fetching profile:", error);
    }
    finally{
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    const token = await StorageService.getItem('sessionId');
    setLoading(true);
    try {
      await apiService.put('/user/name', { firstName: userInfo.firstName }, token);
      await apiService.put('/user/updatemobile', { mobile: userInfo.mobile }, token);
      await apiService.put('/user/updateemail', { email: userInfo.email }, token);
      getUserProfile();
      navigation.navigate('Account');
    } catch (error) {
      console.log("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleImageUpload = async () => {
    const token = await StorageService.getItem('sessionId');
    const userId = await StorageService.getItem('userId');
  
    const options = {
      mediaType: 'photo',
      quality: 0.7,
      maxWidth: 800,
      maxHeight: 800,
    };
  
    launchImageLibrary(options, async (response) => {
      if (response.didCancel || response.errorCode || !response.assets || response.assets.length === 0) {
        console.log('Image selection cancelled or failed');
        return;
      }
  
      const selectedImage = response.assets[0];
      const formData = new FormData();
      formData.append('file', {
        uri: selectedImage.uri,
        name: selectedImage.fileName || 'photo.jpg',
        type: selectedImage.type || 'image/jpeg',
      });
      formData.append('id', userId);
  
      try {
        setUploading(true); // Start uploading
        const result = await axios.post(
          'https://api.localites.in/api/user/savefileimage',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
  
        console.log('✅ Upload success:', result.data);
        await getUserProfile(); // Refresh user image after upload
        // Alert.alert('Success', 'Profile image updated.');
      } catch (error) {
        console.log('❌ Upload error:', error);
        Alert.alert('Error', 'Failed to upload image.');
      } finally {
        setUploading(false); // End uploading
      }
    });
  };
  


  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton replaceTo='Account' />
        <Text style={styles.label}>Edit Profile</Text>
        <TouchableOpacity onPress={updateProfile} disabled={loading}>
          {loading ? <Loader loading={true} /> : <Text style={styles.save}>Save</Text>}
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
      <TouchableOpacity onPress={handleImageUpload} disabled={uploading}>
  {uploading ? (
    <View style={styles.uploadingContainer}>
    <Text style={styles.uploadingText}>Uploading Image...</Text>
  </View>
) : userInfo.profileImagePath ? (
    <Image style={styles.userImg} source={{ uri: `${apiBase.imagePath}${userInfo.profileImagePath}` }} />
  ) : (
    <Image style={styles.userImg} source={{ uri: Images.userImg }} />
  )}
  {!uploading && (
    <AntDesign style={styles.editIcon} name="camera" size={22} color="#fff" />
  )}
</TouchableOpacity>

      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={userInfo.firstName}
          onChangeText={(text) => handleInputChange('firstName', text)}
          placeholder="Enter your name"
          placeholderTextColor="#ccc"
        />
        <AntDesign name="edit" style={styles.arrowIcon} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.prefix}>+91</Text>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={userInfo.mobile}
          keyboardType="numeric"
          onChangeText={(text) => handleInputChange('mobile', text)}
        />
        <AntDesign name="edit" style={styles.arrowIcon} />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={userInfo.email}
          keyboardType="email-address"
          onChangeText={(text) => handleInputChange("email", text)}
        />
        {userInfo.isEmailVerified ? (
          <Text style={styles.verified}>Verified</Text>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate('EmailVerify', { Email: userInfo.email })}>
            <Text style={styles.notVerify}>Verify Email</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 18,
   fontFamily:Fonts.bold,
    color: "#2e323a",
  },
  save: {
    fontSize: 16,
    color: "#FF7F50",
     fontFamily:Fonts.semiBold
  },
  imageContainer: {
    alignSelf: "center",
    position: "relative",
    marginVertical: 20,
  },
  userImg: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: (width * 0.3) / 2,
    borderWidth: 3,
    borderColor: "#fff",
  },
  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#000",
    padding: 5,
    borderRadius: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#2e323a",
  },
  prefix: {
    fontSize: 16,
 fontFamily:Fonts.medium,
    marginRight: 8,
  },
  verified: {
    fontSize: 14,
    color: "green",
  fontFamily:Fonts.medium,
    marginLeft: 8,
  },
  notVerify: {
    fontSize: width * 0.035,
    fontFamily:Fonts.medium,
    color: 'red',
    textDecorationLine:'underline'
  },
  arrowIcon: {
    fontSize: width * 0.05,
    color: '#000',
  },
  uploadingContainer: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: (width * 0.3) / 2,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ccc',
  },
  uploadingText: {
    fontSize: 14,
    color: Colors.primary,
    textAlign: 'center',
    fontFamily:Fonts.regular
  },
});
