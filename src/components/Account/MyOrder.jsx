import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import BackButton from '../CoreComponent/BackButton/BackButton'
import Colors from '../../constants/Colors'
import Fonts from '../../constants/Font'
import ItemSaleOrder from './ItemSaleOrder'
import BookingSaleOrder from './BookingSaleOrder'
import StorageService from '../../services/StorageService/storageService'
import { apiService } from '../../services/api'
import { SafeAreaView } from 'react-native-safe-area-context'

const { height, width } = Dimensions.get('window')



export default function MyOrder() {
  const [activeTab,setActiveTab] = useState('itemSale');
  const[userInfo,setUserInfo] = useState();

  

  const getUserProfile = async ()=>{
    try {
      const userId = await StorageService.getItem("userId");
      const token = await StorageService.getItem('sessionId');
      const response = await apiService.get(`/user/profile/${userId}`,token);
      const result = response.data;
      setUserInfo(result);
    } catch (error) {
      console.log("userinfo getting error",error)
    }
  
  }
  useEffect(()=>{
    getUserProfile();
  },[])
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <BackButton />
                <Text style={styles.label}> My order</Text>
                <TouchableOpacity>
                    <Text style={styles.menuIcon}>:</Text>
                </TouchableOpacity>
               
            </View>
         
            <View style={styles.segmentedControl}>
      			<TouchableOpacity onPress={()=>setActiveTab('itemSale')} style={[styles.tabWrapper, activeTab === 'itemSale' && styles.activeTab]} >
                <Text style={[styles.tabText, activeTab === 'itemSale' && styles.activeTabText]}>
                    Items
                </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>setActiveTab('Bookings')} style={[styles.tabWrapper, activeTab === 'Bookings' && styles.activeTab]} >
                <Text style={[styles.tabText, activeTab === 'Bookings' && styles.activeTabText]}>
                    Bookings
                </Text>
                </TouchableOpacity>
                </View>
                {
                  userInfo &&
                  <View style={{flex:1}}>
                  {
                      activeTab === 'itemSale'?<ItemSaleOrder  userId={userInfo.id} /> :<BookingSaleOrder userId={userInfo.id}/>
                  }
              </View>
                }
             
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.Background,
      paddingHorizontal: 24,
      paddingVertical: 21,
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
    menuIcon: {
      fontSize: 20,
      color: Colors.Text,
    },
    segmentedControl: {
      flexDirection: 'row',
      backgroundColor: Colors.TextInputBackground,
      borderRadius: 8,
      padding: 4,
      marginBottom: 20,
    },
    tabWrapper: {
      flex: 1,
      paddingVertical: 10,
      alignItems: 'center',
      borderRadius: 4,
    },
    activeTab: {
      backgroundColor: Colors.Background,
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    tabText: {
      fontSize: 15,
      fontFamily: Fonts.medium,
      color: '#898f98',
      textAlign: 'center',
      lineHeight: 20,
      letterSpacing: -0.1,
    },
    activeTabText: {
      fontFamily: Fonts.semiBold,
      color: '#484d57',
    },
  });






























































