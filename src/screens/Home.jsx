
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import FeaturedProduct from '../components/FeaturedProducts/FeaturedProduct'
import CarouselComponent from '../components/CarouselBanner/Carousel'
import Button from '../components/Button/ButtonStyle'
import BottomNavigation from '../navigation/BottomNavigation'
import AppBar from '../components/AppBar/AppBar'
import ServiceCategory from '../components/ServiceCategory/ServiceCategory'
import FeatureServices from '../components/FeatureServices/FeatureServices'
import JourneyCoupon from '../components/JourneyCoupon/JourneyCoupon'
import AsyncStorage from '@react-native-async-storage/async-storage'
import StorageService from '../services/StorageService/storageService'
import Loader from '../components/Loader/Loader'
import FeaturedCarousel from '../components/CoreComponent/FeaturedCarousel/FeaturedCarousel'
import Images from '../constants/Images'
import { useNavigation } from '@react-navigation/native'
import Fonts from '../constants/Font'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import HomeHeaderRow from '../components/HomeHeaderRow/HomeHeaderRow'
import { DateFormat } from '../components/CoreComponent/GlobalServices/DateFormat'
import { apiBase, apiService } from '../services/api'
import { SafeAreaView } from 'react-native-safe-area-context'


const images = [Images.foodDrink, Images.Beauty, Images.Professional, Images.Tution];

const Home = () => {

  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState();


    ///start from service category
  const [serviceCard, setServiceCard] = useState([]);
  const navigation = useNavigation();
  // const comid = StorageService.getItem('communityId')
  // console.log('comid',comid)

    // Feature products start
  const [products, setProducts] = useState([]);
  const [communityId, setCommunityId] = useState(null);


    
    useEffect(()=>{
      fetchKeys();
      getDashboardDetails();
      fetchData();
      fetchFeaturedServices();
    },[])

  const fetchKeys = async () => {
    try {
      const keys = await StorageService.getAllKeys();
      // console.log("All keys StorageService", keys);

      const token = await AsyncStorage.getItem('sessionId');
      setToken(token)
      // console.log('sessionId', storage);
    } catch (error) {
      console.error("Error fetching keys:", error);
    }
  };

  const getLoadingStatus = async (status) => {
    setLoading(status);
  }


  const images = [
    Images?.carousel_default,
    Images?.carousel_banner1,
    Images?.carousel_banner2,
  ];


  const navigate = () => {
    navigation.navigate('ExploreCategory');
  }
  const navToStallHome = (item) => {
    const { ServiceId, Slug, ServiceBehaviorCode } = item;

    console.log("NAV TO:", ServiceBehaviorCode, Slug, ServiceId); // 🪵 Log to check values

    if (ServiceBehaviorCode) {
      if (ServiceBehaviorCode === "ItemWise") {
        navigation.navigate('ItemWiseStallsCard', { Slug, ServiceId });
      } else if (
        ServiceBehaviorCode === "Bookings" ||
        ServiceBehaviorCode === "Listings"
      ) {
        navigation.navigate('BookingWiseStallsCard', { Slug, ServiceId });
      } else {
        console.warn("Unhandled ServiceBehaviorCode:", ServiceBehaviorCode);
      }
    } else {
      console.warn("No ServiceBehaviorCode in item");
    }
  };
  
    const getDashboardDetails = async () => {
      const inputData = {
        communityId: await StorageService.getItem('communityId'),
        currentDate: DateFormat.getCurrentDateTime(),
      };

      try {
        setLoading(true)
        const response = await apiService.post(`/portal/service/portal/dashboard`, inputData);
        if (response.data && response.data.Items) {
          const sortOrders = response.data.Items.sort((a, b) => a.DisplayOrder - b.DisplayOrder);

                 setServiceCard(sortOrders);
          setLoading(false)
        } else {
          console.warn("No Items found in API response.");
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
   

  ///end from service category



 
    const fetchData = async () => {
      const storedCommunityId = await StorageService.getItem('communityId');
      setCommunityId(storedCommunityId);

      const token = await StorageService.getItem('sessionId');
      const inputData = {
        communityId: storedCommunityId,
        currentDate: DateFormat.getCurrentDate(),
      };

      try {
        setLoading(true)
        const response = await apiService.post(
          '/portal/community/featuredproducts',
          inputData,
          token
        );
        if (response?.data?.items) {
          setProducts(response.data.items);
          setLoading(false)
        }

        
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

 

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Stall', { code: communityId, slug: item.slug })}
      activeOpacity={0.85}
    >
      <Image
        source={{
          uri: item.itemImagePath
            ? `${apiBase.imagePath}${item.itemImagePath}`
            : 'https://via.placeholder.com/300',
        }}
        style={styles.itemImage}
      />
      <View style={styles.darkOverlay} />
      <View style={styles.detailsContainer}>
        <Text style={styles.itemName}>{item.itemName}</Text>
        <View style={styles.separator} />
        <Text style={styles.price}>{`₹${item.price} / ${item.unit}`}</Text>
      </View>
      {item.stallImagePath && (
        <Image
          source={{ uri: `${apiBase.imagePath}${item.stallImagePath}` }}
          style={styles.stallImage}
        />
      )}
    </TouchableOpacity>
  );
  // Feature products end
  // feature service start
  const [bookings, setBookings] = useState([]);


    const fetchFeaturedServices = async () => {
      try {
        setLoading(true)
        const storedCommunityId = await StorageService.getItem('communityId');
        const token = await StorageService.getItem('sessionId');

        const inputData = {
          communityId: storedCommunityId,
          currentDate: DateFormat.getCurrentDateTime(),
        };

        const response = await apiService.post(
          `/portal/community/featuredproducts`,
          inputData,
          token
        );

        setBookings(response.data?.booking ?? []);
        setLoading(false)
      } catch (error) {
        console.log("Error fetching featured services", error);
      }
    };
      const handlePress = (item, communityId) => {
    navigation.navigate("Stall", { slug: item.slug, communityId });
  };



 

  // feature service end


  return (


    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>


      <AppBar />
      {loading ?( <Loader visible={loading}/> ):(
   <ScrollView>
        <View style={{ marginBottom: 100 }}>
          <FeaturedCarousel images={images} />
          {/* <CarouselComponent  getLoadingStatus={getLoadingStatus} /> */}

          {/* service category start */}

          <View>
            <View>
              <HomeHeaderRow title="Explore Categories" onActionPress={navigate} actionText="View All" />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
              <View style={styles.categoryCard}>
                {serviceCard.length > 0 ? (

                  serviceCard.map((item, index) => (
                    <TouchableOpacity onPress={() => navToStallHome(item)} key={index} >

                      <View key={index} style={styles.serviceItem}>
                        <Image
                          style={styles.categoryImage}
                          source={
                            item.ImagePath
                              ? { uri: `${apiBase.imagePath}${item.ImagePath}` }
                              : images[index % images.length] // Fallback to default image
                          }
                        />
                        <Text style={styles.categoryText}>{item.ServiceName}</Text>
                      </View>
                    </TouchableOpacity>

                  ))
                ) : (
                  <Text style={styles.noDataText}>No categories available</Text>
                )}


              </View>
            </ScrollView>
          </View>
          {/* service category end */}

          {token && <JourneyCoupon />}

          {/* feature product start */}


          <View style={styles.container}>
            <HomeHeaderRow title="Featured Products" />
            <FlatList
              data={products}
              horizontal
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              showsHorizontalScrollIndicator={false}
              ListEmptyComponent={!loading && <Text style={styles.empty}>No Featured Products</Text>}
            />
          </View>

          {/* <FeaturedProduct /> */}
          {/* feature product end */}
          {/* <FeatureServices /> */}

          {/* feature ser service start  */}
          <View>
            <HomeHeaderRow title="Featured Services" />
            <View>
              <FlatList
                style={styles.Booking}
                contentContainerStyle={styles.frameContainerContent}
                data={bookings}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={styles.card}>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => handlePress(item, item.communityId)}
                    >
                      <Image
                        source={{
                          uri: item.itemImagePath
                            ? `${apiBase.imagePath}${item.itemImagePath}`
                            : "https://via.placeholder.com/300",
                        }}
                        style={styles.itemImage}
                      />

                      <View style={styles.darkOverlay} />

                      <View style={styles.detailsContainer}>
                        <Text style={styles.itemName}>{item.itemName}</Text>
                        <View style={styles.separator} />
                        <Text style={styles.price}>{`₹${item.price}`}</Text>
                      </View>

                      {item.stallImagePath && (
                        <Image
                          source={{
                            uri: `${apiBase.imagePath}${item.stallImagePath}`,
                          }}
                          style={styles.stallImage}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          </View>

          {/* feature ser service end  */}

          {/* <Button title="View All Products" onPress={() => console.log('View All Products')} /> */}
          {/* <Button title="Cart" onPress={() => navigation.navigate('ReviewCart')} /> */}
        </View>
      </ScrollView>
      )}
   
      <BottomNavigation defaultTab="Home" />
    </SafeAreaView>

  )
}

export default Home

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 24,
    // paddingVertical:13
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceItem: {
    alignItems: 'center',
    marginRight: 15, // Space between items
    // backgroundColor: Colors.primary,
    padding: 10, // Add padding for better spacing
    borderRadius: 10,

  },
  categoryImage: {
    width: 60, // Explicit width
    height: 60, // Explicit height
    borderRadius: 30, // Make the image circular
    overflow: "hidden"

  },
  categoryText: {
    alignSelf: "stretch",
    fontSize: 12,
    lineHeight: 17,
    fontFamily: Fonts.bold,
    color: Colors.Text,
    textAlign: "center",
    marginTop: 2
  },
  noDataText: {
    fontSize: 14,
    color: '#888',
  },
  container: {
    paddingVertical: 20,
    backgroundColor: Colors.Background,
  },
  card: {
    width: 342,
    height: 222,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 15,
    marginBottom: 16,
    backgroundColor: Colors.Background,
    elevation: 4,
    shadowColor: Colors.Black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  itemImage: {
    width: '100%',
    height: 222,
    resizeMode: 'cover',
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  detailsContainer: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
  },
  itemName: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: "#ffffff",
  },
  price: {
    fontSize: 16,
    color: "#ffffff",
    fontFamily: Fonts.regular,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.Background,
    marginVertical: 3,
  },
  stallImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    position: 'absolute',
    top: 10,
    right: 10,
    borderWidth: 2,
    borderColor: Colors.White,
  },
  empty: {
    paddingHorizontal: 15,
    paddingTop: 20,
    fontSize: 16,
    color: Colors.GrayText,
    fontFamily: Fonts.regular,
  },
})