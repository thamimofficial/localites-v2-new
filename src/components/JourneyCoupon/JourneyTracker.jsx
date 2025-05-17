import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Font';
import { useNavigation } from '@react-navigation/native';
import StorageService from '../../services/StorageService/storageService';
import { apiService } from '../../services/api';
import BackButton from '../CoreComponent/BackButton/BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function JourneyTracker() {
    const navigation = useNavigation();
    const [progress, setProgress] = useState(0); // Track progress percentage
    const [currentContext, setCurrentContext] = useState({
        isUpdateProfile: false,
        isInviteAFriend: false,
        isFirstOrder: false,
        isFreeOrder: false,
        isShowTaskTracker: true,
        profileMessage: "Please enter Address.",
    });

    const steps = [
        { id: 1, title: 'Update Your Profile', key: 'isUpdateProfile', action: () => navigation.navigate('Account') },
        { id: 2, title: 'Place Your First Order', key: 'isFirstOrder', action: () => navigation.navigate('Home') },
        { id: 3, title: 'Invite Friends', key: 'isInviteAFriend', action: () => navigation.navigate('ReferFriend') },
        { id: 4, title: 'Claim Your Free Order', key: 'isFreeOrder', action: () => {} },
    ];

    const calculateProgress = () => {
        const completedSteps = steps.filter(step => currentContext[step.key]).length;
        const totalSteps = steps.length;
        setProgress((completedSteps / totalSteps) * 100);
    };

    useEffect(() => {
        const fetchJourneyData = async () => {
            try {
                const userId = await StorageService.getItem('userId');
                const token = await StorageService.getItem('sessionId');
                const response = await apiService.get(`/user/dashboard/tasktracker/${userId}`, token);
                setCurrentContext(response.data);
            } catch (error) {
                console.error('Error fetching journey tracker data:', error);
            }
        };

        fetchJourneyData();
    }, []);

    useEffect(() => {
        calculateProgress();
        const completedSteps = steps.filter(step => currentContext[step.key]).length;
        const totalSteps = steps.length;
        if (completedSteps === totalSteps) {
            navigation.navigate('JourneyCompleted');
        }
    }, [currentContext]);

    const getNextStep = () => {
        const nextStep = steps.find(step => !currentContext[step.key]);
        return nextStep ? nextStep.title : 'All Steps Completed!';
    };

    return (
        <SafeAreaView style={styles.container}>

            <BackButton/>
            <View style={styles.header}>
                
                <Text style={styles.title}>Track Your Journey to Exclusive Rewards!</Text>
                <View style={styles.progressCircle}>
                    <Text style={styles.progressText}>{Math.round(progress)}%</Text>
                </View>
            </View>

            <ScrollView style={styles.stepsContainer}>
                {steps.map((step, index) => (
                    <TouchableOpacity
                        key={step.id}
                        style={styles.step}
                        onPress={step.action}
                    >
                        <View style={styles.stepLeft}>
                            <View
                                style={[
                                    styles.stepCircle,
                                    currentContext[step.key] && styles.stepCircleCompleted,
                                ]}
                            />
                            {index < steps.length - 1 && <View style={styles.stepLine} />}
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>{step.title}</Text>
                            <Text style={styles.stepDescription}>
                                {step.id === 1 && currentContext.profileMessage}
                                {step.id === 2 && 'Place your first order and enjoy a ₹25 discount!'}
                                {step.id === 3 && 'Invite your friends to join and earn rewards!'}
                                {step.id === 4 && 'Claim a free order when your invited friends place their orders!'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <TouchableOpacity
                style={styles.footerButton}
                onPress={() => {
                    const nextStep = steps.find(step => !currentContext[step.key]);
                    if (nextStep) nextStep.action();
                }}
            >
                <Text style={styles.footerButtonText}>{getNextStep()}</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.Background,
        paddingHorizontal: 24,
        paddingVertical: 11,
    },
    back: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    backText: {
        fontSize: 16,
        fontFamily: Fonts.bold,
        color: Colors.Text,
        marginLeft: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        padding: 20,
        backgroundColor: '#ffe6c7',
        borderRadius: 10,
        height: 215,
        width: '100%',
    },
    title: {
        fontSize: 32,
        fontFamily: Fonts.bold,
        color: Colors.Text,
        flex: 1,
    },
    progressCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: Colors.WhiteText,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressText: {
        fontSize: 16,
        fontFamily: Fonts.bold,
        color: Colors.WhiteText,
    },
    stepsContainer: {
        marginTop: 20,
    },
    step: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    stepLeft: {
        alignItems: 'center',
        marginRight: 10,
    },
    stepCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Colors.Green,
        backgroundColor: Colors.Background,
    },
    stepCircleCompleted: {
        backgroundColor: Colors.Green,
    },
    stepLine: {
        width: 2,
        height: 40,
        backgroundColor: Colors.Green,
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        fontSize: 16,
        fontFamily: Fonts.bold,
        color: Colors.Text,
        marginBottom: 5,
    },
    stepDescription: {
        fontSize: 14,
        fontFamily: Fonts.regular,
        color: Colors.TextSecondary,
    },
    footerButton: {
        marginTop: 20,
        backgroundColor: Colors.primary,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    footerButtonText: {
        fontSize: 16,
        fontFamily: Fonts.bold,
        color: Colors.WhiteText,
       
    },
});