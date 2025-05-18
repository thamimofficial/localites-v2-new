import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { apiBase, apiService } from '../../services/api';
import Loader from '../Loader/Loader';
import userLocation from '../UserLocation/userLocation';
import { DateFormat } from '../CoreComponent/GlobalServices/DateFormat';
import BackButton from '../CoreComponent/BackButton/BackButton';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Fonts from '../../constants/Font';
import Images from '../../constants/Images';
import StorageService from '../../services/StorageService/storageService';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ItemWiseStallsCard() {
    const navigation = useNavigation();
    const route = useRoute();
    const { Slug, ServiceId } = route.params || {};
    const Location = userLocation();
    const communityId = Location.communityId;

    const [serviceName, setServiceName] = useState('');
    const [stalls, setStalls] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [stallBanners, setStallBanners] = useState({});

    const getServiceBySlug = async () => {
        try {
            const res = await apiService.get(`/portal/service/${Slug}`);
            const result = res.data;

            if (result) {
                setServiceName(result.serviceName);
                getStallDetails({}, ServiceId);
            }
        } catch (error) {
            console.error('Error fetching item-wise stalls:', error);
        }
    };

    const getStallDetails = async (data, serviceId) => {
        if (!serviceId) return;
        try {
            setLoading(true);
            let inputData = {
                serviceId,
                currentDate: DateFormat.getCurrentDateTime(),
                categoryIds: data.categoryIds ? data.categoryIds.join(',') : '',
                isDeliveryEnabled: false,
                isPickupEnabled: false,
                stallName: data.searchText || '',
                communityId: communityId,
            };
            const response = await apiService.post('/portal/service/stalls', inputData);
            let result = response.data.items || [];
            setStalls(result);
        } catch (error) {
            console.error('Error fetching stalls:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (text) => {
        setSearchText(text);
        getStallDetails({ searchText: text }, ServiceId);
    };

    const fetchBannersForStalls = async (stallList) => {
        const token = await StorageService.getItem('sessionId');
        if (!token) return;

        const bannersMap = {};

        await Promise.all(stallList.map(async (stall) => {
            try {
                const response = await apiService.get(`/stallbanner/stall/${stall.id}`, token);
                const banners = response.data;
                if (banners?.length > 0 && banners[0].isActive) {
                    bannersMap[stall.id] = banners[0];
                }
            } catch (error) {
                console.error(`Error fetching banner for stall ${stall.id}:`, error);
            }
        }));

        setStallBanners(bannersMap);
    };

    useEffect(() => {
        if (Slug && communityId) {
            getServiceBySlug();
        }
    }, [Slug, communityId]);

    useEffect(() => {
        if (stalls.length > 0) {
            fetchBannersForStalls(stalls);
        }
    }, [stalls]);

    return (
        <SafeAreaView style={styles.container}>
            {/* <BackButton /> */}
            <View>
                <TouchableOpacity onPress={()=>navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" style={styles.icon} />
                </TouchableOpacity>
            <Text style={styles.Slug}>{serviceName}</Text>
            </View>

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
            ) : stalls.length === 0 ? (
                <Text style={{ textAlign: 'center', marginTop: 20 }}>No stalls available</Text>
            ) : (
                <ScrollView>
                    {stalls.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                navigation.navigate('Stall', {
                                    code: communityId,
                                    slug: item.slug
                                });
                            }}
                        >
                            <View
                                style={[
                                    styles.sellerTile,
                                    item.CommunityRank === 10 && styles.outsideCommunityTile
                                ]}
                            >
                                {stallBanners[item.id] ? (
                                    <Image
                                        source={{ uri: `${apiBase.imagePath}${stallBanners[item.id].imagePath}` }}
                                        style={[
                                            styles.imageIcon,
                                            styles.imageIconPosition,
                                            item.CommunityRank === 10 && styles.orangeShadowImage
                                        ]}
                                    />
                                ) : (
                                    <Image
                                        style={[
                                            styles.imageIcon,
                                            styles.imageIconPosition,
                                            item.CommunityRank === 10 && styles.orangeShadowImage
                                        ]}
                                        resizeMode="cover"
                                        source={{ uri: Images.storefront }}
                                    />
                                )}

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

                                                {item.isVerified && (
                                                    <Image
                                                        source={{ uri: Images.Verify }}
                                                        style={styles.verifyIcon}
                                                    />
                                                )}
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
    Slug: {
        fontSize: 24,
        lineHeight: 38,
        fontFamily: Fonts.bold,
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
