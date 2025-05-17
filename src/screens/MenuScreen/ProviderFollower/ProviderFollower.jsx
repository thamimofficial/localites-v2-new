import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import Images from '../../../constants/Images'
import Fonts from '../../../constants/Font'
import { useRoute } from '@react-navigation/native';
import { apiService } from '../../../services/api';
import StorageService from '../../../services/StorageService/storageService';

export default function ProviderFollower({ stallId }) {



    const [follower, setFollower] = useState('');

    const getFollowers = async () => {
        try {
            const id = stallId;
            const token = await StorageService.getItem('sessionId');

            const response = await apiService.get(`/follow/stall/${id}/count`, token);
            const result = response.data;
            setFollower(result)
        } catch (error) {
            console.log("follower not fetching"), error
        }
    }

    useEffect(() => {
        if (stallId) {
            getFollowers();
        }
    }, [stallId])
    return (
        <View>

            {
                follower && 
                <TouchableOpacity style={styles.trueFansBox} >

                <Image source={{ uri: Images.truefans }} height={24} width={24} />
                <Text style={styles.fanCount}><Text style={{ fontFamily: Fonts.bold }}>{follower.followersCount}</Text> True Fans</Text>
                {/* <Icon name="chevron-forward" size={18} color="#888" /> */}
            </TouchableOpacity> 
            }
             </View>
    )
}

const styles = StyleSheet.create({
    trueFansBox: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 10,
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        elevation: 1,
    },
    fanCount: {
        flex: 1,
        fontSize: 15,
        color: '#333',
        fontFamily: Fonts.regular,
    },
})