import { StyleSheet, View, ScrollView, Text, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { apiBase, apiService } from '../../services/api';
import PickupAddress from '../../components/OrderConfirmation/PickupAddress/PickupAddress';
import DeliveryAddress from '../../components/OrderConfirmation/DeliveryAddress/DeliveryAddress';
import BookingDeliverySlots from '../../components/BookingDeliverySlots/BookingDeliverySlots';
import Coupons from '../../components/OrderConfirmation/Coupons/Coupons';
import { FlatList } from 'react-native-gesture-handler';
import Colors from '../../constants/Colors';
import BackButton from '../../components/CoreComponent/BackButton/BackButton';
import Fonts from '../../constants/Font';
import { useNavigation } from '@react-navigation/native';

import Loader from '../../components/Loader/Loader';
import StorageService from '../../services/StorageService/storageService';
import TextInputComponent from '../../components/CoreComponent/TextInput/TextInputComponent';
import { DateFormat, GlobalService } from '../../components/CoreComponent/GlobalServices/DateFormat';
import AlertBox from '../../components/CoreComponent/AlertBox/AlertBox';
import { SafeAreaView } from 'react-native-safe-area-context';


// import RazorpayCheckout from 'razorpay-react-native';


//stall id have to come
const StallBookingEntry = ({navigation,route}) => {
  const {bookingId,stallId} = route.params;
  console.log("bookingId , Stall IF",bookingId,stallId)
  const allDeliveryModes = [
    { text: 'Delivery', name: 'deliverymode', value: 'Delivery', checked: true },
    { text: 'Pickup', name: 'deliverymode', value: 'Pickup', checked: false },
  ];
  // const allPaymentOptions = [
  //   { text: 'Cash On Delivery', name: 'paymentoption', value: 'cod', checked: false },
  //   { text: 'Razorpay (UPI, Credit/Debit Card, NetBanking)', name: 'paymentoption', value: 'razorpay', checked: true },
  // ];

  let defaultStall = { address: '', id: 0, name: '', slug: '' };
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


  const defaultItem= {
    bookingDate: "",
    bookingTime: "",
    seatCount: "",
    contactName: "",
    requestNotes: "",
    mobile: "",
    countryCode: "+91",
    bookingTimeDisplay: "",
    totalAmount: 0,
    paymentMode: "razorpay",
    userCouponId: 0,
    couponId: 0,
    couponValueType: 2, //2-Value
    couponValue: 0
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deliveryModes, setDeliveryModes] = useState([]);
  const [stall, setStall] = useState(defaultStall);
  const [currentContext, setCurrentContext] = useState(defaultContext);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [availableCoupons, setAvailableCoupons] = useState([]);

  //this is for address type pickup or delivery
  const [deliverySlotId, setDeliverySlotId] = useState()

  const [selectedSlot, setSelectedSlot] = useState(null); 


  const [selectedCoupons, setSelectedCoupons] = useState();
  
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState('');

  const [item, setItem] = useState(defaultItem)
  const [bookingData, setBookingData] = useState()
  const [userId, setUserId] = useState()
  const [communityId, setCommunityId] = useState();
  const[alertTitle,setAlertTitle] = useState();
  const[alertMessage,setAlertMessage] = useState();
  const[modelVisible,setModalVisible] = useState(false)



  useEffect(() => {
    const FetchDataFromStorage = async () => {
     const userId = await StorageService.getItem("userId")
     const communityId = StorageService.getItem("communityId")

     if(userId && communityId){
       setUserId(userId)
       setCommunityId(communityId)

     }
    }
    FetchDataFromStorage();

    getBookingById();
    getStallById();
    getAvailableSlots();
    getPaymentOptions();
    getAvailableCoupons();
  }, []);

  const handleSlotChange = (slot) => {
    setSelectedSlot(slot);
    console.log('Selected Slot:', slot);
  
  };
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


  const handleItemChange = (data) => {
    setItem(item => {
      return { ...item, ...data }
    });
  };



  const getBookingById = async () => {
 
    try { 
      const response = await apiService.get(`/portal/stall/booking/${bookingId}`, apiBase.token);

      console.log('getBookingById:', response.data);

      setBookingData(response.data)

    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };


  const getStallById = async () => {
 
    try {
      const response = await apiService.get(`/portal/stall/${stallId}`, apiBase.token);
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

 
// const getDefaultAddress = async () => {
//   const token = await StorageService.getItem('sessionId');
//   console.log('token',token);
//   try {
//     const response = await apiService.post('/address/default/query',
//       {}, // If you need to send a body, replace this empty object
//       token
//     );

//    console.log('Default Address Response:', response.data);
//     if (response.data && response.data.id) {
//             setAddress(response.data);
//             setCurrentContext((prevState) => ({
//               ...prevState,
//               addressId: response.data.id > 0 ? response.data.id : 0,
//             }));
//           }
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching default address:', error.response?.data || error.message);
//     throw error;
//   }
// };


 
const getPaymentOptions = async () => {
  const token = await StorageService.getItem('sessionId');

  try {
    const response = await apiService.get(`/paymentoption/active/stall/${stallId}`,
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
    entityId:stallId
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
    let inputData = { stallId: stallId };
    const token = await StorageService.getItem('sessionId');

    try {
      let response = await apiService.post(`/stalldeliveryslot/available`,
        inputData,
        token
      );
     // console.log('API Response:', response.data);
      getAvailableSlotsCallBack(response);
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
      
     //console.log('Filtered Slots:', filteredSlots);
      setAvailableSlots(filteredSlots);
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

const dummy = {
    bookingDate: "2025-04-24",
    bookingTime: "09:00:00",
    communityId: "20052",
    contactName: "Thamim Ansari",
    contactNumber: "+919876543221",
    couponId: 0,
    paymentMode: "razorpay",
    pricePerSeat: 5000,
    requestNotes: "1234",
    seatCount: 1,
    stallBookingId: 1019,
    stallId: 1095,
    userCouponId: 0,
    userId: "11374"
  };
  

  
  // const inputData = {
  //   communityId: communityId,
  //   stallId: bookingData?.stallId,
  //   stallBookingId: bookingData?.id,
  //   userId: userId,
  //   bookingDate: DateFormat.getCurrentDate() ,
  //   bookingTime: DateFormat.getCurrentTime(),
  //   seatCount: item.seatCount,
  //   contactName: item.contactName,
  //   contactNumber: item.countryCode + item.mobile,
  //   requestNotes: item.requestNotes,
  //   pricePerSeat: bookingData?.pricePerSeat,
  //   paymentMode: selectedPayment,
  //   userCouponId: item.userCouponId,
  //   couponId: selectedCoupons?.couponId
  // };

  const bookRequest = async () => {

      // Validation checks
      if (!item.contactName || item.contactName.trim().length < 4) {
        setAlertTitle("Validation Error");
        setAlertMessage("Name must be at least 4 characters long");
        setModalVisible(true)
        return;
      }
    
      if (!item.mobile || item.mobile.trim().length < 10) {
          setAlertTitle("Validation Error");
        setAlertMessage("Phone number must be at least 10 digits");
        setModalVisible(true)
        return;
      }
    
      if (!item.seatCount || item.seatCount < 1) {
          setAlertTitle("Validation Error");
        setAlertMessage("Please select at least 1 seat");
        setModalVisible(true)
        return;
      }
    
      if (!bookingData?.id || !bookingData?.stallId || !bookingData?.pricePerSeat || selectedSlot==null) {
          setAlertTitle("Validation Error");
        setAlertMessage("Booking slot information is missing. Please select a valid slot.");
        setModalVisible(true)
        return;
      }

      
    
    
    const inputData = {
      communityId: communityId,
      stallId: bookingData?.stallId,
      stallBookingId: bookingData?.id,
      userId: userId,
      bookingDate: selectedSlot?.date ,
      bookingTime: selectedSlot?.startTime,
      seatCount: item.seatCount,
      contactName: item.contactName,
      contactNumber: item.countryCode + item.mobile,
      requestNotes: item.requestNotes,
      pricePerSeat: bookingData?.pricePerSeat,
      paymentMode: selectedPayment,
      userCouponId: item.userCouponId,
      couponId: selectedCoupons?.couponId
    };
      
    console.log(" DateFormat.getCurrentDate() ", DateFormat.getCurrentDate() ,DateFormat.getCurrentTime())
    
      console.log('inputData000',inputData)
      console.log('costomerName',item.contactName)
      console.log(' DateFormat.getCurrentDate()', DateFormat.getCurrentDate())
      console.log(' DateFormat.getCurrentTime()',DateFormat.getCurrentTime())
      console.log('select',selectedCoupons)
      console.log('bookingData',bookingData)

console.log("communityId:", communityId, "=>", inputData.communityId);
console.log("stallId:", bookingData?.stallId, "=>", inputData.stallId);
console.log("stallBookingId:", bookingData?.id, "=>", inputData.stallBookingId);
console.log("userId:", userId, "=>", inputData.userId);
console.log("bookingDate:", DateFormat.getCurrentDate(), "=>", inputData.bookingDate);
console.log("bookingTime:", DateFormat.getCurrentTime(), "=>", inputData.bookingTime);
console.log("seatCount:", item.seatCount, "=>", inputData.seatCount);
console.log("contactName:", item.contactName, "=>", inputData.contactName);
console.log("contactNumber:", item.countryCode + item.mobile, "=>", inputData.contactNumber);
console.log("requestNotes:", item.requestNotes, "=>", inputData.requestNotes);
console.log("pricePerSeat:", bookingData?.pricePerSeat, "=>", inputData.pricePerSeat);
console.log("paymentMode:", selectedPayment, "=>", inputData.paymentMode);
console.log("userCouponId:", item.userCouponId, "=>", inputData.userCouponId);
console.log("couponId:", selectedCoupons?.couponId, "=>", inputData.couponId);



navigation.navigate('BookingOrderSummary',{orderData:inputData,selectedCoupons:selectedCoupons})
    
    // const token = await StorageService.getItem('sessionId');
  
    // try {
    //   const response = await apiService.post('/stallbookingrequest/book',
    //     inputData,
    //     token,
    //   );
  
    //  console.log('bookRequest:', response.data);

    //   return response.data;
    // } catch (error) {
    //   console.error('Error fetching getAvailableCoupons:', error.response?.data || error.message);
    //   throw error;
    // }
  };






 



  
  return (
    <SafeAreaView style={styles.container}>
     <View style={styles.header}>
        <BackButton style={styles.backButton} />
        <Text style={styles.label}>Cart</Text>
                <Text style={styles.label}></Text>

      </View>
  
      <FlatList
        data={[1]} // Single item to render the header
        keyExtractor={(item) => item.toString()}
        renderItem={() => null}
        ListHeaderComponent={
          <>
            <TextInputComponent
              placeholder={"Contact Name*"}
              value={item.contactName}
              onChangeText={(text) => handleItemChange({ contactName: text })}
            />
  
            <TextInputComponent 
              placeholder={"Mobile Number*"}
              value={item.mobile}
              onChangeText={(text) => handleItemChange({ mobile: text })}
              keyboardType={'phone-pad'}
              maxLength={10}
            />
  
            <TextInputComponent 
              placeholder={"Seat Count*"}
              value={item.seatCount}
              onChangeText={(text) => handleItemChange({ seatCount: text })}
              keyboardType={'phone-pad'}
            />
  
            <TextInputComponent 
              placeholder={"Notes"}
              value={item.requestNotes}
              onChangeText={(text) => handleItemChange({ requestNotes: text })}
              multiline={true}
            />
            
            <View style={styles.section}>
              <BookingDeliverySlots 
dateFromBook={{stallBookingId: bookingData?.id, duration: bookingData?.durationInMins, maxCapacityPerSlot: bookingData?.maxCapacityPerSlot}}

                availableSlots={availableSlots} 
                onSlotChange={handleSlotChange}
              />
            </View>
  
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
                        paymentOptions.length === 1 && {flex: 1},
                      ]}
                      onPress={() => setSelectedPayment(option.paymentOptionCode)}
                      disabled={paymentOptions.length === 1}
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
              <ActivityIndicator color={Colors.primary} />
            )}
  
            <View style={styles.section}>
              <Coupons 
                availableCoupons={availableCoupons}   
                handleSlotChange={handleCouponChange} 
                couponValue={selectedCoupons}
              />
            </View>
  

          </>
        }
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
      />
                  <TouchableOpacity 
              style={styles.confirmButton} 
              onPress={bookRequest}
            >
              <Text style={styles.buttonText}>Review & Book</Text>
            </TouchableOpacity>
         <AlertBox
        visible={modelVisible}
        onClose={() => setModalVisible(false)} // Only close when the user clicks "Okay"
        title={alertTitle}
        body={alertMessage} // Show OTP sent message
        buttonText="Ok"
      />
    </SafeAreaView>
  );
  
};

export default StallBookingEntry;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  cartTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    marginBottom: 16,
    textAlign: 'center',
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