import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import Colors from '../../constants/Colors';
import Fonts from '../../constants/Font';

import { clearCart } from '../../redux/cartSlice';
import RazorpayCheckout from 'react-native-razorpay';
import BackButton from '../../components/CoreComponent/BackButton/BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import StorageService from '../../services/StorageService/storageService';
import { apiBase, apiService } from '../../services/api';
import axios from 'axios';


const BookingOrderSummary = ({route,navigation}) => {
  const {orderData,selectedCoupons} = route.params;
  console.log('Orderdata ',orderData) 
  console.log('selectedCoupons ',selectedCoupons) 
  const dispatch = useDispatch()
  // const couponValue = 10
  // console.log('couponValue',couponValue)
  const cart = useSelector((state) => state.cart);
  const total = cart?.totalAmount ?? 0;''

      const [couponValue, setCouponValue] = useState(selectedCoupons.couponValue);

    const [deliveryCharge, setDeliveryCharge] = useState();
    const [previewData, setPreviewData] = useState();

  useEffect(()=>{
    // previewOrder()
  },[]) 


    const bookRequest = async () => {
      const inputData = orderData
      const token = await StorageService.getItem('sessionId');
    
      try {
        const response = await apiService.post('/stallbookingrequest/book',
          inputData,
          token,
        );
    
       console.log('bookRequest:', response.data);
       getBookingById(response.data)
  
        return response.data;
      } catch (error) {
        console.error('Error fetching bookRequest:', error.response?.data || error.message);
        throw error;
      }
    };

    const defaultBooking = {
      name: "",
      stallId: -1,
      durationInMins: 0,
      bookingTypeId: 1,
      pricePerSeat: 0,
      unit: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      maxCapacityPerSlot: 0,
      maxSeatPerBooking: 0,
      stopBookingBeforeNDays: 0,
      stopBookingMessage: "",
      id: -1
    };

    const getBookingById = async (bookingId) => {
      const inputData = orderData
      const token = await StorageService.getItem('sessionId');
    
      try {
        const response = await apiService.get(`/portal/stall/booking/${bookingId}`,
          inputData,
          token,
        );
    
       console.log('getBookingById:', response.data);
       initiatePayment(response.data.id)
       console.log("OrderId",response.data.id)
  
        return response.data;
      } catch (error) {
        console.error('Error fetching getBookingById:', error.response?.data || error.message);
        throw error;
      }
    };

    const placeOrder = async () => {
      //console.log('selectedSlot',selectedSlot)
      // if(selectedSlot == null){
      //   Alert.alert('Alert','Plz select a Delivery Slot')
      // }else{
        const token = await StorageService.getItem('sessionId');

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
        const response = await apiService.get(`/stallbookingrequest/GetPaymentLink/${inputData.id}`, token);
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
        // if (!paymentData?.amount || !paymentData?.orderId) {
        //   throw new Error('Incomplete payment data');
        // }
    
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
        const verification = await axios.post(
          'https://api.localites.in/api/stallbookingrequest/updatePaymentSuccess',
          {
            Id: paymentResponse.Id,
            ExternalPaymentId: paymentResponse.ExternalPaymentId,
            ExternalOrderId: paymentResponse.ExternalOrderId
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // assuming token matches what you passed in curl
              'Content-Type': 'application/json',
            }
          }
        );
    
         console.log("verification.data", verification);
     
       
          Alert.alert('Success', 'Payment verified successfully!');
          //navigation.replace('OrderConfirmed');
    
      } catch (error) {
        console.error('Verification Error:', error?.response?.data || error.message);
       // Alert.alert('Error', 'Could not verify payment with server');
      }
    };
  const formatTo12Hour = (timeStr) => {
  if (!timeStr) return '';
  const [hour, minute] = timeStr.split(':');
  const h = parseInt(hour, 10);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${minute} ${suffix}`;
};




    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.orderPageBackground }}>
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.card}>
    
              <BackButton />
    
              <Text style={styles.title}>Order Summary</Text>
    
             
              <View>
  <View style={styles.totalRow}>
    <Text style={styles.subTotalLabel}>Booking Date:</Text>
    <Text style={styles.subTotalAmount}>{orderData.bookingDate}</Text>
  </View>

  <View style={styles.totalRow}>
    <Text style={styles.subTotalLabel}>Booking Time:</Text>
    <Text style={styles.subTotalAmount}>{formatTo12Hour(orderData.bookingTime)}</Text>
  </View>
{/* 
  <View style={styles.totalRow}>
    <Text style={styles.subTotalLabel}>Community ID:</Text>
    <Text style={styles.subTotalAmount}>{orderData.communityId}</Text>
  </View> */}

  <View style={styles.totalRow}>
    <Text style={styles.subTotalLabel}>Contact Name:</Text>
    <Text style={styles.subTotalAmount}>{orderData.contactName}</Text>
  </View>

  <View style={styles.totalRow}>
    <Text style={styles.subTotalLabel}>Contact Number:</Text>
    <Text style={styles.subTotalAmount}>{orderData.contactNumber}</Text>
  </View>

  {/* <View style={styles.totalRow}>
    <Text style={styles.subTotalLabel}>Coupon ID:</Text>
    <Text style={styles.subTotalAmount}>{orderData.couponId}</Text>
  </View> */}

  <View style={styles.totalRow}>
    <Text style={styles.subTotalLabel}>Payment Mode:</Text>
    <Text style={styles.subTotalAmount}>{orderData.paymentMode}</Text>
  </View>

  <View style={styles.totalRow}>
    <Text style={styles.subTotalLabel}>Price Per Seat:</Text>
    <Text style={styles.subTotalAmount}>{orderData.pricePerSeat}</Text>
  </View>
    {
      orderData.requestNotes.length>0 && 
        <View style={styles.totalRow}>
    <Text style={styles.subTotalLabel}>Request Notes:</Text>
    <Text style={styles.subTotalAmount}>{orderData.requestNotes}</Text>
  </View>
    }


  <View style={styles.totalRow}>
    <Text style={styles.subTotalLabel}>Seat Count:</Text>
    <Text style={styles.subTotalAmount}>{orderData.seatCount}</Text>
  </View>

  {/* <View style={styles.totalRow}>
    <Text style={styles.subTotalLabel}>Stall Booking ID:</Text>
    <Text style={styles.subTotalAmount}>{orderData.stallBookingId}</Text>
  </View>

  <View style={styles.totalRow}>
    <Text style={styles.subTotalLabel}>Stall ID:</Text>
    <Text style={styles.subTotalAmount}>{orderData.stallId}</Text>
  </View>

  <View style={styles.totalRow}>
    <Text style={styles.subTotalLabel}>User Coupon ID:</Text>
    <Text style={styles.subTotalAmount}>{orderData.userCouponId}</Text>
  </View>

  <View style={styles.totalRow}>
    <Text style={styles.subTotalLabel}>User ID:</Text>
    <Text style={styles.subTotalAmount}>{orderData.userId}</Text>
  </View> */}
</View>
<View style={styles.divider} />
    
             
                
             
              <View style={styles.totalRow}>
                <Text style={styles.subTotalLabel}>Order Amount</Text>
                <Text style={styles.subTotalAmount}>₹{orderData?.pricePerSeat.toFixed(2)}</Text>
              </View>
                 {/* <View style={styles.totalRow}>
                <Text style={styles.subTotalLabel}>couponAmount Amount</Text>
                <Text style={styles.subTotalAmount}>₹{orderData.couponAmount}</Text>
              </View> */}
    
    

    
<View style={styles.totalRow}>
  <Text style={styles.totalLabel}>Total</Text>
  <Text style={styles.totalAmount}>
    ₹
    {(() => {
      const baseAmount = parseFloat(orderData.pricePerSeat || 0);
      const coupon = selectedCoupons || {};
      let discount = 0;

      if (coupon.couponValueTypeId === 2) {
        // Percentage discount
        discount = coupon.couponValue;
      } else if (coupon.couponValueTypeId === 1) {
       // Flat discount 
        discount = (baseAmount * coupon.couponValue) / 100;
      }

      const total = baseAmount - discount;
      return total.toFixed(2);
    })()}
  </Text>
</View>


    
    
    
            </View>
          </ScrollView>
    
          {/* Fixed bottom button */}
          <View style={styles.bottomWrapper}>
            <TouchableOpacity style={styles.confirmButton} onPress={bookRequest}>
              <Text style={styles.buttonText}>Confirm Booking</Text>
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
  title: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    marginBottom: 12,
    color: '#333',
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

export default BookingOrderSummary;
