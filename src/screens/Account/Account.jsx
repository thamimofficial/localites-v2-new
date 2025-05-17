import { StyleSheet, Text, View, Image, Dimensions, ScrollView, TouchableOpacity, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import BackButton from '../../components/CoreComponent/BackButton/BackButton';

import BottomNavigation from '../../navigation/BottomNavigation';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo'
import { useNavigation } from '@react-navigation/native';
import { apiBase, apiService } from '../../services/api';
import StorageService from '../../services/StorageService/storageService';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Font';
import Images from '../../constants/Images';
import Loader from '../../components/Loader/Loader';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window'); // Dynamic screen size



const Account = () => {
  
  const navigation = useNavigation();
 
  const useraObj = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    profileImagePath: '',
    isEmailVerified: false,
    enableEmailVerification: false,
  };

  const [userInfo, setUserInfo] = useState(useraObj);
  const[showDeleteModal,setShowDeleteModal] = useState(false);
  const[loading,setLoading]=useState(false);

  const getUserProfile = async () => {
    try {
      setLoading(true)
      const userId = await StorageService.getItem('userId');

      const token = await StorageService.getItem('sessionId');
      const response = await apiService.get(`/user/profile/${userId}`, token);


      const result = response.data;
      setUserInfo(result)
    } catch (error) {
      console.log("error", error)
    }
    finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    getUserProfile();
  }, [])


  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading && <Loader visible={loading}/>}
      <View style={styles.container}>
        <BackButton replaceTo='Home' />
        <ScrollView>
          <View style={styles.profileCard}>
            {
              userInfo.profileImagePath ? (
                <Image style={styles.avatar} resizeMode="cover" source={{ uri: `${apiBase.imagePath}${userInfo.profileImagePath}` }} />

              ) : (
                <Image style={styles.avatar} resizeMode="cover" source={{uri:Images.userImg}} />

              )
            }
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{userInfo.firstName}</Text>
              <Text style={styles.email}>{userInfo.email}</Text>
              <View style={styles.verifiedContainer}>
                {userInfo.isEmailVerified ? (
                  <>
                    <Image source={{uri:Images.Verify}} style={styles.verifyIcon} />
                    <Text style={styles.verifiedText}>Verified</Text>
                  </>
                ) : (
                  <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <Text style={styles.notVerify}>Verify Email</Text>
                  </TouchableOpacity>
                )}
              </View>

            </View>
          </View>

          <Text style={styles.sectionTitle}>Personal</Text>
          <View style={{ gap: 12 }}>
            <TouchableOpacity style={[styles.option, styles.optionFlexBox]} onPress={() => navigation.navigate('Profile')}
            >
              <AntDesign style={styles.icon} name="user" width={24} height={24} />
              <Text style={[styles.optionName, styles.optionFlexBox]} numberOfLines={1}>My Account</Text>
              <AntDesign name='right' style={styles.arrowIcon} width={24} height={24} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.option, styles.optionFlexBox]} onPress={() => navigation.navigate('MyOrder', { userId:userInfo.id })} >
              <AntDesign style={styles.icon} name="shoppingcart" width={24} height={24} />
              <Text style={[styles.optionName, styles.optionFlexBox]} numberOfLines={1}>My Order</Text>
              <AntDesign name='right' style={styles.arrowIcon} width={24} height={24} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.option, styles.optionFlexBox]} onPress={() => navigation.navigate('Address', { userId:userInfo.id })}>
              <AntDesign style={styles.icon} name="enviromento" />
              <Text style={[styles.optionName, styles.optionFlexBox]} numberOfLines={1}>Addresses</Text>
              <AntDesign name='right' style={styles.arrowIcon} width={24} height={24} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.option, styles.optionFlexBox]} onPress={()=>navigation.navigate('JourneyTracker')} >
              <Entypo style={[styles.icon]} name="bar-graph"  />
              <Text style={[styles.optionName, styles.optionFlexBox]} numberOfLines={1}>Journey Tracker</Text>
              <AntDesign name='right' style={styles.arrowIcon} width={24} height={24} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.option, styles.optionFlexBox]} onPress={()=>navigation.navigate('JourneyTracker')} >
              <Entypo style={styles.icon} name="share" width={24} height={24} />
              <Text style={[styles.optionName, styles.optionFlexBox]} numberOfLines={1}>Invite Friends</Text>
              <AntDesign name='right' style={styles.arrowIcon} width={24} height={24} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.option, styles.optionFlexBox]} onPress={ ()=> setShowDeleteModal(true)} >
              {/* <AntDesign style={styles.icon} name="delete" width={24} height={24} /> */}
              <Image source={{uri:Images.DeleteAccountIcon}} width={24} height={24} ></Image>

              <View style={{ flex: 1}}>
                <Text style={styles.delete}>Delete Account</Text>
                <Text style={styles.deleteDescription}>
                  Permanently remove your account and data from Localites. Proceed with caution.
                </Text>
              </View>

              <AntDesign name="right" style={styles.arrowIcon} size={24} />
            </TouchableOpacity>

          </View>


        </ScrollView>

      </View>
      <BottomNavigation defaultTab="Account" />
      {/* Delete Account Modal */}
      <Modal
  transparent={true}
  visible={showDeleteModal}
  animationType="fade"
  onRequestClose={() => setShowDeleteModal(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.groupParent}>
      <Image source={{uri:Images.deleteCatImage}} style={styles.frameChild} width={122} height={244} />

      <View style={styles.areYouSureYouWantToDeletParent}>
        <Text style={[styles.areYouSure, styles.youTypo]}>
          Are you sure you want to delete your file?
        </Text>
        <Text style={[styles.youWillNot, styles.youTypo]}>
          You will not be able to recover them afterwards.
        </Text>
      </View>

      <View style={styles.buttonParent}>
        <TouchableOpacity
          style={[styles.button, styles.buttonFlexBox]}
          onPress={() => setShowDeleteModal(false)}
        >
          <Text style={[styles.button1, styles.buttonTypo]}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button2, styles.buttonFlexBox]}
          onPress={() => {
            setShowDeleteModal(false);
            navigation.replace('Intro'); // ← your logic here
          }}
        >
          <Text style={[styles.button3, styles.buttonTypo]}>Yes, Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
   
    </SafeAreaView>

  );
};





export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: width * 0.05,
  
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.Background,
    padding: width * 0.05,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  avatar: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: (width * 0.2) / 2,
  },
  infoContainer: {
    marginLeft: width * 0.04,
    flex: 1,
  },
  name: {
    fontSize: width * 0.05,
    color: Colors.Black,
    fontFamily:Fonts.semiBold
  },
  email: {
    fontSize: width * 0.04,
    color: Colors.Black,
    fontFamily:Fonts.regular
  },
  verifiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#c8e6c9',
    alignSelf: 'flex-start',
  },
  verifyIcon: {
    width: width * 0.04,
    height: width * 0.04,
    marginRight: 4,
  },
  verifiedText: {
    fontSize: width * 0.035,
    color: '#2e7d32',
    fontFamily:Fonts.regular

  },
  notVerify: {
    fontSize: width * 0.035,
 fontFamily:Fonts.medium,
    color: 'red',
  },
  sectionTitle: {
    marginVertical: width * 0.03,
    fontSize: 16,
    lineHeight: 22,
    fontFamily:Fonts.regular,
    color: Colors.Black
  },

  optionFlexBox: {
    overflow: "hidden",
    flex: 1,

  
  },
  icon: {
    fontSize: width * 0.06,
    color: Colors.Black,
    marginRight: width * 0.04,
    backgroundColor: 'transparent'
  },
  optionName: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily:Fonts.regular,
    color: Colors.Black,
    textAlign: "left"
  },
  delete: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily:Fonts.regular,
    color: "red",
    textAlign: "left",
  },
  subText: {
    fontSize: 12,
    color: Colors.LightGrey,
    marginTop: 2,
    flexWrap: 'wrap',
    lineHeight:16

  },
  option: {
    borderRadius: 8,
    backgroundColor: Colors.TextInputBackground,
    width: "100%",
    // height: 48,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
   
  },
  arrowIcon: {
    fontSize: width * 0.05,
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  
  groupParent: {
    width: '100%',
    backgroundColor: Colors.Background,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 24,
  },
  
  frameChild: {
    width: 122,
    height: 244,
    resizeMode: 'contain',
  },
  
  areYouSureYouWantToDeletParent: {
    gap: 10,
    alignSelf: 'stretch',
  },
  
  areYouSure: {
    fontSize: 20,
    color: Colors.Text,
    lineHeight: 24,
  },
  
  youWillNot: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.LightGrey,
  },
  
  youTypo: {
    textAlign: 'center',
    fontFamily: Fonts.medium,
  },
  
  buttonParent: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    alignSelf: 'stretch',
  },
  
  buttonFlexBox: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  
  button: {
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: '#fff',
  },
  
  button1: {
    color: Colors.Text,
  },
  
  button2: {
    backgroundColor: Colors.Black,
  },
  
  button3: {
    color: Colors.WhiteText,
  },
  
  buttonTypo: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  
});
