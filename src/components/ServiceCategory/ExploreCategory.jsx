import { View, Text, StyleSheet, Dimensions, FlatList, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import userLocation from '../UserLocation/userLocation';
import { apiBase, apiService } from '../../services/api';
import { DateFormat } from '../CoreComponent/GlobalServices/DateFormat';
import BackButton from '../CoreComponent/BackButton/BackButton';
import Images from '../../constants/Images';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Font';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const images = [Images.foodDrink, Images.Beauty, Images.Tution, Images.Professional];


export default function ExploreCategory() {
    const navigation = useNavigation();
    const Location = userLocation();
    const communityId = Location.communityId;
    const [serviceCard, setServiceCard] = useState([]);

    const getDashboardDetails = async () => {
        const inputData = {
            communityId: communityId,
            currentDate: DateFormat.getCurrentDateTime(),
        };

        try {
            const response = await apiService.post(`/portal/service/portal/dashboard`, inputData);
            if (response.data && response.data.Items) {
                setServiceCard(response.data.Items);
            } else {
                console.warn("No Items found in API response.");
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const navToStallHome = (item) => {
        const { ServiceId, Slug, ServiceBehaviorCode } = item;

        if (ServiceBehaviorCode) {
            if (ServiceBehaviorCode === "ItemWise") {
                navigation.navigate('ItemWiseStallsCard', { Slug, ServiceId });
            } else if (ServiceBehaviorCode === "Bookings") {
                navigation.navigate('BookingWiseStallsCard', { Slug, ServiceId });
            }
        }
    };
    // Fetch dashboard details when the component mounts or communityId changes

    useEffect(() => {
        if (communityId) {
            getDashboardDetails();
        }
    }, [communityId]);


    return (

        <SafeAreaView style={styles.container}>
            <BackButton />

            {/* <Ionicons name="arrow-back" size={24} style={styles.icon} onPress={() => navigation.goBack()} /> */}
            <Text style={styles.exploreCategory}>Explore Categories</Text>

            <FlatList
                data={serviceCard}
                keyExtractor={(item, index) => index.toString()}
                numColumns={3}  // Ensure 3 items per row
                renderItem={({ item, index }) => (
                    <TouchableOpacity onPress={() => navToStallHome(item)}>
                        <View style={styles.serviceItem}>
                              <Image
                                             style={styles.categoryImage}
                                             source={
                                               item.ImagePath
                                                 ? { uri: `${apiBase.imagePath}${item.ImagePath}` }
                                                 : images[index % images.length] // Fallback to default image
                                             }/>
                            <Text style={styles.categoryText}>{item.ServiceName}</Text>
                        </View>
                    </TouchableOpacity>


                )}
            />
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({


    container: {
        flex: 1,
        paddingVertical: 15,
        backgroundColor: '#fff',
        paddingHorizontal: 20,


    },
    exploreCategory: {
        fontSize: 24,
        fontFamily:Fonts.bold,
        color: '#292d32',
        marginTop: 18,
    },
    serviceItem: {
        width: (width / 3) - 30, // Ensures 3 per row
        height: 110,  // Consistent height
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: Colors.primary,
        borderRadius: 10,
        margin: 10, // Space between items
    },
    categoryImage: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
        marginBottom: 5,
    },
    categoryText: {
        fontSize: 12,
        fontFamily:Fonts.bold,
        color: '#000',
        textAlign: 'center',
    },
});
