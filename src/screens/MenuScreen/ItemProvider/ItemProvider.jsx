import { View, Text,StyleSheet,TouchableOpacity,Image,Dimensions } from 'react-native'
import React from 'react'
import Fonts from '../../../constants/Font'
import Images from '../../../constants/Images'
import { useNavigation } from '@react-navigation/native'
import AntDesign from 'react-native-vector-icons/AntDesign';

const { width, height } = Dimensions.get('window'); // Dynamic screen size


export default function ItemProvider( {stallId}) {
      const navigation = useNavigation();

      const handleNavigation  = ((selectedType)=>{
        navigation.navigate('ProviderOrders',{stallId,
          type:selectedType}
        )
      })



  return (
              <View style={styles.orderCard}>
                <TouchableOpacity style={styles.orderItem} onPress={()=>handleNavigation('itemSale')}>
                <Image source={{uri:Images.item}} height={24} width={24}/>
                  <Text style={styles.orderText}>Item Orders</Text>
                                <AntDesign name='right' style={styles.arrowIcon} width={24} height={24} />
                  
                </TouchableOpacity>
                
          
                <TouchableOpacity style={styles.orderItem}  onPress={()=>handleNavigation('Bookings')}>
                <Image source={{uri:Images.booking}} height={24} width={24}/>
                  <Text style={styles.orderText}>Booking Lists</Text>
                  <AntDesign name='right' style={styles.arrowIcon} width={24} height={24} />
                  </TouchableOpacity>

              </View>
  )
}

const styles= StyleSheet.create({
    orderCard: {
        marginTop: 16,
      },
      orderItem: {
        backgroundColor: '#e4eed7',
        borderRadius: 10,
        padding: 14,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
      },
      orderText: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        color: '#333',
        fontFamily: Fonts.bold,

      },
      orderCount: {
        fontSize: 16,
        fontFamily: Fonts.bold,
        color: '#000',
      },
      arrowIcon: {
        fontSize: width * 0.05,
        color: '#000',
      },
})