import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, SafeAreaView, Share } from 'react-native';
import React from 'react';
import BackButton from '../CoreComponent/BackButton/BackButton';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Font';
import Images from '../../constants/Images';
import StorageService from '../../services/StorageService/storageService';
import { apiService } from '../../services/api';

export default function ReferFriend() {
    const friends = [
    ];

const getReferralText = async () => {
  const token = await StorageService.getItem('sessionId');
  const userId = await StorageService.getItem('userId');
  console.log(userId, token);

  try {
    const response = await apiService.get(`/user/sharereferraltext/${userId}`, token);

    console.log('userId:', response.data);
    if (response.data && response.data.referralText) {
      const ref = response.data.referralText;
      Share.share({ message: ref })
        .then((result) => console.log('Share result:', result))
        .catch((error) => console.error('Share error:', error));
    }

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message || "Unknown error";
    console.error('Error getReferralText:', errorMessage);
  }
};


    const handleSharePress = () => {
      const shareUrl = `https://go-localites-in.app.link/stall?s=`;
      const message = `Check out this stall: ${shareUrl}`;
    
      Share.share({
        message,
        url: shareUrl,
      })
        .then((result) => console.log('Share result:', result))
        .catch((error) => console.error('Share error:', error));
    };
    const renderFriend = ({ item }) => (
        <View style={styles.friendItem}>
            <View style={styles.friendInfo}>
                <Image source={item.image} style={styles.friendImage} />
                <Text style={styles.friendName}>{item.name}</Text>
            </View>
            <TouchableOpacity>
                <Text style={styles.inviteButton}>Invite</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.Background }}>
            <FlatList
                ListHeaderComponent={
                    <View style={styles.container}>
                        {/* Header */}
                        <View style={styles.header}>
                            <BackButton replaceTo="Home" />
                            <Text style={styles.backText}>Back</Text>
                        </View>

                        {/* Banner Section */}
                        <View style={styles.banner}>
                            <Image source={{uri:Images.referfrd}} style={styles.bannerImage} />
                            <Text style={styles.title}>Refer your friend and earn ₹100</Text>
                        </View>

                        {/* Steps Section */}
                        <View style={styles.steps}>
                            <View style={styles.stepItem}>
                                <Image source={{uri:Images.Link}} style={styles.stepIcon} />
                                <View style={styles.stepTextContainer}>
                                    <Text style={styles.stepTitle}>Send Referral</Text>
                                    <Text style={styles.stepDescription}>
                                        Invite friend from localites app through WhatsApp or SMS.
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.stepItem}>
                                <Image source={{uri:Images.FirstOrder}} style={styles.stepIcon} />
                                <View style={styles.stepTextContainer}>
                                    <Text style={styles.stepTitle}>First Order</Text>
                                    <Text style={styles.stepDescription}>
                                        Get your friend to download app with referral code and make their first order.
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.stepItem}>
                                <Image source={{uri:Images.FirstOrder}} style={styles.stepIcon} />
                                <View style={styles.stepTextContainer}>
                                    <Text style={styles.stepTitle}>Ka-Ching ₹₹₹</Text>
                                    <Text style={styles.stepDescription}>
                                        Get ₹100 coupon available at checkout in your next order.
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Share Button */}
                        <TouchableOpacity style={styles.shareButton} onPress={getReferralText}>
                            <Text style={styles.shareButtonText}>Share your invite link</Text>
                        </TouchableOpacity>

                        <Text style={styles.inviteFriendsTitle}>Invite Friends</Text>
                    </View>
                }
                data={friends}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderFriend}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 60 }}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.Background,
        paddingTop: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 16,
    },
    backText: {
        fontSize: 16,
        fontFamily: Fonts.bold,
        color: Colors.Text,
        marginLeft: 8,
    },
    banner: {
        backgroundColor: '#ffe6c7',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    bannerImage: {
        width: 200,
        height: 150,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    title: {
        fontSize: 22,
        fontFamily: Fonts.bold,
        color: Colors.Text,
        textAlign: 'center',
    },
    steps: {
        marginBottom: 20,
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 18,
    },
    stepIcon: {
        width: 24,
        height: 24,
        marginRight: 12,
        marginTop: 3,
    },
    stepTextContainer: {
        flex: 1,
    },
    stepTitle: {
        fontSize: 16,
        fontFamily: Fonts.bold,
        color: Colors.Text,
    },
    stepDescription: {
        fontSize: 13,
        fontFamily: Fonts.regular,
        color: Colors.TextSecondary,
        paddingTop: 4,
    },
    shareButton: {
        backgroundColor: Colors.Black,
        paddingVertical: 15,
        borderRadius: 32,
        alignItems: 'center',
        marginBottom: 24,
    },
    shareButtonText: {
        fontSize: 16,
        lineHeight: 24,
        fontFamily: Fonts.bold,
        color: Colors.WhiteText,
    },
    inviteFriendsTitle: {
        fontSize: 16,
        fontFamily: Fonts.bold,
        color: Colors.Text,
        marginBottom: 12,
    },
    friendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    friendInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    friendImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    friendName: {
        fontSize: 14,
        fontFamily: Fonts.regular,
        color: Colors.Text,
    },
    inviteButton: {
        fontSize: 14,
        fontFamily: Fonts.bold,
        color: Colors.primary,
        paddingHorizontal: 10,
    },
});
