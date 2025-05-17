import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import Colors from '../../../constants/Colors';
import Fonts from '../../../constants/Font';
import { apiBase, apiService } from '../../../services/api';
import { clearCart } from '../../../redux/cartSlice';
import RazorpayCheckout from 'react-native-razorpay';
import BackButton from '../../CoreComponent/BackButton/BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import StorageService from '../../../services/StorageService/storageService';


const OrderSummary = ({route,navigation}) => {
  const {orderData} = route.params;
  console.log('Orderdata ',orderData) 
  const dispatch = useDispatch()
  const couponValue = 10
  console.log('couponValue',couponValue)
  const cart = useSelector((state) => state.cart);
  const total = cart?.totalAmount ?? 0;''


    const [deliveryCharge, setDeliveryCharge] = useState();
    const [previewData, setPreviewData] = useState();

  useEffect(()=>{
    previewOrder()
  },[]) 

    const placeOrder = async () => {
      //console.log('selectedSlot',selectedSlot)
      // if(selectedSlot == null){
      //   Alert.alert('Alert','Plz select a Delivery Slot')
      // }else{
         console.log("orderData from OrderSummaty ",orderData)
        const token = await StorageService.getItem('sessionId');
   console.log("orderData from OrderSummaty ",orderData)
      try {
        const response = await apiService.post(`/order/place`, orderData, token);
        console.log('Order placed successfully:', response.data);
        // getOrderDetail(response.data.orderId)
        console.log('selectedPayment',previewData.order.paymentMode)
        if (previewData.order.paymentMode !== "razorpay") {
          dispatch(clearCart());
          navigation.replace('OrderConfirmed');
        } else {
          
          initiatePayment(response.data.orderId);
        }
    
        return response.data;
      } catch (error) {
        console.error('Error placing order:', error);
        throw error;
      }
    
    };
  
    const previewOrder = async () => {
      const token = await StorageService.getItem('sessionId');

      try {
        const response = await apiService.post(`/order/validate`, orderData, token);
        console.log('Order  previewOrder:', response.data);
        //getOrderDetail(response.data.orderId)
  
        setPreviewData(response.data)
        setDeliveryCharge(response.data.order.deliveryCharge)
        console.log("deli charg",response.data.order.deliveryCharge)
        return response.data;
      } catch (error) {
        console.error('Error placing order:', error);
        throw error;
      }
    };
    
  
    const initiatePayment = async (orderId) => {
      const inputData ={
        id :  orderId
      }
      const token = await StorageService.getItem('sessionId');

      try {
        const response = await apiService.post(`/order/GetPaymentLink`, inputData, token);
        console.log('initiatePayment:', response.data);
        handlePayment(response.data.result)
        
        return response.data;
      } catch (error) {
        console.error('Error initiatePayment order:', error);
        throw error;
      }
    };
  
  
    const getOrderDetail = async (orderId) => {
      const inputData ={
        id :  orderId
      }
      const token = await StorageService.getItem('sessionId');

      try {
        const response = await apiService.get(`/order/detail/${inputData.id}`, token);
        console.log('getOrderDetail:', response.data);
        console.log('getOrderDetail delivery Charges:', response.data[0].order.deliveryCharge);
        setDeliveryCharge(response.data[0].order)
        return response.data;
      } catch (error) {
        console.error('Error initiatePayment order:', error);
        throw error;
      }
    };
  
  
    const [paymentStatus, setPaymentStatus] = useState('');
  
    const handlePayment = async (paymentData) => {
      try {
        // Validate required payment data
        if (!paymentData?.amount ) {
          throw new Error('Incomplete payment data');
        }
    
        const options = {
          description: paymentData.description ,
          image: 'https://app.localites.in/static/media/logo.9bcc0c547be72947c96b.png',
          currency: 'INR',
          key: 'rzp_live_sKR0WRHUynYDaQ', // Should be moved to environment variables
          amount: Math.round(paymentData.amount * 100), // Convert to paise
          name: paymentData.name ,
          order_id: paymentData.externalOrderId || paymentData.orderId, // Razorpay needs externalOrderId
          prefill: {
            email: paymentData.email ,
            contact: paymentData.mobile , // Fixed: using mobile instead of description
            name: paymentData.name 
          },
          theme: { 
            color: '#F37254'
          },
          notes: {
            internalOrderId: paymentData.orderIdentifier,
            checkoutId: paymentData.checkoutIdentifier,
            userId: paymentData.userId,
            stallId: paymentData.stallId
          }
        };
    
        console.log('Razorpay Options:', options); // Debug log
    
        RazorpayCheckout.open(options)
          .then((data) => {
            console.log('Payment Success:', data);
            setPaymentStatus(`Success: ${data.razorpay_payment_id}`);
            dispatch(clearCart());
            navigation.replace('OrderConfirmed');
            
            
  
            const dataFor ={
              Id: paymentData.id,
              ExternalPaymentId: data.razorpay_payment_id,
              ExternalOrderId: paymentData.externalOrderId
            }
            // Verify payment with backend
            updateRazorPaySuccess(dataFor);
          })
          .catch((error) => {
           // console.error('Payment Error:', error);
          
            let errorMsg = 'Payment failed. Please try again later.';
          
            // Known codes
            if (error.code === 2) {
              errorMsg = 'Network error - Please check your connection';
            } else if (error.code === 4) {
              errorMsg = 'Payment cancelled by user';
            } else if (error.code === 0) {
              // Razorpay throws a malformed error with code 0 sometimes on cancel or close
              errorMsg = 'Payment was not completed. You can try again.';
            }
          
            // Don't display raw Razorpay description to the user
            setPaymentStatus(`Error: ${errorMsg}`);
            Alert.alert('Payment Failed', errorMsg);
          });
          
    
      } catch (error) {
        console.error('Payment Initialization Error:', error);
        setPaymentStatus('Error: Payment initialization failed');
        Alert.alert('Error', error.message || 'Failed to process payment');
      }
    };
    
    // Add this function to handle payment verification
    const updateRazorPaySuccess = async (paymentResponse) => {
      const token = await StorageService.getItem('sessionId');

      try {
        const verification = await apiService.post('/order/updatePaymentSuccess', paymentResponse,  token);
    
        navigation.navigation('OrderConfirmed')
        if (verification.data.success) {
          Alert.alert('Success', 'Payment verified successfully!');
          // Update order status in your state/context
        } else {
          Alert.alert('Warning', 'Payment verification failed');
        }
      } catch (error) {
        console.error('Verification Error:', error);
        Alert.alert('Error', 'Could not verify payment with server');
      }
    };
  



    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.orderPageBackground }}>
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.card}>
    
              <View style={styles.header}>
        <BackButton style={styles.backButton} />
        <Text style={styles.label}>Order Summary</Text>
                <Text style={styles.label}></Text>

      </View>
    
    
              {cart.items.length > 0 ? (
                cart.items.map((item, index) => (
                  <View key={index} style={styles.rowWrapper}>
                    <View style={styles.left}>
                      <Text style={styles.itemName} numberOfLines={1}>{item.itemName}</Text>
                      {item.isCustomized && item.customizedDetails?.length > 0 && (
                        <Text style={styles.customizedText}>
                          {item.customizedDetails.map((custom, i) => custom.description).join(', ')}
                        </Text>
                      )}
                    </View>
                    <Text style={styles.quantity}>x{item.quantity}</Text>
                    <Text style={styles.price}>₹{item.totalPrice?.toFixed(2) ?? '0.00'}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No items to display</Text>
              )}
    
              <View style={styles.divider} />
              <View style={styles.totalRow}>
                <Text style={styles.subTotalLabel}>Order Amount</Text>
                <Text style={styles.subTotalAmount}>₹{total.toFixed(2)}</Text>
                
              </View>
    
              <View style={styles.totalRow}>
                <Text style={styles.subTotalLabel}>Delivery Fee</Text>
                <Text style={styles.subTotalAmount}>+ ₹{deliveryCharge || 0}</Text>
                {console.log("deliveryCharge",deliveryCharge)}
              </View>
    
              <View style={styles.totalRow}>
                <Text style={styles.subTotalLabel}>Coupon</Text>
                <Text style={styles.subTotalAmount}>- ₹{previewData?.order.couponAmount || 0}</Text>
              </View>
    
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalAmount}>
                  ₹{
                    couponValue > 0
                      ? (total - previewData?.order.couponAmount + previewData?.order.deliveryCharge).toFixed(2)
                      : total.toFixed(2)
                  }
                </Text>
              </View>
            </View>
          </ScrollView>
    
          {/* Fixed bottom button */}
          <View style={styles.bottomWrapper}>
            <TouchableOpacity style={styles.confirmButton} onPress={placeOrder}>
              <Text style={styles.buttonText}>Place Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
    
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.orderPageBackground,
    borderRadius: 12,
    padding: 16,
    flex:1
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
  rowWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  left: {
    flex: 1,
    paddingRight: 8,
  },
  itemName: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    color: '#444',
  },
  customizedText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: '#666',
    marginTop: 2,
  },
  quantity: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    color: '#666',
    paddingHorizontal: 6,
  },
  price: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: '#000',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subTotalLabel: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#333',
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#333',
  },
  subTotalAmount: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.Text,
  },
  totalAmount: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: Colors.Text,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#999',
    marginVertical: 20,
  },
  confirmButton: {
    backgroundColor: Colors.ButtonGreen,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 15,
    borderRadius:32,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily:Fonts.bold
  },
});

export default OrderSummary;
