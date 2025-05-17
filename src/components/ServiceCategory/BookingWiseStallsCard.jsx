import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { apiBase, apiService } from '../../services/api';
import userLocation from '../UserLocation/userLocation';
import { DateFormat } from '../CoreComponent/GlobalServices/DateFormat';
import Loader from '../Loader/Loader';
import BackButton from '../CoreComponent/BackButton/BackButton';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Images from '../../constants/Images';
import Fonts from '../../constants/Font';



const { width } = Dimensions.get('window'); // Get device width for responsiveness

export default function BookingWiseStallsCard() {
    const route = useRoute();
    const { Slug, ServiceId } = route.params || {};
    const Location = userLocation();
    const communityId = Location.communityId;
    const navigation = useNavigation();

    const [serviceName, setServiceName] = useState('');
    const [loading, setLoading] = useState(true);
    const [bookingStalls, setBookingStalls] = useState([]);
    const [searchText, setSearchText] = useState('');

    const getServiceBySlug = useCallback(async () => {
        try {
            const response = await apiService.get(`/portal/service/${Slug}`);
            setServiceName(response.data?.serviceName || '');
            getBookingStalls({}, ServiceId);
        } catch (error) {
            console.error("Error fetching service", error);
        }
    });

    const getBookingStalls = useCallback(async (data, serviceId) => {
        if (!serviceId) return;
        setLoading(true);
        try {
            const response = await apiService.post('/portal/service/stalls', {
                serviceId,
                currentDate: DateFormat.getCurrentDateTime(),
                communityId,
                stallName: data.stallName || ""
            });
            setBookingStalls(response.data.items || []);
        } catch (error) {
            console.error("Error fetching booking stalls:", error);
        } finally {
            setLoading(false);
        }
    });

    const handleSearch = (text) => {
        setSearchText(text);
        getBookingStalls({ stallName: text }, ServiceId);
    };

    useEffect(() => {
        if (Slug && communityId) {
            getServiceBySlug();
        }
    }, [Slug,communityId]);


  
    return (
        <View style={styles.container}>
            <BackButton/>
            <Text style={styles.Slug}>{serviceName}</Text>

            <View style={styles.searchContainer}>
            <TextInput
                value={searchText}
                onChangeText={handleSearch}
                placeholder="Search"
                placeholderTextColor="#999"
                style={styles.search}
            />
            <EvilIcons name="search" size={24} color="black" style={styles.searchIcon} />
        </View>
                    {loading ? (
                <Loader visible={loading} />
            ) : bookingStalls.length === 0 ? (
                <Text style={{ textAlign: 'center', marginTop: 20 }}>No stalls available</Text>
            ) : (
                <ScrollView>
                    {bookingStalls.map((item, index) => (
                        <TouchableOpacity key={index} onPress={() => {navigation.navigate('Stall', { code:communityId, slug:item.slug })}}>
                            <View
                                style={[
                                    styles.sellerTile,
                                    item.CommunityRank === 10 && styles.outsideCommunityTile
                                ]}
                            >
                                <Image
                                    style={[
                                        styles.imageIcon,
                                        styles.imageIconPosition,
                                        item.CommunityRank === 10 && styles.orangeShadowImage
                                    ]}
                                    resizeMode="cover"
                                    source={{uri:Images.storefront}}
                                />
                                <View style={[styles.sellerTileInner, styles.imageIconPosition]}>
                                    <View style={styles.groupParent}>
                                        <View style={styles.groupChildLayout}>
                                            <View style={[styles.groupChild, styles.groupChildLayout]} />
                                            <Image
                                                style={styles.image7Icon}
                                                resizeMode="cover"
                                                source={{ uri: `${apiBase.imagePath}${item.imagePath}` }}
                                            />
                                        </View>

                                        <View style={styles.frameParent}>
                                            <View style={[styles.sellerNameParent, styles.frameWrapperFlexBox]}>
                                                <Text
                                                    style={[
                                                        styles.sellerName,
                                                        styles.offTypo,
                                                        item.CommunityRank === 10 && styles.orangeShadowText
                                                    ]}
                                                >
                                                    {item.name}
                                                </Text>
                                              
                                                {item.isVerified && <Image source={{uri:Images.Verify}} style={styles.verifyIcon} />}
                                            </View>

                                            <View style={[styles.frameGroup, styles.frameWrapperFlexBox]}>
                                                <View style={[styles.locationParent, styles.frameWrapperFlexBox]}>
                                                    <Text style={styles.location}>Delivery</Text>
                                                    <Image
                                                        width={16}
                                                        height={16}
                                                        source={item.isDeliveryEnabled ? Images.tickcircle : Images.closecircle}
                                                    />
                                                </View>

                                                <View style={[styles.locationParent, styles.frameWrapperFlexBox]}>
                                                    <Text style={styles.location}>Pickup</Text>
                                                    <Image
                                                        width={16}
                                                        height={16}
                                                        source={item.isPickupEnabled ? Images.tickcircle : Images.closecircle}
                                                    />
                                                </View>
                                              
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 15,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
    },
    Slug: {
        fontSize: 24,
        lineHeight: 38,
    fontFamily:Fonts.semiBold,
        color: "#292d32",
        textAlign: "left"
    },
    searchContainer: {
        position: 'relative',
        marginBottom: 20,
    },
    search: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    searchIcon: {
        position: 'absolute',
        right: 15,
        top: 12,
    },
    imageIconPosition: {
        borderRadius: 10,
        top: "50%",
        position: "absolute"
    },
    groupChildLayout: {
        height: 42,
        width: 42
    },
    frameWrapperFlexBox: {
        alignItems: "center",
        flexDirection: "row"
    },
    offTypo: {
   fontFamily:Fonts.bold,
        textAlign: "left"
    },
    imageIcon: {
        marginTop: -106,
        right: "0%",
        left: "0%",
        maxWidth: "100%",
        height: 167,
        overflow: "hidden",
        width: "100%"
    },
    groupChild: {
        top: 0,
        left: 0,
        borderRadius: 50,
        backgroundColor: "#eff2f5",
        position: "absolute"
    },
    image7Icon: {
        top: 2,
        left: 2,
        borderRadius: 45,
        width: 38,
        height: 38,
        position: "absolute"
    },
    sellerName: {
        fontSize: 14,
        lineHeight: 20,
        color: "#1a1c21",
        textAlign: "left"
    },
    sellerNameParent: {
        gap: 3,
        alignSelf: "stretch"
    },
    location: {
        fontSize: 12,
        lineHeight: 17,
        fontFamily: "Sora-Regular",
        color: "#484d57",
        textAlign: "left"
    },
    locationParent: {
        gap: 5
    },
    frameGroup: {
        gap: 7,
        alignSelf: "stretch"
    },
    frameParent: {
        width: 177,
        gap: 1
    },
    groupParent: {
        gap: 9,
        flexDirection: "row"
    },
    sellerTileInner: {
        marginTop: 21,
        width: "94.83%",
        right: "2.59%",
        left: "2.59%",
        shadowColor: "rgba(0, 0, 0, 0.15)",
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowRadius: 35,
        elevation: 35,
        shadowOpacity: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingVertical: 12,
        justifyContent: "center",
        flexDirection: "row"
    },
    sellerTile: {
        flex: 1,
        height: 212,
        width: "100%",
        alignSelf: "stretch",
        marginBottom: 15, // Add spacing between items
    },
    outsideCommunityTile: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 6, // Android shadow
        borderRadius: 12,
        shadowColor: "orange", // Add orange shadow
    },
 
    orangeShadowImage: {
        shadowColor: "orange", // Add orange shadow to image
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 6,
    },
});


