import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Font';
import { useNavigation } from '@react-navigation/native';
import Images from '../../constants/Images';
import StorageService from '../../services/StorageService/storageService';
import { apiService } from '../../services/api';

export default function JourneyCoupon() {
    const navigation = useNavigation();




    const [progress, setProgress] = useState(0);

useEffect(() => {
    const fetchJourneyData = async () => {
        try {
            const userId = await StorageService.getItem('userId');
            const token = await StorageService.getItem('sessionId');
            const response = await apiService.get(`/user/dashboard/tasktracker/${userId}`, token);
            const context = response.data;

            const steps = [
                'isUpdateProfile',
                'isFirstOrder',
                'isInviteAFriend',
                'isFreeOrder',
            ];
            const completedSteps = steps.filter(key => context[key]).length;
            const progressValue = (completedSteps / steps.length) * 100;
            setProgress(Math.round(progressValue));
        } catch (error) {
            console.error('Failed to fetch journey progress:', error);
        }
    };

    fetchJourneyData();
}, []);


    return (
        <View style={styles.container}>
            <TouchableOpacity style={[styles.button, styles.journeyButton]} onPress={() => navigation.navigate("JourneyTracker")}>
                <View style={styles.leftSection}>
                    <Image 
                           source={{uri:Images.JourneyCouponImage}}
                           
                    style={styles.icon} />
                    <Text style={styles.text}>Journey Tracker</Text>
                </View>
                <View style={styles.rightSection}>
                    <Text style={styles.percentage}>{progress}%</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        paddingVertical: 11,
        flexDirection: "row",
        justifyContent: "center",
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 10,
        width: "100%",
        height: 64,
        backgroundColor: Colors.primary, // Orange color
        paddingHorizontal: 16,
        elevation: 3, // Shadow effect for Android
        shadowColor: Colors.Black, // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    leftSection: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    rightSection: {
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: Colors.WhiteText,
        borderRadius: 20,
        width: 40,
        height: 40,
    },
    text: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: Fonts.bold,
        color: Colors.WhiteText,
    },
    percentage: {
        fontSize: 12,
        fontFamily: Fonts.bold,
        color: Colors.WhiteText,
    },
    icon: {
        width: 40,
        tintColor: Colors.WhiteText,
        height:40 // Icon color
    },
});