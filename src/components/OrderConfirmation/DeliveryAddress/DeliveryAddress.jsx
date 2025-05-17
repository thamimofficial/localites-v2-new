import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Fonts from '../../../constants/Font';
import Colors from '../../../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DeliveryAddress = ({ address, openAddressDialog, openAddressForm }) => {

  console.log("adreseaws",address);
  const navigation = useNavigation();
  const navigateToAddress = () => {
    navigation.navigate('AddressEdit', {
      addressId: null,
      typeId: null,
      isdefault: true,

    });
  };
  return (
    <View style={styles.container}>  
      {/* <View style={styles.row}>
      
        <TouchableOpacity onPress={openAddressDialog}>
          <Text style={styles.selectText}>📍 Select your address</Text>
        </TouchableOpacity>
      </View> */}
<Text style={styles.title}>Delivery Address</Text>
      <View style={styles.addressContainer}>
        {address?.id ? (
          <Text style={styles.addressText}>
            {address?.displayName}, {"\n"}
            {address?.mobile} {"\n"}
            {address?.fullAddress}, - {address?.pinCode} {"\n"}
            {address?.city}
          </Text>
        ) : (
          <View style={styles.noAddressContainer}>
  <Text style={styles.noAddressText}>No address selected</Text>
  <TouchableOpacity style={styles.addAddressRow} onPress={navigateToAddress}>
    <Ionicons name="add" size={16} color={Colors.Text} />
    <Text style={styles.addAddressText}>Add address</Text>
  </TouchableOpacity>
</View>

        )}

        {/* <TouchableOpacity onPress={openAddressForm}>
          <Text style={styles.addNewText}>➕ Add New</Text>
        </TouchableOpacity> */}
     
      </View>
    </View>

    
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    backgroundColor:  Colors.orderPageBackground,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  title: {
    fontSize: 12,
    fontFamily: Fonts.regular,
  },
  selectText: {
    fontSize: 14,
    color: "blue",

  },
  addressContainer: {
    paddingVertical: 5,
  },
  addressText: {
    fontSize: 15,
    marginBottom: 5,
    fontFamily:Fonts.regular,
  },
  noAddressText: {
    fontSize: 14,
    color: Colors.Grey,
    fontFamily:Fonts.regular
  },
  addNewText: {
    fontSize: 14,
  },
  noAddressContainer: {
    marginTop: 5,
  },
  
  addAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  
  addAddressText: {
    fontSize: 14,
    color: Colors.Text,
    marginLeft: 5,
    fontFamily: Fonts.medium,
  },
});

export default DeliveryAddress;
