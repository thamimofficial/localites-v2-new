import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Image,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Fonts from '../../constants/Font';
import BottomNavigation from '../../navigation/BottomNavigation';
import Colors from '../../constants/Colors';
import Images from '../../constants/Images';
import BackButton from '../../components/CoreComponent/BackButton/BackButton';
import userLocation from '../../components/UserLocation/userLocation';
import StorageService from '../../services/StorageService/storageService';
import { apiService } from '../../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';

const MenuScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const[stallList,setStallList] = useState([]);
  const[checkToken,setCheckToken] = useState()

  const Location = userLocation();
  const communityId = Location.communityId;
  const getStallWithStatus = async () => {
    try {
        const token = await StorageService.getItem('sessionId');
        const userId = await StorageService.getItem("userId");
        const inputData = {
            lookups: {
                ProviderStalls: { default: false }
            },
            filters: {
                userId,
                communityId
            }
        };

        const response = await apiService.post('/options/lookup', inputData, token);
        const result = response.data.ProviderStalls || []; // Ensure ProviderStalls is an array
        setStallList(result); // Set the stall list
        console.log("stall list",result);
    } catch (error) {
        console.log("Error fetching stall list:", error);
    } 
};

useEffect(()=>{
      const communityIdfech = async () =>{
  
        const token = await StorageService.getItem('sessionId');
        console.log('community id from login', communityId)
        setCheckToken(token)
      }
      communityIdfech()

  getStallWithStatus();
},[communityId])

  const handleLogoutPress = () => {
    setModalVisible(true);
  };

 const handleLogoutConfirm = async () => {
   // await AsyncStorage.clear();
            await StorageService.removeItem('user');
            await StorageService.removeItem('imagStorageUrl');
            await StorageService.removeItem('sessionId');
            await StorageService.removeItem('userId'); 
    setModalVisible(false);
    navigation.replace('Home'); // replace with your login/start screen
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton replaceTo='Home'/>
        <Text style={styles.headerTitle}>Menu</Text>
      </View>

      {/* Menu Items */}
      <ScrollView contentContainerStyle={styles.content}>
        {
          stallList.length>0 && 
          <TouchableOpacity
          style={styles.rectangleView}
          onPress={() => {
            navigation.navigate('ProviderDashboard');
          }}>
          <Text style={{ fontFamily: Fonts.bold, fontSize: 16, color: Colors.WhiteText }}>
            Merchant Dashboard
          </Text>
        </TouchableOpacity>
        }
      

        {/* <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('DirectMessage')}>
          <View style={styles.itemContent}>
            <Icon name="chatbubble-ellipses-outline" size={20} color="#333" style={styles.itemIcon} />
            <Text style={styles.itemLabel}>Message</Text>
          </View>
          <Icon name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.item} onPress={() => {navigation.navigate('HelpSupport')}}>
          <View style={styles.itemContent}>
            <Icon name="help-circle-outline" size={20} color="#333" style={styles.itemIcon} />
            <Text style={styles.itemLabel}>Help & Support</Text>
          </View>
          <Icon name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}  onPress={() => Linking.openURL("https://www.localites.in/privacy")}>
          <View style={styles.itemContent}>
            <Icon name="shield-checkmark-outline" size={20} color="#333" style={styles.itemIcon} />
            <Text style={styles.itemLabel}>Privacy Policy</Text>
          </View>
          <Icon name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.item} onPress={() => {}}>
          <View style={styles.itemContent}>
            <Icon name="person-outline" size={20} color="#333" style={styles.itemIcon} />
            <Text style={styles.itemLabel}>Contact Us</Text>
          </View>
          <Icon name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.item} onPress={() => Linking.openURL("https://play.google.com/store/apps/details?id=app.localites")}>
          <View style={styles.itemContent}>
            <Icon name="star-outline" size={20} color="#333" style={styles.itemIcon} />
            <Text style={styles.itemLabel}>Rate the App</Text>
          </View>
          <Icon name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        {/* Logout */}
        {checkToken && 
                <TouchableOpacity style={styles.logoutItem} onPress={handleLogoutPress}>
                <View style={styles.itemContent}>
                  <Icon name="log-out-outline" size={20} color="#ff3b30" style={styles.itemIcon} />
                  <Text style={[styles.itemLabel, { color: '#ff3b30' }]}>Logout</Text>
                </View>
              </TouchableOpacity>
        }

      </ScrollView>
      
<View style={{ alignItems: 'center', marginBottom: 100 }}>
  <Text style={{ color: Colors.Grey, fontFamily: Fonts.regular, fontSize: 13 }}>
    V 2.0.2
  </Text>
</View>

      {/* Bottom Navigation */}
      <BottomNavigation defaultTab="Menu" />

      {/* Logout Confirmation Modal */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Image
                     source={
                      typeof Images?.deleteCatImage === 'string'
                        ? { uri: Images.deleteCatImage }
                        : Images?.deleteCatImage
                    } // Replace with your image path
              style={styles.catImage}
              resizeMode="contain"
            />
            <Text style={styles.modalText}>Are you sure you want to Logout?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutConfirm}>
                <Text style={styles.logoutText}>Yes, Logout!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    marginLeft: 10,
  },
  content: {
    paddingBottom: 40,
  },
  item: {
    backgroundColor: '#f1f7f9',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    marginRight: 10,
  },
  itemLabel: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#333',
  },
  logoutItem: {
    backgroundColor: '#f1f7f9',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rectangleView: {
    borderRadius: 10,
    backgroundColor: '#8ec73d',
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    height: 87,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    height: '30%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  catImage: {
    height: 80,
    width: 80,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 17,
    fontFamily: Fonts.bold,
    color: '#333',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    borderColor: '#f9a825',
    borderWidth: 1.5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  cancelText: {
    color: '#333',
    fontFamily: Fonts.medium,
  },
  logoutButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  logoutText: {
    color: '#fff',
    fontFamily: Fonts.medium,
  },
});
