import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import Colors from '../../constants/Colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import StorageService from '../../services/StorageService/storageService';
import { apiService } from '../../services/api';
import Loader from '../Loader/Loader';
import Fonts from '../../constants/Font';
export default function ItemSaleOrder() {
    const route = useRoute();
    const navigation = useNavigation()
    const { userId } = route.params;

    const [orderList, setOrderList] = useState([]);
    const [filter, setFilter] = useState([]);
    const [orderstatusId, setStatusId] = useState(-1);
    const [loading, setLoading] = useState(false);

    const filters = [
        { id: -1, name: 'All' },
        { id: 1, name: 'Placed' },
        { id: 2, name: 'Accepted' },
        { id: 6, name: 'Delivered' },
        { id: 7, name: 'Cancelled' },
    ];

    // Fetch order list
    const getOrderList = useCallback(async () => {
        try {
            setLoading(true);
            const inputData = {
                orderStatusId: -1,
                userId: userId,
            };
            const token = await StorageService.getItem('sessionId');
            const response = await apiService.post('/order/query', inputData, token);
            const result = response.data;
            setOrderList(result);
            setFilter(result); // Initialize filter with all orders
        } catch (error) {
            console.log('Error fetching order data:', error);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    // Filter orders based on status
    const getFilter = useCallback(() => {
        if (orderstatusId === -1) {
            setFilter(orderList);
        } else {
            const filtered = orderList.filter(order => order.orderStatusId === orderstatusId);
            setFilter(filtered);
        }
    }, [orderstatusId, orderList]);

    // Fetch orders and apply filter
    useEffect(() => {
        getOrderList();
    }, [getOrderList]);

    useEffect(() => {
        getFilter();
    }, [getFilter]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered':
                return '#059669'; // Green
            case 'Accepted':
                return '#F59E0B'; // Orange
            case 'Placed':
                return '#3B82F6'; // Blue
            case 'Cancelled':
                return '#EF4444'; // Red
            default:
                return '#6B7280'; // Default Gray
        }
    };

    return (
        <ScrollView style={styles.container}>
            {loading && <Loader visible={loading} />}

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterWrapper}
            >
                {filters.map(item => (
                    <TouchableOpacity
                        key={item.id}
                        style={[
                            styles.filterButton,
                            {
                                backgroundColor: item.id === orderstatusId ? Colors.primary : Colors.TextInputBackground,
                            },
                        ]}
                        onPress={() => setStatusId(item.id)}
                    >
                        <Text
                            style={{
                                color: item.id === orderstatusId ? '#fff' : '#000',
                                 fontFamily:Fonts.medium,
                            }}
                        >
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {!loading && filter.length > 0 ? (
                filter.map((order, index) => (
                    <View style={styles.frameParent} key={index}>
                        <View style={styles.frameGroup}>
                            <View style={[styles.summaryParent, styles.parentFlexBox]}>
                                <Text style={[styles.summary, styles.summaryTypo]}>StoreFront:</Text>
                                <Text style={[styles.hairOilShampoo, styles.textTypo1]} numberOfLines={1}>
                                    {order.stallName}
                                </Text>
                            </View>
                            <View style={styles.frameContainer}>
                                <View style={[styles.couponParent, styles.parentFlexBox]}>
                                    <Text style={[styles.coupon, styles.textTypo]}>Order Id:</Text>
                                    <Text style={[styles.text, styles.textTypo]}>#{order.orderIdentifier}</Text>
                                </View>
                                <View style={[styles.couponParent, styles.parentFlexBox]}>
                                    <Text style={[styles.coupon, styles.textTypo]}>Placed Date:</Text>
                                    <Text style={[styles.text, styles.textTypo]}>
                                        {order.placedDate
                                            ? new Date(order.placedDate).toLocaleDateString('en-gb', {
                                                  day: '2-digit',
                                                  month: 'short',
                                                  year: 'numeric',
                                              })
                                            : 'N/A'}
                                    </Text>
                                </View>
                                <View style={[styles.couponParent, styles.parentFlexBox]}>
                                    <Text style={[styles.coupon, styles.textTypo]}>Delivery Type:</Text>
                                    {order.orderTypeId === 1 && (
                                        <Text style={[styles.text, styles.textTypo]}>Delivery</Text>
                                    )}
                                    {order.orderTypeId === 2 && (
                                        <Text style={[styles.text, styles.textTypo]}>Pickup</Text>
                                    )}
                                </View>
                                <View style={[styles.couponParent, styles.parentFlexBox]}>
                                    <Text style={[styles.coupon, styles.textTypo]}>Order Value:</Text>
                                    <Text style={[styles.text, styles.textTypo]}>₹{order.orderAmount}</Text>
                                </View>
                            </View>

                            <View style={[styles.tagsParent, styles.parentFlexBox]}>
                                <View style={styles.tags}>
                                    <TouchableOpacity style={[styles.baseBadge, styles.parentFlexBox]}  onPress={()=>navigation.navigate("OrderDetail",{id : order?.id})}>
                                        <Text style={styles.text}>View Details</Text>
                                    </TouchableOpacity>
                                    <View style={[styles.baseBadge, styles.parentFlexBox]}>
                                        <Text
                                            style={[
                                                styles.text1,
                                                { color: getStatusColor(order.orderStatus) }, // Dynamically set color
                                            ]}
                                        >
                                            {order.orderStatus}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                ))
            ) : (
                !loading && (
                    <Text style={{ textAlign: 'center', marginTop: 20 }}>No orders found.</Text>
                )
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
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
   fontFamily:Fonts.bold,
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
    text: {
        color: '#1a1c21',
   fontFamily:Fonts.bold,
    },
    couponParent: {
        gap: 9,
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
    filterWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 15,
    },
    filterButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
});