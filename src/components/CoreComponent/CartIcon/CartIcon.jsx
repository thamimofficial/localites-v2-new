import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Fonts from '../../../constants/Font';

const CartIcon = ({ onPress }) => {
  const cart = useSelector((state) => state.cart); // Access cart state from Redux

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <FontAwesome6 name="cart-shopping" size={20} color="#000" />
      {cart?.cartCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{cart.cartCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CartIcon;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 2 : 4,
    right: Platform.OS === 'ios' ? 2 : 4,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    zIndex: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
     fontFamily:Fonts.bold,
    textAlign: 'center',
  },
});
