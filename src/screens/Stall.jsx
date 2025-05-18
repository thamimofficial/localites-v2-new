import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Platform, ScrollView, Button, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StallHeader from '../components/StallHeader/StallHeader';
import StallItem from '../components/StallItem/StallItem';
import StallBooking from '../components/StallBooking/StallBooking';
import AppBar from '../components/AppBar/AppBar';
import CustomizeOptionsModal from '../components/CustomizeOptionsModal/CustomizeOptionsModal';
import { apiBase, apiService } from '../services/api';
import { it } from 'date-fns/locale';
import { addCart, reduceCart } from '../redux/cartSlice';
import { useDispatch } from 'react-redux';
import StorageService from '../services/StorageService/storageService';
import { DateFormat } from '../components/CoreComponent/GlobalServices/DateFormat';
import BackButton from '../components/CoreComponent/BackButton/BackButton';
// import StallHeader from './StallHeader';
// import StallItem from '../StallItem/StallItem';
// import StallBooking from '../StallBookingBehavior/StallBooking';


const dummyData = {
    header: {
      groupName: 'Size',
      groupTypeId: 1, // 1 = radio, 2 = checkbox
    },
    details: [
      { id: 1, description: 'Extra Small', isDefault: false },
      { id: 2, description: 'Small', isDefault: true },
      { id: 3, description: 'Medium', isDefault: false },
      { id: 4, description: 'Large', isDefault: false },
    ],
  };


const defaultItem = {
    searchText: "",
    categoryIds: "",
    tagIds: ""
};
const Stall = ({ route, navigation }) => {

    const dispatch = useDispatch();

    const [item, setItem] = useState(defaultItem);
    
    const [itemDetails, setItemDetails] = useState([]); // For StallItem Component
    const [stallBookings, setStallBookings] = useState([]); // For StallBooking Component
    const { code, slug } = route.params;
   console.log("code", code, slug)
    const [responseMessage, setResponseMessage] = useState('');
    const [serviceId, setServiceId] = useState(null);
    const [stallId, setStallId] = useState(null);
    const [activeTab, setActiveTab] = useState('Items');


    const [modalVisible, setModalVisible] = useState(false);
    const [customizedGroupe, setCustomizedGroupe] = useState([]);
    const [isCustomized, setIsCustomized] = useState(false);
    const [itemData, setItemData] = useState();
    const [showQtyBox, setShowQtyBox] = useState(false);
    const [quantity, setQuantity] = useState(0); // ✅ added quantity state
    
    
    
    useEffect(() => {
        const getCommunityByCode = async () => {
            try {
                const response = await fetch('https://api.localites.in/api/portal/validate/community/code', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code })
                });
                const data = await response.json();
                console.log("getCommunityByCode from stall :",data)
                setResponseMessage(data?.message || 'Success');
                if (data?.data) {
                    await AsyncStorage.setItem('imageStorageUrl', data.data.imageStorageUrl);
                }
            } catch (error) {
                console.error('API Error:', error);
                setResponseMessage('Error fetching data');
            }
        };
        getCommunityByCode();
    }, [code]);

    useEffect(() => {
        if (slug) {
            getStallBySlug();
        }
    }, [slug]);

    const getStallBySlug = async () => {
        try {
            const response = await fetch(`https://api.localites.in/api/portal/stalls/${slug}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
       
                if (data?.stall) {
                    setStallId(data.stall.id);
                    getStallItemsByStallId(data.stall.id);
                    getBookingsByStallId(data.stall.id);
                } else {
                    Alert.alert("Stall Not Found", "The requested stall doesn't exist.");
                    navigation.navigate("Home");  // Replace "Home" with your actual home route name
                }
        } catch (error) {
            console.error('API Error:', error);
        }
    };

    const getStallItemsByStallId = async (stallid) => {
        let filters = {
            currentDate:DateFormat.getCurrentDate(),
            categoryIds:"",
            tagIds: "",
            stallId: stallid,
            itemName:  ""
        };
        let inputData = { filters }
        try {
            const response = await fetch('https://api.localites.in/api/portal/stallitembatch/itemsbystall/itemsales', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputData )

              

            });
            const data = await response.json();
            setItemDetails(data)
            
            //console.log('setItemDetails', data);
            if (data.length === 0) {
              console.log('data is empty');
              setActiveTab('Bookings');
            }
            
           // console.log("ItemDetail from getStallItemsByStallId", data)
          
        } catch (error) {
            console.error('API Error:', error);;
        }
    };

    const getBookingsByStallId = async (stallid) => {
        let filters = {
            stallId: stallid
        };
        let inputData = { filters }
        try {
            const response = await fetch('https://api.localites.in/api/portal/stall/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputData)
            });
            const data = await response.json();
            setStallBookings(data)
           // console.log("setStallBookings from getStallItemsByStallId", data)
          
        } catch (error) {
            console.error('API Error:', error);
        }
    };



    const onCustomizeSelect =  (selectedItem) => {
    
           console.log('Customized selected:', selectedItem);
          //  console.log('Customized selected:', selectedItem.stalltemBatch.stallItemId);
            const stallItemId = selectedItem.stalltemBatch.stallItemId;
            // 👉 Handle navigation to customization screen or modal
             setIsCustomized(selectedItem.stalltemBatch.isCustomized)
            if (selectedItem.stalltemBatch.isCustomized == true) {
                getActiveGroupHeaderDetails(stallItemId)
                setItemData(selectedItem);
                setModalVisible(true);
            }
     }

 

      const getActiveGroupHeaderDetails = async (stallItemId) => {
        const token = await StorageService.getItem('sessionId');

         try {
           let response = await apiService.get(`/portal/stallitemcustomize/stallitem/${stallItemId}/active`,

            token);
          console.log('getActiveGroupHeaderDetails:', response.data[0]);
           setCustomizedGroupe(response.data[0])
        //    getAvailableSlotsCallBack(response);
         } catch (error) {
           console.error('Error fetching available slots:', error);
         }
       };

    

       
       
     
      
      
       
       const onClose = (item) => {
        const batch = item?.stalltemBatch;
       console.log('onClose:', item);
       console.log('onClose:', item?.price);
        setModalVisible(false);
    
        if (item?.itemData !== undefined) {
            OrderItemsData(item);
        }
    };
    
    const OrderItemsData = (item) => {
        const OrderLineModifier = item?.selected;
        const itemData = item?.itemData;
        const header = item?.header;
    
        const formattedModifiers = OrderLineModifier.map((itm) => ({
            description: itm.description,
            groupName: header.groupName,
            groupTypeId: header.groupTypeId,
            maxCount: header.maxCount,
            minCount: header.minCount,
            stallItemCustomizeDetailId: itm.id,
            stallItemCustomizeDetailPrice: itm.price,
            stallItemCustomizeHeaderId: itm.stallItemCustomizeHeaderId,
            stallItemId: itm.stallItemId,
        }));

        // Generate UID based on itemId and selected modifier IDs


        // console.log('cartItem:', itemData.stalltemBatch);
        // console.log('header', header);
        // console.log('itemData:', itemData);
       const batch =  itemData.stalltemBatch

       const modifierIds = formattedModifiers.map(mod => mod.stallItemCustomizeDetailId).join('_');
       const uid = `${batch?.id}_${modifierIds}`;
      console.log(' batch?.price:',  batch?.price);

          // 🧮 Calculate final price: base price + modifier total
    const basePrice = batch?.price || 0; // 👈 CHANGED
    const modifiersTotal = OrderLineModifier.reduce((sum, mod) => sum + (mod.price || 0), 0); // 👈 CHANGED
    const finalPrice = basePrice + modifiersTotal; // 👈 CHANGED

    console.log('Base Price:', basePrice); // 👈 CHANGED
    console.log('Modifiers Total:', modifiersTotal); // 👈 CHANGED
    console.log('Final Price:', finalPrice); // 👈 CHANGED

       const stallItem = {
        id: batch?.id,
        uid: uid,
        itemId: batch?.itemId,
        itemName: batch?.itemName,
        price: finalPrice,
        quantity: 0,
        totalPrice: batch?.price,
        unit: batch?.unit,
        imagePath: batch?.imagePath,
       // imageUrl: "https://strgcommkit.blob.core.windows.net/commkit-ctn/communities/20052/stallitems/stallitem090425102522.jpeg",
        stallId: batch?.stallId,
        stallName: batch?.stallName,
        stallItemId: batch?.stallItemId,
        serviceId: batch?.serviceId,
        serviceName: batch?.serviceName,
        isActive: batch?.isActive,
        isCustomized: batch?.isCustomized,
        isPersisted: batch?.isPersisted,
        status: batch?.status,
        currentQuantity: batch?.currentQuantity,
        totalQuantity: batch?.totalQuantity,
        addedOn: batch?.addedOn,
        createdBy: batch?.createdBy,
        createdDate: batch?.createdDate,
        modifiedBy: batch?.modifiedBy,
        modifiedDate:batch?.modifiedDate,
        modifierAmt: 0,
        rev: batch?.rev,
        stallItemActive: batch?.stallItemActive,
        stallItemDescription: batch?.stallItemDescription,
        batch: batch?.batch,
        currentDate: batch?.currentDate,
        communityId: batch?.communityId,
        expiresOn: batch?.expiresOn,
        expiryDate: batch?.expiryDate,
        expiryTime: batch?.expiryTime,
        expiryDateTime: batch?.expiryDateTime,
        customizedDetails: formattedModifiers,
        groupedCustomDetails: [
          {
            key: header.groupName,
            displayModifiers: formattedModifiers
          }
        ]
      };

      
       dispatch(addCart({ stallId: batch?.stallId, item: stallItem }));
        
    };
    
   
      
    
       
     
     
       const reduceQtyFromCart = (batch) => {
         dispatch(reduceCart({ stallId: batch?.stallId, item: batch }));
         setQuantity((prev) => (prev > 1 ? prev - 1 : 0)); // ✅ reduce quantity, not below 0
         if (quantity <= 1) {
        //    setShowQtyBox(false); // ✅ hide box if quantity is 0
         }
       };
     
    

    return (
<SafeAreaView style={styles.container}>
    <BackButton />
    <AppBar />


{/* Customize funtionality */}
    {/* <Button title="Customize Item" onPress={() => setModalVisible(true)} /> */}
    {isCustomized == true ?(
        <CustomizeOptionsModal
        visible={modalVisible}
        onClose={onClose}
        data={customizedGroupe}
        itemData={itemData}
      />
    ) :(
        <></>
    )}
     


    <ScrollView
        stickyHeaderIndices={[1]} // Only tabContainer sticks
        showsVerticalScrollIndicator={false}
    >
        {/* 0 - Stall Header */}
        <View style={styles.headerContainer}>
            <StallHeader stallId={stallId} />
        </View>

        {/* 1 - Sticky tabContainer wrapped in contentWrapper to keep layout */}
        <View style={styles.contentWrapper}>
            <View style={styles.tabContainer}>
                {itemDetails.length > 0 ? (
               <TouchableOpacity 
                    style={[styles.tabButton, activeTab === 'Items' && styles.activeTab]} 
                    onPress={() => setActiveTab('Items')}>
                    <Text style={styles.tabText}>Items</Text>
                </TouchableOpacity>  
                ):(<>
                </>)}

           { stallBookings.length > 0 ? (
                 <TouchableOpacity 
                    style={[styles.tabButton, activeTab === 'Bookings' && styles.activeTab]} 
                    onPress={() => setActiveTab('Bookings')}>
                    <Text style={styles.tabText}>Bookings</Text>
                </TouchableOpacity>
           ):(<></>)}

            </View>
        </View>

        {/* 2 - Actual content stays the same */}
        <View style={styles.contentWrapper}>
            <View style={styles.contentContainer}>
                {activeTab === 'Items' ? (
                    itemDetails.length > 0 ? (
                        
                        <ScrollView style={{ width: '100%',marginVertical:14 }}>
                            {itemDetails.map((item, index) => (
                               <TouchableOpacity key={index} onPress={() => navigation.navigate('ProductDetail', { item })}>
                                <StallItem key={index} item={item} onCustomizeSelect={onCustomizeSelect} />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    ) : (
                        <Text style={styles.noDataText}>No Items Found</Text>
                    )
                ) : (
                    stallBookings.length > 0 ? (
                        <ScrollView style={{ width: '100%' }}>
                            {stallBookings.map((item, index) => (
                            <TouchableOpacity key={index} onPress={() => navigation.navigate('BookingDetail', { item })}>
                                <StallBooking key={index} item={item} />
                            </TouchableOpacity>
                            ))}
                        </ScrollView>
                    ) : (
                        <Text style={styles.noDataText}>No Bookings Found</Text>
                    )
                )}
            </View>
        </View>
    </ScrollView>
</SafeAreaView>

    
    );
};

export default Stall;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
      
    },
    headerContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentWrapper: {
        flex: 3,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 25,
    },
    tabContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        borderRadius: 10,
        backgroundColor:'#fff'
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 10,
    },
    activeTab: {
       borderBottomWidth: 2,
        borderColor:'orange'
    },
    tabText: {
        fontSize: 16,
        color: '#000',
        fontFamily:'Sora-Bold'
    },
    contentContainer: {
        flex: 1,
        alignItems: 'flex-start',
        width: '100%',
        padding:'auto'
    },
    noDataText: {
        fontSize: 18,
        color: 'gray',
        fontFamily:'Sora-Bold'
    }
});
