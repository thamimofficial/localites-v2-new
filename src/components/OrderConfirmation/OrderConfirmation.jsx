import { StyleSheet, View, ScrollView, Text, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import ReviewCart from './ReviewCart/ReviewCart';
import { apiBase, apiService } from '../../services/api';
import PickupAddress from './PickupAddress/PickupAddress';
import DeliveryAddress from './DeliveryAddress/DeliveryAddress';
import DeliverySlots from './DeliverySlots/DeliverySlots';
import Coupons from './Coupons/Coupons';
import { FlatList } from 'react-native-gesture-handler';
import Colors from '../../constants/Colors';
import BackButton from '../CoreComponent/BackButton/BackButton';
import Fonts from '../../constants/Font';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import OrderSummary from './OrderSummary/OrderSummary';

import RazorpayCheckout from 'react-native-razorpay';
import { useDispatch, useSelector } from 'react-redux';
import CartIcon from '../CoreComponent/CartIcon/CartIcon';
import Loader from '../Loader/Loader';
import { clearCart } from '../../redux/cartSlice';
import StorageService from '../../services/StorageService/storageService';
import { DateFormat } from '../CoreComponent/GlobalServices/DateFormat';
import AlertBox from '../CoreComponent/AlertBox/AlertBox';
import PickUpSlots from './PickupSlots/PickUpSlots';
import { SafeAreaView } from 'react-native-safe-area-context';


// import RazorpayCheckout from 'razorpay-react-native';


//stall id have to come
const OrderConfirmation = ({data}) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const allDeliveryModes = [
    { text: 'Delivery', name: 'deliverymode', value: 'Delivery', checked: true },
    { text: 'Pickup', name: 'deliverymode', value: 'Pickup', checked: false },
  ];
  // const allPaymentOptions = [
  //   { text: 'Cash On Delivery', name: 'paymentoption', value: 'cod', checked: false },
  //   { text: 'Razorpay (UPI, Credit/Debit Card, NetBanking)', name: 'paymentoption', value: 'razorpay', checked: true },
  // ];

  let defaultStall = { address: '', id: 0, name: '', slug: '' };
  let defaultAddress = { fullName: 'thamim', mobile: '1234567890', fullAddress: 'SBM MANSION', id: 0 };
  let defaultContext = {
    deliveryMode: 'Delivery',
    deliveryCharge: 0,
    deliveryChargeMsg: null,
    addressId: 0,
    deliverySlotId: 0,
    selectedUserCouponId: 0,
    paymentMode: 'razorpay',
    selectedCouponValue: 0,
    doorDeliveryMsg: 'You will be notified once the order is shipped!',
    pickupDeliveryMsg: 'You will be notified once the order is ready!',
    selectedCouponId: 0,
    selectedCouponValueTypeId: 2, // 2-Value
    minimumOrderAmount: null,
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deliveryModes, setDeliveryModes] = useState([]);
  const [stall, setStall] = useState(defaultStall);
  const [address, setAddress] = useState(defaultAddress);
  const [currentContext, setCurrentContext] = useState(defaultContext);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [availableCoupons, setAvailableCoupons] = useState([]);

  //this is for address type pickup or delivery
  const [deliverySlotId, setDeliverySlotId] = useState()

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [communityId, setCommunityId] = useState(null);

  const [isModalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [alertMessage, setAlertMessage] = useState(""); // To store the alert message
  const [alertTitle, setAlertTitle] = useState(""); // To store the alert message

  const handleSlotChange = (slot) => {
    setSelectedSlot(slot);
    console.log('Selected Slot:', slot);
  
  };

  const [deliveryCharge, setDeliveryCharge] = useState();  //os
  const [selectedCoupons, setSelectedCoupons] = useState();
  const handleCouponChange = (selectedCoupon) => {
    if (selectedCoupon) {
      console.log('coupon value',selectedCoupon.couponValue)
      console.log("Coupon applied:", selectedCoupon.couponCode);
      setSelectedCoupons(selectedCoupon)
    } else {
      setSelectedCoupons({selectedCoupon:0})
      console.log('coupon value',selectedCoupon)
      console.log("Coupon removed");
    }
    // You can update your state or totals accordingly here
  };
  //order details


  const [paymentOptions, setPaymentOptions] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState('');


  //order details
  const [orderTypeId, setOrderTypeId] = useState(1)


  const getStallById = async () => {
 
    try {
      const response = await apiService.get(`/portal/stall/${cart.stallId}`, apiBase.token);
      setProducts(response.data || []);
      console.log('getStallById From OrderConfirmation page:', response.data);
      getStallCallBack(response.data);
      setCommunityId(response.data.communityId)
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStallCallBack = (res) => {
    setStall(res);
    let deliveryModes = [];
    if (res.isDeliveryEnabled == 1 && res.isPickupEnabled == 0) {
      for (let item of allDeliveryModes) {
        if (item.value == 'Delivery') {
          item.checked = true;
          deliveryModes.push(item);
        }
      }
    } else if (res.isDeliveryEnabled == 0 && res.isPickupEnabled == 1) {
      for (let item of allDeliveryModes) {
        if (item.value == 'Pickup') {
          item.checked = true;
          deliveryModes.push(item);
        }
      }
      setCurrentContext((prevState) => ({ ...prevState, deliveryMode: 'Pickup' }));
    } else {
      deliveryModes = allDeliveryModes;
    }
    setDeliveryModes(deliveryModes);
  };

 
const getDefaultAddress = async () => {
  const token = await StorageService.getItem('sessionId');
  console.log('token',token);
  try {
    const response = await apiService.post('/address/default/query',
      {}, // If you need to send a body, replace this empty object
      token
    );

   console.log('Default Address Response:', response.data);
    if (response.data && response.data.id) {
            setAddress(response.data);
            setCurrentContext((prevState) => ({
              ...prevState,
              addressId: response.data.id > 0 ? response.data.id : 0,
            }));
          }
    return response.data;
  } catch (error) {
    console.error('Error fetching default address:', error.response?.data || error.message);
    throw error;
  }
};


 
const getPaymentOptions = async () => {
  const token = await StorageService.getItem('sessionId');

  try {
    const response = await apiService.get(`/paymentoption/active/stall/${cart.stallId}`,
      token
    );

   console.log('DefaultgetPaymentOptions:', response.data);
    if (Array.isArray(response.data)) {
      setPaymentOptions(response.data);

      
        // Only one option, set it as default
        const method = response.data[0].paymentOptionCode;
        setSelectedPayment(method);
    
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching default address:', error.response?.data || error.message);
    throw error;
  }
};


 
const getAvailableCoupons = async () => {
  const inputData ={
    entityTypeId: 3, // 3-Stall
    entityId: cart.stallId
  }
  const token = await StorageService.getItem('sessionId');

  try {
    const response = await apiService.post('/coupon/list',
      inputData,
      token,
    );

   console.log('getAvailableCoupons:', response.data);
   setAvailableCoupons(response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching getAvailableCoupons:', error.response?.data || error.message);
    throw error;
  }
};


  const formatService = {
    getCurrentDateForServer: () => {
      let date = new Date();
      return date.toISOString().split('T')[0]; // YYYY-MM-DD
    },
    getCurrentTimeForServer: () => {
      let date = new Date();
      return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    },
    getDateStringForServer: (date) => {
      if (!date) return null;
      return new Date(date).toISOString().split('T')[0]; // Converts Date to YYYY-MM-DD
    },
  };

  const general = {
    getFormattedTime: (time) => {
      if (!time) return null;
      let [hours, minutes] = time.split(':');
      let suffix = hours >= 12 ? 'PM' : 'AM';
      hours = ((hours % 12) || 12).toString().padStart(2, '0'); // Convert 24h to 12h format
      return `${hours}:${minutes} ${suffix}`;
    },
  };

  const getAvailableSlots = async () => {
    let inputData = { stallId:cart.stallId };
    const token = await StorageService.getItem('sessionId');

    try {
      let response = await apiService.post(`/stalldeliveryslot/available`,
        inputData,
        token
      );
     // console.log('API Response:', response.data);
      getAvailableSlotsCallBack(response);
      console.log("avaialbleslo",response);
    } catch (error) {
      console.error('Error fetching available slots:', error);
    }
  };
  
  const getAvailableSlotsCallBack = (res) => {
    const result = res.data;
    if (result && result.deliverySlots && result.deliverySlots.length > 0) {
      // Format and filter slots
      const formattedSlots = result.deliverySlots.map(slot => ({
        ...slot,
        formattedStartTime: formatTimeFromString(slot.startTime),
        formattedEndTime: formatTimeFromString(slot.endTime),
        numericStartTime: convertTimeToNumber(slot.startTime),
        numericEndTime: convertTimeToNumber(slot.endTime)
      }));
  
      // Filter slots based on current time if date is today
      const filteredSlots = filterSlotsByCurrentTime(formattedSlots);
      
     console.log('Filtered Slots:', filteredSlots);
      setAvailableSlots(formattedSlots);
    } else {
      setAvailableSlots([]);
    }
  
    setCurrentContext(prevState => ({
      ...prevState,
      deliverySlotId: 0,
    }));
  };
  
  // Helper functions
  const formatTimeFromString = (timeStr) => {
    if (!timeStr) return '';
    
    // Handle both "1800" and "06:00 PM" formats
    if (timeStr.includes(':')) {
      return timeStr; // Already formatted
    }
  
    // Format "1800" to "06:00 PM"
    const hours = parseInt(timeStr.substring(0, 2), 10);
    const minutes = timeStr.substring(2);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    
    return `${displayHours}:${minutes} ${period}`;
  };
  
  const convertTimeToNumber = (timeStr) => {
    if (!timeStr) return 0;
    
    // Handle both "1800" and "06:00 PM" formats
    if (timeStr.includes(':')) {
      const [time, period] = timeStr.split(' ');
      const [hours, minutes] = time.split(':');
      let hourNum = parseInt(hours, 10);
      if (period === 'PM' && hourNum !== 12) hourNum += 12;
      if (period === 'AM' && hourNum === 12) hourNum = 0;
      return hourNum * 100 + parseInt(minutes, 10);
    }
    
    // For "1800" format
    return parseInt(timeStr, 10);
  };
  
  const filterSlotsByCurrentTime = (slots) => {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.getHours() * 100 + now.getMinutes();
  
    return slots.filter(slot => {
      const slotDate = new Date(slot.createdDate).toISOString().split('T')[0];
      
      // If slot is not for today, show it
      if (slotDate !== currentDate) return true;
      
      // For today's slots, check if current time is before end time
      return currentTime < slot.numericEndTime;
    });
  };

  const filterCurrentDaySlots = (slotList) => {
    let currentDate = formatService.getCurrentDateForServer();
    let currentTime = formatService.getCurrentTimeForServer();
    let selectedDate = formatService.getDateStringForServer(currentContext.selectedDeliveryDate);

    if (currentDate === selectedDate) {
      slotList = slotList.filter((i) => i.startTime > currentTime);
    }
    return slotList;
  };


  const cart = useSelector((state) => state.cart);
  //console.log('cart',cart)
  //console.log('paymentOptions',paymentOptions)
 // console.log('selectedPayment',selectedPayment)
  console.log('selectedSlot',selectedSlot)
  //console.log('address',address.id)
  //console.log('communityId',communityId)
  

  const now = new Date();

  // const Order ={
  //   id: 0,
  //   stallId: cart.stallId,
  //   orderAmount: cart.totalAmount,
  //   orderTypeId: orderTypeId,
  //   paymentMode: selectedPayment,
  //   addressId: address.id,
  //   userCouponId: 0,
  //   deliverySlotId: selectedSlot?.id,
  //   orderDate: now.toISOString().split("T")[0],
  //   deliveryCharge: 0,
  //   selectedDay: now.toLocaleString("en-US", { weekday: "short" }),
  //   communityId: "20052",
  // }
  const Orders = {
    id: 0,
    stallId: cart.stallId,
    orderAmount: cart.totalAmount,
    orderTypeId: orderTypeId,
    paymentMode: selectedPayment,
    addressId: address.id,
    userCouponId: 0,
    deliverySlotId: selectedSlot?.id,
    orderDate: now.toISOString().split("T")[0],
    deliveryCharge: 0,
    selectedDay: DateFormat.getTodayShortDay(),
    communityId: communityId
  }

  //console.log("orders",Orders)

 const generateOrderLines = (cartItems) => {
  return cartItems.map((item) => {
    //console.log("item",item)
    const modifiers = item.isCustomized
      ? item.customizedDetails.map((detail) => ({
          description: detail.description,
          groupName: detail.groupName,
          groupTypeId: detail.groupTypeId,
          maxCount: detail.maxCount,
          minCount: detail.minCount,
          stallItemCustomizeDetailId: detail.stallItemCustomizeDetailId,
          stallItemCustomizeDetailPrice: detail.stallItemCustomizeDetailPrice || 0,
          stallItemCustomizeHeaderId: detail.stallItemCustomizeHeaderId,
          stallItemId: item.stallItemId
        }))
      : [];

    return {
      ItemId: item.itemId,
      ItemName: item.itemName,
      ItemQuantity: item.quantity,
      LineModifierAmount: 0,
      LineTotalPrice: cart.totalAmount,
      Price: cart.totalAmount || 0,
      StallItemBatchId: item.id,
      StallItemId: item.stallItemId,
      OrderLineModifiers: modifiers
    };
  });
};
//console.log(cart)
// console.log('Cart Items:', cartItems);
const OrderLines = generateOrderLines(cart.items);


  const  OrderLiness= [
    {
      ItemId: 3453,
      ItemName: "Biriyani",
      ItemQuantity: 1,
      LineModifierAmount: 0,
      LineTotalPrice: 1,
      OrderLineModifiers: [],
      Price: 1,
      StallItemBatchId: 11858,
      StallItemId: 1674
    }
  ]

  const orderData = {
    CouponId: selectedCoupons?.couponId || 0,
    Order: Orders,
    OrderLines: OrderLines
  };

   const placeOrderSummary = () => {
       console.log('selectedSlot',selectedSlot)
       console.log('Address',address)
      if(selectedSlot == null){
        // Alert.alert('Alert','Plz select a Delivery Slot')
        setModalVisible(true)
        setAlertTitle('Alert')
        setAlertMessage('Plz select a Delivery Slot')
      }else if(!address?.id){
        // Alert.alert('Alert','Plz select a Delivery address')
        setModalVisible(true)
        setAlertTitle('Alert')
        setAlertMessage('Plz select a Delivery address')
      }else{
    navigation.navigate('OrderSummary',{orderData})
      }
   }

  useEffect(() => {

    const communityIdfech = async () =>{

      const communityId = await StorageService.getItem('communityId');
      console.log('community id from login', communityId)
      setCommunityId(communityId)
    }
    communityIdfech()


    getDefaultAddress();
    getStallById();
    getAvailableSlots();
    getPaymentOptions();
    getAvailableCoupons();
  
    // Run previewOrder every 3 seconds
    // const interval = setInterval(() => {
      // previewOrder();
    // }, 3000);
  
    // // Cleanup interval when component unmounts
    // return () => clearInterval(interval);
  }, [orderTypeId]);
 


//   const renderHeader = () => (
//     <>

//  {/* Tab Bar */}
//  <View style={styles.tabContainer}>
//   <Text style={styles.tabTitle}>Choose Your Order Type</Text>
//    <View style={{flexDirection:'row',backgroundColor:Colors.White}}>
//         <TouchableOpacity
//           style={[
//             styles.tab,
//             orderTypeId === 1 && styles.activeTab,
//           ]}
//           onPress={() => setOrderTypeId(1)}
//         >
//           <Text style={[
//             styles.tabText,
//             orderTypeId === 1 && styles.activeTabText,
//           ]}>
//             Delivery
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[
//             styles.tab,
//             orderTypeId === 2 && styles.activeTab,
//           ]}
//           onPress={() => setOrderTypeId(2)}
//         >
//           <Text style={[
//             styles.tabText,
//             orderTypeId === 2 && styles.activeTabText,
//           ]}>
//             Pickup
//           </Text>
//         </TouchableOpacity>
//         </View>
//       </View>

//         {orderTypeId == 1 ? (
//             <View style={styles.section}>
//             <DeliveryAddress address={address} />
//           </View>
//         ) : (
//           <View style={styles.section}>
//           <PickupAddress stall={stall} />
//         </View>
//         )}
//       <View style={styles.section}>
//         <DeliverySlots availableSlots={availableSlots} onSlotChange={handleSlotChange}
//         />
//       </View>


//       {paymentOptions.length > 0 ? (
//   <View style={styles.tabContainer}>
//     <Text style={styles.tabTitle}>Choose Your Order Type</Text>
//     <View style={{flexDirection: 'row', backgroundColor: Colors.White}}>
//       {paymentOptions.map((option) => (
//         <TouchableOpacity
//           key={option.id}
//           style={[
//             styles.tab,
//             selectedPayment === option.paymentOptionCode && styles.activeTab,
//             paymentOptions.length === 1 && {flex: 1}, // full width if only one
//           ]}
//           onPress={() => setSelectedPayment(option.paymentOptionCode)}
//           disabled={paymentOptions.length === 1} // disable press if only one
//         >
//           <Text
//             style={[
//               styles.tabText,
//               selectedPayment === option.paymentOptionCode && styles.activeTabText,
//             ]}
//           >
//             {option.paymentOptionCode.toUpperCase()}
//           </Text>
//         </TouchableOpacity>
//       ))}
//     </View>
//   </View>
// ) : (
//   <Text>Loading...</Text>
// )}

  
//       <View style={styles.section}>
//         <Coupons availableCoupons={availableCoupons}   handleSlotChange={handleCouponChange} couponValue={selectedCoupons}/>
//       </View>

//       {/* <View style={styles.section}>
//         <OrderSummary  couponValue={selectedCoupons?.couponValue} />
//       </View> */}
  
//       <TouchableOpacity style={styles.confirmButton} onPress={placeOrderSummary}>
//         <Text style={styles.buttonText}>Place Order</Text>
//       </TouchableOpacity>
//     </>
//   );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton style={styles.backButton} />
        <Text style={styles.label}>Summary</Text>
                <Text style={styles.label}></Text>

      </View>
      {loading ? (
        <Loader visible={loading} />
      ) : (
        <FlatList
        data={[1]} // Single item to render the header
        keyExtractor={(item) => item.toString()}
        renderItem={() => null}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>

          {/* Tab Bar */}
          <View style={styles.tabContainer}>
           <Text style={styles.tabTitle}>Choose Your Order Type</Text>
            <View style={{flexDirection:'row',backgroundColor:Colors.White}}>
                 <TouchableOpacity
                   style={[
                     styles.tab,
                     orderTypeId === 1 && styles.activeTab,
                   ]}
                   onPress={() => setOrderTypeId(1)}
                 >
                   <Text style={[
                     styles.tabText,
                     orderTypeId === 1 && styles.activeTabText,
                   ]}>
                     Delivery
                   </Text>
                 </TouchableOpacity>
                 <TouchableOpacity
                   style={[
                     styles.tab,
                     orderTypeId === 2 && styles.activeTab,
                   ]}
                   onPress={() => setOrderTypeId(2)}
                 >
                   <Text style={[
                     styles.tabText,
                     orderTypeId === 2 && styles.activeTabText,
                   ]}>
                     Pickup
                   </Text>
                 </TouchableOpacity>
                 </View>
               </View>
         
                 {orderTypeId == 1 ? (
                     <View style={styles.section}>
                     <DeliveryAddress address={address} />
                   </View>
                 ) : (
                   <View style={styles.section}>
                   <PickupAddress stall={stall} />
                 </View>
                 )}
                 {
                  orderTypeId == 1  && 
                  <View style={styles.section}>
                  <DeliverySlots availableSlots={availableSlots} onSlotChange={handleSlotChange} orderTypeId={orderTypeId}
                  />
                </View>
                 }
                   {
                  orderTypeId == 2  && 
                  <View style={styles.section}>
                  <PickUpSlots availableSlots={availableSlots} onSlotChange={handleSlotChange} orderTypeId={orderTypeId}
                  />
                </View>
                 }
          
          
         
         
               {paymentOptions.length > 0 ? (
           <View style={styles.tabContainer}>
             <Text style={styles.tabTitle}>Choose Payment Options</Text>
             <View style={{flexDirection: 'row', backgroundColor: Colors.White}}>
               {paymentOptions.map((option) => (
                 <TouchableOpacity
                   key={option.id}
                   style={[
                     styles.tab,
                     selectedPayment === option.paymentOptionCode && styles.activeTab,
                     paymentOptions.length === 1 && {flex: 1}, // full width if only one
                   ]}
                   onPress={() => setSelectedPayment(option.paymentOptionCode)}
                   disabled={paymentOptions.length === 1} // disable press if only one
                 >
                   <Text
                     style={[
                       styles.tabText,
                       selectedPayment === option.paymentOptionCode && styles.activeTabText,
                     ]}
                   >
                     {option.paymentOptionCode.toUpperCase()}
                   </Text>
                 </TouchableOpacity>
               ))}
             </View>
           </View>
         ) : (
           <Text>Loading...</Text>
         )}
         
           
               <View style={styles.section}>
                 <Coupons availableCoupons={availableCoupons}   handleSlotChange={handleCouponChange} couponValue={selectedCoupons}/>
               </View>
         


             </>
        }
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
      />
      )}
                     <TouchableOpacity style={styles.confirmButton} onPress={placeOrderSummary}>
                 <Text style={styles.buttonText}>Review & Order</Text>
               </TouchableOpacity>

<AlertBox
        visible={isModalVisible}
        onClose={() => setModalVisible(false)} // Only close when the user clicks "Okay"
        title={alertTitle}
        body={alertMessage} // Show OTP sent message
        buttonText="Ok"
      />
    </SafeAreaView>
  );
  
};

export default OrderConfirmation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
    paddingHorizontal: 15,
    paddingVertical: 10,
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
  cartTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    marginBottom: 16,
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: Colors.ButtonGreen,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 15,
    borderRadius:32
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily:Fonts.bold
  },
  section:{
    marginVertical:10
  },

  tabContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: Colors.orderPageBackground,
    padding:15
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: Colors.White,
  },
  activeTab: {
    backgroundColor: Colors.primary, // Active background color
    borderRadius:10
  },
  tabText: {
    color: Colors.Text,
    fontFamily:Fonts.bold
  },
  activeTabText: {
    color: Colors.WhiteText,
    fontFamily:Fonts.semiBold
  },
  tabTitle:{
    fontFamily:Fonts.regular,
    color:Colors.Text,
    marginBottom:12
  }
});