import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import BottomNavigation from '../../navigation/BottomNavigation';
import Colors from '../../constants/Colors';
import BackButton from '../../components/CoreComponent/BackButton/BackButton';
import Fonts from '../../constants/Font';  
import { useNavigation } from '@react-navigation/native';
import Images from '../../constants/Images';
import StorageService from '../../services/StorageService/storageService';
import { apiService } from '../../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';


const notifications = [

  {
      Id: 14622,
      message: "Your order #442 accepted!",
     
  },
  {
      Id: 14618,
      message: "Your order #433 has been cancelled!",
  }];

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);  
  const navigation = useNavigation();
 
  useEffect(()=>{
    getMyNotications()
  },[])

  const getMyNotications = async () => {
    const token = await StorageService.getItem('sessionId');
    const userId = await StorageService.getItem('userId');
    try {
      const response = await apiService.get(`/notification/user/${userId}`, token);
      console.log('getMyNotications:', response.data);
      setNotifications(response.data)
      return response.data;
    } catch (error) {
      console.error('Error getMyNotications:', error);
      throw error;
    }
  };

  const renderNotification = ({ item }) => {
    const parsedData = item?.notificationData ? JSON.parse(item.notificationData) : null;
  
    const renderButton = () => {
      if (!parsedData) return null;
  
      if (parsedData.bookingRequestId) {
        return null;
      }
  
      if (parsedData.orderId) {
        return (
          <TouchableOpacity onPress={() => navigation.navigate('OrderDetail', { id: parsedData.orderId })}>
            <Text style={styles.moreIcon}>Detail</Text>
          </TouchableOpacity>
        );
      }
  
      return null;
    };

    const formatDateTime = (dateString) => {
      if (!dateString) return '';
      const dateObj = new Date(dateString);
      
      const date = dateObj.toLocaleDateString('en-CA'); // e.g., 2025-01-09
      const time = dateObj.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }); // e.g., 03:07 AM
    
      return `${date} at ${time}`;
    };
    
  
    return (
      <View style={styles.notificationItem}>
        <View style={{ backgroundColor: 'lightgreen', borderRadius: 20, height: 24, width: 24, marginRight: 15 }}>
          <Image source={{ uri: Images.Notification }} style={styles.icon} />
        </View>
  
        <View style={styles.notificationText}>
          <Text style={styles.notificationTitle}>{item.message}</Text>
          <Text style={styles.notificationDescription}>
  {formatDateTime(item.notificationDate)}
</Text>

        </View>
  
        {renderButton()}
      </View>
    );
  };
  

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
                <BackButton replaceTo="Home" />
                <Text style={styles.label}> Notification</Text>
                <TouchableOpacity>
                    <Text style={styles.menuIcon}></Text>
                </TouchableOpacity>
               
            </View>
         

      {/* Notification List */}
      {notifications && 
      <FlatList
      data={notifications}
      keyExtractor={(item) => item.id}
      renderItem={renderNotification}
      contentContainerStyle={styles.notificationContent}
    />}
      

      {/* Bottom Navigation */}
      <BottomNavigation defaultTab="Notification" />
    </SafeAreaView>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
    paddingHorizontal: 24,
    paddingVertical: 11,
  },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    label: {
      fontSize: 18,
      fontFamily: Fonts.bold,
      color: Colors.Text,
    },
  date: {
    marginBottom: 10,
  },
  march: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.LightGrey,
    lineHeight:17
  },
  notificationContent: {
    paddingBottom: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.White,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    width: 24,
    height: 24,
    borderRadius: 20,
    backgroundColor: Colors.Background,
    marginRight: 15,
    
  },

  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: Colors.Text,
    marginBottom: 5,
    lineHeight: 26,

  },
  notificationDescription: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.LightGrey,
    lineHeight:20
  },
  moreIcon: {
    fontFamily:Fonts.bold,
    color: Colors.Text,
    height: 24,
    flex:1,
  },
});