import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { apiBase, apiService } from '../../services/api';
import Fonts from '../../constants/Font';
import AppBar from '../../components/AppBar/AppBar';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../constants/Colors';
import Loader from '../../components/Loader/Loader';
import { useDispatch } from 'react-redux';
import { addCart, reduceCart } from '../../redux/cartSlice';
import CustomizeOptionsModal from '../../components/CustomizeOptionsModal/CustomizeOptionsModal';

import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import StorageService from '../../services/StorageService/storageService';
import { DateFormat } from '../../components/CoreComponent/GlobalServices/DateFormat';
import BackButton from '../../components/CoreComponent/BackButton/BackButton';



const { width } = Dimensions.get('window');
const imageHeight = width * 0.9;

const ProductDetail = ({ route }) => {
  const navigation = useNavigation();
  const { item } = route.params || {};
  const stallitem = item?.stallitem;
  const product = item?.stalltemBatch;
 console.log('Product:', stallitem);
  const dispatch = useDispatch();
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false); // Set to false to show content
  const [images, setImages] = useState();

  const [showQtyBox, setShowQtyBox] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [customizedGroupe, setCustomizedGroupe] = useState([]);
  const [isCustomized, setIsCustomized] = useState(false);
   const [quantity, setQuantity] = useState(0); // ✅ added quantity state
   const [itemData, setItemData] = useState();

   const [stall, setStall] = useState({});
   const [currentContext, setCurrentContext] = useState({ followedUsers: 0 });


   const deliveryTimeUnits = {
    1:"Minutes",
    2:"Hours",
    3:"Days"
   }

  useEffect(() => { 
    const communityIdfech = async () =>{

      const token = await StorageService.getItem('sessionId');
      //console.log('community id from login', token)
      if(token == null){
       navigation.replace('Login')
    }else{
      getStallItemImages();
    }
    }
    communityIdfech()
    getStallDetailsById()
   
    getFollowInfoByUserId();
    setLoading(true); // Set to true to show loader
    console.log('item from PD', item?.stalltemBatch.stallItemId)
  },[])
  // const Images = [
  //   {
  //     id: 1591,
  //     imagePath: 'communities/20052/stallitems/stallitem191124081011.jpeg',
  //     isDefault: true,
  //   },
  //   {
  //     id: 1592,
  //     imagePath: 'communities/20052/stallitems/stallitem191124081106.jpeg',
  //     isDefault: false,
  //   },
  // ];

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  

  const getStallItemImages = async () => {
   // console.log('Fetching images for item:', product.stallItemId);
   const token = await StorageService.getItem('sessionId');
   console.log(token)

    try {
      const response = await apiService.post(`/stallitem/${product?.stallItemId}/images`, // use relative URL if the base URL is already set
        {}, // Empty body
        token
      );
  
    //  console.log('Image Response:', response.data);
      setImages(response.data);
      setLoading(false); // Set to false to hide loader
      return response.data;
    } catch (error) {
      // Improved error handling
      const errorMessage = error.response?.data || error.message || "Unknown error";
      console.error('Error getStallItemImages', errorMessage);
    }
  };
  

const getStallDetailsById = async () => {
 // console.log('Fetching images for item:', product.stallItemId);
  const inputData = {
    stallId: product.stallId,
    currentDate: DateFormat.getCurrentDate(),
  };
  const token = await StorageService.getItem('sessionId');

  try {
    const response = await apiService.post(
      `/portal/stall/${product.stallId}/withcategory/serviceIds`, // corrected URL
      inputData,
      token
    );

    // console.log('Image Response:', response.data);
    // console.log('getStallDetailsById:', response.data.stall);
    setStall(response.data.stall);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message || "Unknown error";
    console.error('Error getStallDetailsById', errorMessage);
  }
};


  const getFollowInfoByUserId = async () => {
    const inputData = {
      userId: 1,
      entityId: product.stallId,
    };

    try {
      const response = await apiService.post(`/portal/follow/query`, inputData);
      const data = response.data;
      // setFollowItem(data.follow);
      setCurrentContext({ followedUsers: data.followedUsers || 0 });
    } catch (error) {
      console.error('Error fetching follow info:', error);
    }
  };

    const addQtyToCart = () => {
     // console.log('Adding to cart:', product);
      dispatch(addCart({ stallId: product?.stallId, item: product }));
      setQuantity((prev) => prev + 1); // ✅ increase quantity
    };
  
    const reduceQtyFromCart = () => {
      dispatch(reduceCart({ stallId: product?.stallId, item: product }));
      setQuantity((prev) => (prev > 1 ? prev - 1 : 0)); // ✅ reduce quantity, not below 0
      if (quantity <= 1) {
        setShowQtyBox(false); // ✅ hide box if quantity is 0
      }
    };

    const handleAddClick = () => {
      if (product?.isCustomized) {
        if (onCustomizeSelect) {
          onCustomizeSelect(item);
        }
      } else {
        setShowQtyBox(true);
        // Delay the addition to the cart to allow state update
        setTimeout(() => {
          addQtyToCart();
        }, 0);
      }
    };
    
  
    const onCustomizeSelect =  (selectedItem) => {  
    
      // console.log('Customized selected:', selectedItem);
      // console.log('Customized selected:', selectedItem.stalltemBatch.stallItemId);
      const stallItemId = selectedItem.stalltemBatch.stallItemId;
      // 👉 Handle navigation to customization screen or modal
       setIsCustomized(selectedItem.stalltemBatch.isCustomized)
      if (selectedItem.stalltemBatch.isCustomized == true) {
          getActiveGroupHeaderDetails(stallItemId)
          setItemData(selectedItem);
          setModalVisible(true);
      }
}

       const onClose = (item) => {
        const batch = item?.stalltemBatch;
        // console.log('onClose:', item);
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
      //  console.log('uid:', uid);
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
        listingPrice:batch?.listingPrice,
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

         const getActiveGroupHeaderDetails = async (stallItemId) => {
          const token = await StorageService.getItem('sessionId');

             try {
               let response = await apiService.get(`/portal/stallitemcustomize/stallitem/${stallItemId}/active`,
    
                token );
              //  console.log('getActiveGroupHeaderDetails:', response.data[0]);
               setCustomizedGroupe(response.data[0])
            //    getAvailableSlotsCallBack(response);
             } catch (error) {
               console.error('Error fetching available slots:', error);
             }
           };
    

  
  if (!product) {
    return (
      <View style={styles.centered}>
        <Text>No product data found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
              <BackButton style={styles.backButton} />
      <AppBar />

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

      {loading ? (
        <Loader visible={loading} />
      ) : (
        <ScrollView>
          {/* Image Carousel */}
          <View style={styles.carouselWrapper}>
          <View style={{left:5}}>

        </View>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {images?.map((img, index) => (
                <View key={img.id || index} style={styles.slide}>
                  <Image
                    source={{ uri: `${apiBase.imagePath}${img.imagePath}` }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </ScrollView>

            {/* Pagination Dots */}
            <View style={styles.pagination}>
              {images?.map((_, index) => (
                <View
                  key={index}
                  style={[styles.dot, activeIndex === index && styles.activeDot]}
                />
              ))}
            </View>
          </View>

          {/* Product Details */}
          <View style={styles.content}>
            <Text style={styles.name}>{product.itemName}</Text>
            <Text style={styles.price}>
              ₹{product.price}  / {product.unit}
            </Text>
           <Text>
           {
            product.listingPrice !== 0  && <Text style={styles.priceStrike}>₹{product.listingPrice} </Text>
           }
           </Text>
         
         <View style={{ flexDirection: 'row', gap:4, marginVertical: 8 }}>
  {stallitem.deliveryTime !== 0 && (
    <>
     <MaterialCommunityIcons
                  name="truck-delivery"
                  size={20}
                  color={Colors.primary}
                />
      <Text style={{ fontFamily:Fonts.medium}}>Delivery:</Text>
        <Text style={{ textAlign: 'right', flexWrap: 'wrap',fontFamily:Fonts.medium }}>
          Est. deliver in {stallitem.deliveryTime} {deliveryTimeUnits[stallitem.deliveryTimeUnits]}
        </Text>
    </>
  )}
</View>



            {/* Highlights */}
            <View style={styles.highlightBox}>
              <View style={styles.highlightItem}>
                <MaterialCommunityIcons
                  name="backup-restore"
                  size={20}
                  color={Colors.Text}
                />
                <Text style={styles.highlightText}>Breathe easy. Returns accepted.</Text>
              </View>
              <View style={styles.highlightItem}>
                <FontAwesome5 name="medal" size={20} color={Colors.Text} />
                <Text style={styles.highlightText}>Best Quality Products</Text>
              </View>
              <View style={styles.highlightItem}>
                <MaterialIcons name="support-agent" size={20} color={Colors.Text} />
                <Text style={styles.highlightText}>24/7 Customer Support</Text>
              </View>
            </View>

            {/* Description */}
            <Text style={styles.aboutThisItem}>About this item</Text>
            <Text style={styles.description}>{product.stallItemDescription}</Text>
            {/* <Text style={styles.stock}>In Stock: {product.currentQuantity}</Text> */}
          </View>


         <View style={{borderTopWidth:0.3, color:Colors.LightGrey}} />
           
          <View style={{padding:16}}>
          <Text style={styles.aboutThisItem}>About the seller</Text>
          </View>

           <View style={styles.innerContainer}>
           
                  <View style={styles.profileRow}>
                    <View style={styles.profileImageContainer}>
                      {/* {console.log('stall.imagePath',stall.imagePath)} */}
                      <Image
                        source={{ uri: `${apiBase.imagePath}${stall.imagePath}`}}
                        style={styles.profileImage}
                      />
                    </View>
          
                    <View style={styles.titleBlock}>
                      <View style={styles.titleRow}>
                        <Text style={styles.title}>{stall.name}</Text>
                        {stall.isVerified && (
                          <MaterialIcons name="verified" size={20} color="#4285f4" />
                        )}
                      </View>
          
                      {stall.communityName && (
                        <View style={styles.locationRow}>
                          <Entypo name="location-pin" size={18} color="#f69516" />
                          <Text style={styles.address}>{stall.communityName}</Text>
                        </View>
                      )}
          
                      <View style={styles.locationRow}>
                        <MaterialCommunityIcons
                          name="heart-circle-outline"
                          size={18}
                          color="#f69516"
                        />
                        <Text style={styles.fansText}>True Fans {currentContext.followedUsers}</Text>
                      </View>
                    </View>
                  </View>
          
                </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryButtonText}>Other items</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.outlineButton}
            onPress={() => navigation.navigate('DirectMessage',{inputId:product.stallId,typeName:'stallId'})}
          >
            <Text style={styles.outlineButtonText}>Contact seller</Text>
          </TouchableOpacity>
        </View>

        </ScrollView>
      )}

      {/* Add to Cart Button */}
      
      
           {/* {console.log('showQtyBox',showQtyBox)}
           {console.log('product?.isCustomized',product?.isCustomized)} */}
                  {showQtyBox && product?.isCustomized ? (
                    <View style={styles.quantityBox}>
                      <TouchableOpacity style={styles.countButton} onPress={reduceQtyFromCart}>
                        <Text style={styles.countText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{quantity}</Text>
                      <TouchableOpacity style={styles.countButton} onPress={addQtyToCart}>
                        <Text style={styles.countText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                    style={styles.cartButton}
                    onPress={handleAddClick}
                  >
                    <MaterialCommunityIcons name="cart-plus" size={20} color={Colors.WhiteText} />
                    <Text style={styles.cartText}>Add to Cart</Text>
                  </TouchableOpacity>
                  )}
    </SafeAreaView>
  );
};

export default ProductDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
   
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselWrapper: {
    width: '100%',
    backgroundColor: Colors.Background,
  },
  slide: {
    width: width,
    padding: 16,
  },
  image: {
    width: '100%',
    height: imageHeight,
    borderRadius: 16,
    backgroundColor: Colors.Background,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.primary,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  name: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    marginBottom: 8,
    color: Colors.Text,
  },
  price: {
    fontSize: 16,
    color: '#222',
    fontFamily: Fonts.semiBold,
    marginBottom: 12,
  },
  priceStrike: {
    fontSize: 14,
    color: Colors.LightGrey,
    fontFamily: Fonts.regular,
    marginBottom: 12,
    textDecorationLine:'line-through'
  },
  description: {
    fontSize: 16,
    textAlign: 'left',
    color: '#555',
    fontFamily: Fonts.regular,
    marginTop: 16,
    marginBottom: 8,
  },
  stock: {
    fontSize: 14,
    color: '#888',
    fontFamily: Fonts.regular,
  },
  highlightBox: {
    backgroundColor: '#eff2f5',
    width: '100%',
    padding: 16,
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 20,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  highlightText: {
    fontSize: 14,
    color: '#333',
    fontFamily: Fonts.regular,
  },
  aboutThisItem: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: Fonts.bold,
  },
  cartButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 32,
    margin: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },

  cartText: {
    fontFamily: Fonts.bold,
    color: Colors.WhiteText,
    fontSize: 16,
  },

  sellerButton: {
    backgroundColor: Colors.primary,
    borderRadius: 32,
    margin: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  sellerText: {
    fontFamily: Fonts.regular,
    color: Colors.WhiteText,
    fontSize: 12,
    paddingVertical:12,
    paddingHorizontal:24
  },

  ContactButton: {
    backgroundColor: Colors.Background,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 32,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  ContactText: {
    fontFamily: Fonts.regular,
    color: Colors.Text,
    fontSize: 12,
    paddingVertical:12,
    paddingHorizontal:24
  },

    quantityBox: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 4,
      width: 90,
      borderColor: '#ccc',
      overflow: 'hidden',
    },
    countButton: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#f69516',
      borderRadius:'50%',
      padding:5
    },
    countText: {
      fontSize: 18,
      fontFamily: Fonts.bold,
      color: 'white',
    },
    quantityText: {
      flex: 1,
      textAlign: 'center',
      fontSize: 16,
      fontFamily: Fonts.bold,
      color: 'black',
    },


    innerContainer: {
      paddingHorizontal: 20,
    },
    profileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    profileImageContainer: {
      borderWidth: 2,
      borderColor: '#eff2f5',
      borderRadius: 50,
      overflow: 'hidden',
      width: 80,
      height: 80,
    },
    profileImage: {
      width: 80,
      height: 80,
    },
    titleBlock: {
      flex: 1,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    title: {
      fontSize: 20,
      fontFamily: 'Sora-Bold',
      color: '#333',
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 2,
    },
    address: {
      fontSize: 14,
      fontFamily: 'Sora-Regular',
      color: '#898F98',
    },
    fansText: {
      color: '#898F98',
      fontFamily: 'Sora-Regular',
      fontSize: 14,
    },
    categories: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 12,
    },
    category: {
      fontSize: 13,
      marginRight: 6,
      marginBottom: 6,
      backgroundColor: '#eee',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 5,
      fontFamily: 'Sora-Regular',
    },
      actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    padding:20
  },
  secondaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: Colors.WhiteText,
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
  outlineButton: {
    backgroundColor: Colors.WhiteText,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  outlineButtonText: {
    color: Colors.primary,
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
});
