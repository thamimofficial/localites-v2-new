import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addCart, reduceCart } from '../../../redux/cartSlice';
import { apiBase } from '../../../services/api';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import BackButton from '../../CoreComponent/BackButton/BackButton';
import { useNavigation } from '@react-navigation/native';
import Fonts from '../../../constants/Font';
import Colors from '../../../constants/Colors';
import Images from '../../../constants/Images';
import { SafeAreaView } from 'react-native-safe-area-context';

const ReviewCart = ({ stallName, stallSlug }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  console.log("cart",cart)

  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(cart.totalAmount);
  }, [cart.totalAmount]);

  const handleIncrement = (item) => {
    dispatch(addCart({ stallId: item.stallId, item }));
  };

  const handleDecrement = (item) => {
    dispatch(reduceCart({ stallId: item.stallId, item }));
  };

  const confirmOrder = () => {
    navigation.navigate('OrderConfirmation', {
      orderDetails: cart.items,
      totalAmount: total,
      stallName,
      stallSlug,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton style={styles.backButton} />
        <Text style={styles.label}>Cart</Text>
                <Text style={styles.label}></Text>

      </View>

      <View style={styles.stallHeader}>
        <Text style={styles.stallName}>{stallName}</Text>
      </View>

      {cart.items.length > 0 ? (
        <ScrollView style={styles.cartItems}>
          {cart.items.map((item, i) => (
            <View key={i} style={styles.cartItem}>
              <Image
                source={{ uri: `${apiBase.imagePath}${item.imagePath}` }}
                style={styles.itemImage}
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.itemName}</Text>
                {item.customizedDetails?.length > 0 && (
                  <View style={styles.modifiersContainer}>
                    {item.customizedDetails.map((custom, index) => (
                      <Text key={index} style={styles.modifierOption}>
                        {custom.description}
                        {custom.stallItemCustomizeDetailPrice > 0 && (
                          <Text> (+₹{custom.stallItemCustomizeDetailPrice.toFixed(2)})</Text>
                        )}
                      </Text>
                    ))}
                  </View>
                )}
                <Text style={styles.itemPrice}>₹{item.totalPrice.toFixed(2)}</Text>
              </View>

              <View style={styles.quantityControl}>
                <TouchableOpacity onPress={() => handleDecrement(item)} style={styles.quantityButton}>
                  {item.quantity > 1 ? (
                    <Text style={styles.quantityButtonText}>-</Text>
                  ) : (
                    <FontAwesome6 name="trash" size={16} color="#fff" />
                  )}
                </TouchableOpacity>

                <Text style={styles.quantityText}>{item.quantity}</Text>

                <TouchableOpacity onPress={() => handleIncrement(item)} style={styles.quantityButton}>
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyCartContainer}>
        <Image
          source={
            typeof Images?.emptyCart === 'string'
              ? { uri: Images.emptyCart }
              : Images?.emptyCart
          }
          style={styles.emptyCartImage}
          resizeMode="contain"
        />

          <Text style={styles.emptyTitle}>Empty</Text>
          <Text style={styles.emptyText}>
            Do not have any item in the cart
          </Text>
          <TouchableOpacity
            style={styles.shopNowButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.shopNowText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
      )}

      {total > 0 && (
        <View style={styles.cartFooter}>
          <TouchableOpacity style={styles.confirmButton} onPress={confirmOrder}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FontAwesome6 name="cart-shopping" size={20} color="#fff" />
              <Text style={[styles.confirmButtonText, { marginLeft: 10 }]}>
                CheckOut
              </Text>
            </View>
            <Text style={styles.confirmButtonText}>₹ {total.toFixed(2)}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.Background,
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
      right:10
    },
  stallHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  stallName: {
    fontSize: 16,
    fontFamily: Fonts.bold,
  },
  cartItems: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 1,
  },
  itemImage: {
    width: 90,
    height: 90,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  itemDetails: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  itemName: {
    fontSize: 16,
    fontFamily: Fonts.bold,
  },
  modifiersContainer: {
    marginTop: 4,
  },
  modifierOption: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
    fontFamily: Fonts.regular,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  quantityButton: {
    padding: 8,
    backgroundColor: Colors.primary,
    borderRadius: 6,
  },
  quantityButtonText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#fff',
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 16,
    fontFamily: Fonts.regular,
  },
  cartFooter: {
    marginTop: 16,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: Fonts.bold,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyCartImage: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: Fonts.bold,
    fontSize: 26,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    fontFamily: Fonts.regular,
    marginBottom: 20,
  },
  shopNowButton: {
    backgroundColor: Colors.Black,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 32,
  },
  shopNowText: {
    fontFamily: Fonts.medium,
    color: Colors.WhiteText,
    fontSize: 20,
  },
});

export default ReviewCart;
