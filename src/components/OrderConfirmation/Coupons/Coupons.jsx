import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import Colors from '../../../constants/Colors';
import Fonts from '../../../constants/Font';

const Coupons = ({ availableCoupons, handleSlotChange, couponValue }) => {
    const [selectedCouponId, setSelectedCouponId] = useState(null);

    // Sync with external prop (couponValue) when it changes
    useEffect(() => {
        if (couponValue?.id) {
            setSelectedCouponId(couponValue.id);
        } else {
            setSelectedCouponId(null);
        }
    }, [couponValue]);

    const handleSelectCoupon = (coupon) => {
        const isAlreadySelected = selectedCouponId === coupon.id;

        if (isAlreadySelected) {
            setSelectedCouponId(null);
            handleSlotChange(null);
        } else {
            setSelectedCouponId(coupon.id);
            handleSlotChange(coupon);
        }
    };

    const renderItem = ({ item }) => {
        const isSelected = selectedCouponId === item.id;

        return (
            <TouchableOpacity
                style={[
                    styles.couponButton,
                    isSelected && styles.selectedButton
                ]}
                onPress={() => handleSelectCoupon(item)}
            >
                <Text
                    style={[
                        styles.couponText,
                        isSelected && styles.selectedcouponText
                    ]}
                >
                    {item.couponCode}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {availableCoupons.length > 0 ? (
                <>
                    <Text style={styles.title}>Coupons</Text>
                    <FlatList
                        data={availableCoupons}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                    />
                </>
            ) : (
                <Text style={styles.noCouponText}>No coupons available</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: Colors.orderPageBackground,
        borderRadius: 10,
    },
    title: {
        fontSize: 16,
        fontFamily: Fonts.bold,
        marginBottom: 8,
    },
    couponButton: {
        padding: 10,
        backgroundColor: Colors.White,
        borderRadius: 10,
        marginVertical: 5,
        alignItems: 'center',
    },
    selectedButton: {
        backgroundColor: Colors.primary,
    },
    selectedcouponText: {
        color: Colors.WhiteText,
        fontFamily: Fonts.bold,
    },
    couponText: {
        fontSize: 14,
        fontFamily: Fonts.bold,
        color: Colors.Text,
    },
    noCouponText: {
        fontSize: 14,
        fontFamily: Fonts.medium,
        color: Colors.Text,
        textAlign: 'center',
    },
});

export default Coupons;
