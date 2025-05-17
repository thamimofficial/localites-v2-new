import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Fonts from '../../../constants/Font';
import Colors from '../../../constants/Colors';

const PickupAddress = ({ stall }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pickup Location</Text>
      <View style={styles.addressContainer}>
        <Text style={styles.address}>{stall?.address}</Text>
      </View>
      {/* <Text style={styles.message}>{pickupDeliveryMsg}</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: Colors.orderPageBackground,
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    paddingBottom: 5,
  },
  addressContainer: {
    padding: 10,
    borderRadius: 5,
  },
  address: {
    fontSize: 14,
    fontFamily: Fonts.regular,
  },
  message: {
    fontSize: 11,
    marginTop: 5,
    color: '#666',
  },
});

export default PickupAddress;
