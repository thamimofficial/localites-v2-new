import { View, Text,StyleSheet,Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import Images from '../../../constants/Images'
import Fonts from '../../../constants/Font'
import { apiService } from '../../../services/api'
import userLocation from '../../../components/UserLocation/userLocation'
import StorageService from '../../../services/StorageService/storageService'
export default function Income({stallId}) {
    console.log("stall", stallId)

    const Location = userLocation();
    const communityId = Location.communityId;
    const[accountCredits,setAccountCredits]=  useState(0);
    const[totalIncome,seTotalIncome] = useState(0);

    const getDashboard= async()=>{
        const token = await StorageService.getItem('sessionId');
        try {
            let inputData = {
                ds: {
                  resultset: [
                    { key: "subscriptionDetails", type: "single" },
                    { key: "accountCredits", type: "single" },
                    { key: "localBusinessDirectory", type: "single" },
                    { key: "liveShopping", type: "single" },
                    { key: "totalIncome", type: "single" },
                    { key: "openOrders", type: "single" },
                    { key: "shippedOrders", type: "single" },
                    { key: "bookingCount", type: "single" },
                    { key: "pendingSaleOrders", type: "single" },
                    { key: "shippedSaleOrders", type: "single" }
                  ]
                },
                data: {
                  stallId: stallId,
                  communityId: communityId
                }
              };
          
              const response = await apiService.post(`/general/dbo/getproviderdashboarddetails`,inputData,token);
              const result = response.data;
              setAccountCredits(result.accountCredits);
              seTotalIncome(result.totalIncome);
              console.log("setAccountCredits",result.accountCredits,result.totalIncome)
        } catch (error) {
            console.log("error",error)
        }
        
    }

    useEffect(()=>{
        getDashboard();
    },[stallId])
  return (
    <View style={styles.rowBox}>
    <View style={styles.statCard}>
    <Image source={{uri:Images.money}} height={24} width={24}/>
      <Text style={styles.statTitle}>Total Income (for the month)</Text>
      <Text style={styles.statValue}>₹{totalIncome.totalAmount}</Text>
    </View>
    <View style={styles.statCard}>
    <Image source={{uri:Images.walletcredit}} height={24} width={24}/>
      <Text style={styles.statTitle}>Wallet Credits</Text>
      <Text style={styles.statValue}>₹{accountCredits.currentBalance}</Text>

    </View>
  </View>
  )
}

const styles = StyleSheet.create({
    rowBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 14,
      },
      statCard: {
        backgroundColor: '#e4eed7',
        borderRadius: 10,
        padding: 16,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'flex-start',
        justifyContent: 'center',
      },
      statTitle: {
        marginTop: 6,
        fontSize: 12,
        color: '#333',
        fontFamily: Fonts.regular
      },
      statValue: {
        marginTop: 8,
        fontSize: 18,
        fontFamily: Fonts.bold,
        color: '#000',
      },
})