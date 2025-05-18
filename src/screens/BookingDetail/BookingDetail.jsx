import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { apiBase, apiService } from '../../services/api';
import Fonts from '../../constants/Font';
import Colors from '../../constants/Colors';
import Loader from '../../components/Loader/Loader';
import StorageService from '../../services/StorageService/storageService';
import BackButton from '../../components/CoreComponent/BackButton/BackButton';

const { width } = Dimensions.get('window');

const BookingDetail = ({ route, navigation }) => {
  const { item } = route.params;
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [stall, setStall] = useState({});
  const [currentContext, setCurrentContext] = useState({ followedUsers: 0 });
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(true);

  useEffect(() => {
    const storedToken = StorageService.getItem('sessionId');
    setToken(storedToken);
    console.log('StorageService.getItem',StorageService.getItem('sessionId'))

    const fetchData = async () => {
      try {
        await getStallDetailsById();
        await getFollowInfoByUserId();
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);



  // const images = item?.imagePath 
  //   [
  //       `${apiBase.imagePath}${item.imagePath}`,
  //       `${apiBase.API_BASE}${item.imagePath}`,
  //       `${apiBase.API_BASE}/${item.imagePath}`
  //     ]
    
  const handleScroll = (event) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    if (slide !== activeIndex) {
      setActiveIndex(slide);
    }
  };

  const getStallDetailsById = async () => {
    const token = await StorageService.getItem('sessionId');

    try {
      const response = await apiService.post(
        `/portal/stall/${item.stallId}/withcategory/serviceIds`,
        { stallId: item.stallId, currentDate: new Date().toISOString().split('T')[0] },
        token
      );
      setStall(response.data.stall || {});
    } catch (error) {
      console.error('Error fetching stall details:', error);
    }
  };

  const getFollowInfoByUserId = async () => {
    try {
      const response = await apiService.post(
        '/portal/follow/query',
        { userId: 1, entityId: item.stallId }
      );
      setCurrentContext({
        followedUsers: response.data.followedUsers || 0
      });
    } catch (error) {
      console.error('Error fetching follow info:', error);
    }
  };

  if (loading) {
    return (
      // <View style={styles.loadingContainer}>
        <Loader visible={loading}/>
      // </View>
    );
  }

  return (
    <SafeAreaView  style={styles.container}>

    <ScrollView >
      {/* Image Carousel */}
      {/* <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ref={scrollRef}
      > */}
        {/* {images.map((img, index) => ( */}
         <View style={{left:5}}>
        <BackButton style={styles.backButton} />
        </View>
          <Image
            source={{uri:`${apiBase.imagePath}${item.imagePath}`}}
            style={styles.carouselImage}
            resizeMode="cover"
            onError={() => console.log('Image loading failed')}
          />
     
      {/* // </ScrollView> */}

      {/* Dot Indicators */}
      {/* <View style={styles.pagination}>
        {images.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              activeIndex === i && styles.activeDot
            ]}
          />
        ))}
      </View> */}

      {/* Booking Details */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.price}>₹{item.pricePerSeat}</Text>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={20} color={Colors.Text} />
            <Text style={styles.detailText}>{item.durationInMins} mins</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="people-outline" size={20} color={Colors.Text} />
            <Text style={styles.detailText}>Max {item.maxCapacityPerSlot} Seats</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.description}>
            {item.description || 'No description available'}
          </Text>
        </View>

        {/* About the Seller Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the seller</Text>
          <View style={styles.sellerContainer}>
            <Image
              source= { {uri:`${apiBase.imagePath}${stall.imagePath}`} } 
              style={styles.sellerImage}
            />
            <View style={styles.sellerInfo}>
              <View style={styles.sellerNameRow}>
                <Text style={styles.sellerName}>{stall.name || 'Unknown Seller'}</Text>
                {stall.isVerified && (
                  <MaterialIcons name="verified" size={20} color="#4285f4" />
                )}
              </View>
              
              {stall.communityName && (
                <View style={styles.sellerDetail}>
                  <Entypo name="location-pin" size={16} color={Colors.primary} />
                  <Text style={styles.sellerText}>{stall.communityName}</Text>
                </View>
              )}

              <View style={styles.sellerDetail}>
                <MaterialCommunityIcons
                  name="heart-circle-outline"
                  size={16}
                  color={Colors.primary}
                />
                <Text style={styles.sellerText}>
                  True Fans {currentContext.followedUsers}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryButtonText}>Other items</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.outlineButton}
            onPress={() => navigation.navigate('DirectMessage',{inputId:item.stallId,typeName:'stallId'})}
          >
            <Text style={styles.outlineButtonText}>Contact seller</Text>
          </TouchableOpacity>
        </View>

        {/* Book Now Button */}

   
      </View>
    </ScrollView>

    <View style={{paddingHorizontal:10}}>
        {token ? (
               <TouchableOpacity
               style={styles.primaryButton}
               onPress={() =>navigation.navigate('StallBookingEntry', {bookingId: item.id,stallId: item.stallId })}
             >
               <Text style={styles.primaryButtonText}>Book Now</Text>
             </TouchableOpacity>
        ):(
     <TouchableOpacity
     style={styles.primaryButton}
     onPress={() =>  navigation.navigate('Login')}
   >
     <Text style={styles.primaryButtonText}>Book Now</Text>
   </TouchableOpacity>
        )}
        </View>
 </SafeAreaView> 
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WhiteText,
  },
  loadingContainer: {
    flex: 1,
  },
  carouselImage: {
    width: width,
    height: width * 0.8,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.LightGrey,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.primary,
    width: 12,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.Text,
    marginBottom: 4,
  },
  price: {
    fontSize: 22,
    fontFamily: Fonts.bold,
    color: Colors.Text,
    marginBottom: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 6,
    fontFamily: Fonts.regular,
    color: Colors.Text,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.Text,
    marginBottom: 12,
  },
  description: {
    fontFamily: Fonts.regular,
    color: Colors.Text,
    lineHeight: 22,
  },
  sellerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  sellerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: Colors.LightGrey,
  },
  sellerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  sellerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  sellerName: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.Text,
    marginRight: 6,
  },
  sellerDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sellerText: {
    marginLeft: 6,
    fontFamily: Fonts.regular,
    color: Colors.Text,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
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
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  primaryButtonText: {
    color: Colors.WhiteText,
    fontFamily: Fonts.bold,
    fontSize: 16,
  },
});

export default BookingDetail;