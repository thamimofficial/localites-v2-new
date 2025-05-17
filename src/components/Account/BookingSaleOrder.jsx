import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import StorageService from '../../services/StorageService/storageService';
import { useRoute } from '@react-navigation/native';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Font';
import Loader from '../Loader/Loader';

export default function BookingSaleOrder() {
    const filters = [
        { id: -1, name: 'All' },
        { id: 1, name: 'Booked' },
        { id: 2, name: 'Approved' },
        { id: 3, name: 'Cancelled' },
    ];

    const route = useRoute();
    const { userId } = route.params;
    const [orderStatusId, setOrderStatusId] = useState(-1);
    const [bookingList, setBookingList] = useState([]);
    const [loading, setLoading] = useState(true); // Start with loader visible
    const [filter, setFilter] = useState([]);

    const getBookingStalls = async () => {
        try {
            setLoading(true); // Show loader while fetching data
            const inputData = {
                requestStatusId: -1,
                userId: userId,
            };
            const token = await StorageService.getItem('sessionId');
            const response = await apiService.post(
                `/stallbookingrequest/user`,
                inputData,
                token
            );
            const result = response.data;
            setBookingList(result);
            setFilter(result); // Initialize filter with all bookings
        } catch (error) {
            console.log('Error fetching booking list:', error);
        } finally {
            setLoading(false); // Hide loader after fetching data
        }
    };

    const getFilter = () => {
        if (orderStatusId === -1) {
            setFilter(bookingList);
        } else {
            const filtered = bookingList.filter(
                (order) => order.bookingRequestStatusId === orderStatusId
            );
            setFilter(filtered);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved':
                return '#059669'; // Green
            case 'Booked':
                return '#F59E0B'; // Orange
            case 'Rejected':
                return '#EF4444'; // Red
            default:
                return '#6B7280'; // Gray
        }
    };

    useEffect(() => {
        if (userId) {
            getBookingStalls();
        }
    }, [userId]);

    useEffect(() => {
        getFilter();
    }, [orderStatusId, bookingList]);

    return (
        <ScrollView style={styles.container}>
            {loading ? (
                <Loader Loading={loading} />
            ) : (
                <>
                    {/* Filter Tabs */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filterWrapper}
                    >
                        {filters.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.filterButton,
                                    {
                                        backgroundColor: item.id === orderStatusId ? Colors.primary : Colors.TextInputBackground,
                                    },
                                ]}
                                onPress={() => setOrderStatusId(item.id)}
                            >
                                <Text
                                    style={{
                                        color: item.id === orderStatusId ? '#fff' : '#000',
                                       fontFamily:Fonts.medium,
                                    }}
                                >
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Booking List */}
                    {filter.length > 0 ? (
                        filter.map((order, index) => (
                            <View style={styles.frameParent} key={index}>
                                <View style={styles.frameGroup}>
                                    <View style={[styles.summaryParent, styles.parentFlexBox]}>
                                        <Text style={[styles.summary, styles.summaryTypo]}>
                                            StoreFront:
                                        </Text>
                                        <Text
                                            style={[styles.hairOilShampoo, styles.textTypo1]}
                                            numberOfLines={1}
                                        >
                                            {order.stallName}
                                        </Text>
                                    </View>
                                    <View style={styles.frameContainer}>
                                        <View style={[styles.couponParent, styles.parentFlexBox]}>
                                            <Text style={[styles.coupon, styles.textTypo]}>
                                                Booking Id:
                                            </Text>
                                            <Text style={[styles.text, styles.textTypo]}>
                                                #{order.bookingRequestIdentifier}
                                            </Text>
                                        </View>
                                        <View style={[styles.couponParent, styles.parentFlexBox]}>
                                            <Text style={[styles.coupon, styles.textTypo]}>
                                                Booking Date:
                                            </Text>
                                            <Text style={[styles.text, styles.textTypo]}>
                                                {new Date(order.bookingDate).toLocaleDateString(
                                                    'en-gb',
                                                    {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    }
                                                )}
                                            </Text>
                                        </View>
                                        <View style={[styles.couponParent, styles.parentFlexBox]}>
                                            <Text style={[styles.coupon, styles.textTypo]}>
                                                Booking Time:
                                            </Text>
                                            <Text style={[styles.text, styles.textTypo]}>
                                                {order.bookingTime}
                                            </Text>
                                        </View>
                                        <View style={[styles.couponParent, styles.parentFlexBox]}>
                                            <Text style={[styles.coupon, styles.textTypo]}>
                                                Amount:
                                            </Text>
                                            <Text style={[styles.text, styles.textTypo]}>
                                                ₹{order.amount}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={[styles.tagsParent, styles.parentFlexBox]}>
                                        <View style={styles.tags}>
                                            {/* <View style={[styles.baseBadge, styles.parentFlexBox]}>
                                                <Text style={styles.text1}>View Details</Text>
                                            </View> */}
                                            <View style={[styles.baseBadge, styles.parentFlexBox]}>
                                                <Text
                                                    style={[
                                                        styles.text1,
                                                        {
                                                            color: getStatusColor(order.bookingRequestStatus),
                                                        },
                                                    ]}
                                                >
                                                    {order.bookingRequestStatus}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={{ textAlign: 'center', marginTop: 20 }}>
                            No bookings found.
                        </Text>
                    )}
                </>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    filterWrapper: {
        flexDirection: 'row',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    filterButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 8,
    },
    parentFlexBox: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    summaryTypo: {
        textAlign: 'left',
        fontSize: 16,
        color: '#000',
    },
    textTypo1: {
           fontFamily:Fonts.semiBold,
       
    },
    textTypo: {
        lineHeight: 17,
        fontSize: 12,
        textAlign: 'left',
    },
    summary: {
        lineHeight: 26,
        fontFamily: 'Sora-Regular',
    },
    hairOilShampoo: {
        lineHeight: 22,
        textAlign: 'left',
        fontSize: 16,
        color: '#000',
        overflow: 'hidden',
    },
    summaryParent: {
        alignSelf: 'stretch',
        alignItems: 'center',
        gap: 9,
    },
    coupon: {
        color: '#000',
        fontSize: 12,
        fontFamily: 'Sora-Regular',
    },
    couponParent: {
        gap: 9,
    },
    text: {
        color: '#1a1c21',
           fontFamily:Fonts.bold,
    },
    frameContainer: {
        width: 132,
        gap: 5,
    },
    text1: {
        fontSize: 14,
        lineHeight: 22,
        fontFamily: Fonts.semiBold,
        color: '#059669',
        textAlign: 'center',
    },
    baseBadge: {
        borderRadius: 9999,
        backgroundColor: '#ecfdf5',
        height: 34,
        paddingHorizontal: 14,
        paddingVertical: 6,
    },
    tags: {
        flexDirection: 'row',
        gap: 10,
    },
    tagsParent: {
        justifyContent: 'flex-end',
        gap: 10,
        alignSelf: 'stretch',
        alignItems: 'center',
    },
    frameGroup: {
        gap: 9,
    },
    frameParent: {
        width: '100%',
        borderColor: Colors.borderColor,
        borderWidth: 2,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
});