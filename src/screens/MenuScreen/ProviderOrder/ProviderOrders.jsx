import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Fonts from '../../../constants/Font';
import Icon from 'react-native-vector-icons/Ionicons';
import ProviderItemOrder from '../../ProviderItemOrder/ProviderItemOrder';
import ProviderBookingOrder from '../../ProviderBookingOrder/ProviderBookingOrder';

const orders = [
  { id: 1, orderNo: 58, date: '05/04/2025', coupon: true, payment: 'Cash', value: 726, status: 'Delivered' },
  { id: 2, orderNo: 58, date: '05/04/2025', coupon: true, payment: 'Cash', value: 726, status: 'Placed' },
  { id: 3, orderNo: 58, date: '05/04/2025', coupon: true, payment: 'Cash', value: 726, status: 'Accepted' },
  { id: 4, orderNo: 58, date: '05/04/2025', coupon: true, payment: 'Cash', value: 726, status: 'Cancelled' },
];



const ProviderOrders = ({navigation,route}) => {

  const {stallId,type} = route.params;
  const [activeTab, setActiveTab] = useState(type || 'itemSale');
 

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={()=>navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Orders</Text>
        <View style={{ width: 40 }} />
      </View>


      <View style={styles.tabs}>
        <TouchableOpacity
          onPress={() => setActiveTab('itemSale')}
          style={[styles.tab, activeTab === 'itemSale' && styles.activeTab]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'itemSale' && styles.activeTabText,
            ]}
          >
            Item Orders
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          onPress={() => setActiveTab('Bookings')}
          style={[styles.tab, activeTab === 'Bookings' && styles.activeTab]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'Bookings' && styles.activeTabText,
            ]}
          >
            Bookings Lists
          </Text>
        </TouchableOpacity>
      </View>



      {activeTab === 'itemSale' ? <ProviderItemOrder stallId={stallId}/> :<ProviderBookingOrder stallId={stallId}/>}
    </View>
  );
};

export default ProviderOrders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backText: {
    fontSize: 20,
    color: '#333',
    fontFamily: Fonts.medium,
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.bold,
  },
  tabs: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#ffb347',
  },
  tabText: {
    fontSize: 14,
    color: '#555',
    fontFamily: Fonts.medium,
  },
  activeTabText: {
    color: '#fff',
    fontFamily: Fonts.bold,
  },
 
});
