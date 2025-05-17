import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import BackButton from '../../../components/CoreComponent/BackButton/BackButton';
import Colors from '../../../constants/Colors';
import StorageService from '../../../services/StorageService/storageService';
import userLocation from '../../../components/UserLocation/userLocation';
import { apiService } from '../../../services/api';
import Loader from '../../../components/Loader/Loader';
import DropDownPicker from 'react-native-dropdown-picker';
import ProviderFollower from '../ProviderFollower/ProviderFollower';
import Income from '../Income/Income';
import ItemProvider from '../ItemProvider/ItemProvider';
import Fonts from '../../../constants/Font';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProviderDashboard = ({ navigation }) => {
    const [stallList, setStallList] = useState([]);
    const [stallId, setStallId] = useState(0);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [selectedValue, setSelectedValue] = useState(null);
    const [isDataFetched, setIsDataFetched] = useState(false); // Track if data is already fetched

    const Location = userLocation();
    const communityId = Location.communityId;

    // Fetch stall list and set default stall
    const getStallWithStatus = useCallback(async () => {
        if (isDataFetched) return; // Avoid redundant API calls
        try {
            setLoading(true); // Show loader while fetching data
            const token = await StorageService.getItem('sessionId');
            const userId = await StorageService.getItem("userId");
            const inputData = {
                lookups: {
                    ProviderStalls: { default: false }
                },
                filters: {
                    userId,
                    communityId
                }
            };

            const response = await apiService.post('/options/lookup', inputData, token);
            const result = response.data.ProviderStalls || []; // Ensure ProviderStalls is an array

            if (result.length > 0) {
                setStallList(result); // Set the stall list
                setItems(result.map(item => ({ label: item.text, value: item.id }))); // Map to dropdown items

                // Set the default stall if none is selected
                if (stallId === 0) {
                    setStallId(result[0].id);
                    setSelectedValue(result[0].id);
                }
                setIsDataFetched(true); // Mark data as fetched
            } else {
                console.log("No stalls found.");
            }
        } catch (error) {
            console.log("Error fetching stall list:", error);
        } finally {
            setLoading(false); // Hide loader after fetching data
        }
    }, [communityId, stallId, isDataFetched]);

    // Handle store switching
    const handleStallChange = useCallback(async (value) => {
        setSelectedValue(value);
        setStallId(value);
        setLoading(true); // Show loader while switching stores
        try {
            // Simulate fetching data for the selected store
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulated delay
        } catch (error) {
            console.log("Error switching store:", error);
        } finally {
            setLoading(false); // Hide loader after switching
        }
    }, []);

    // Fetch data on initial mount
    useEffect(() => {
        getStallWithStatus();
    }, [getStallWithStatus]);

    // Refresh data when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            if (!isDataFetched) {
                getStallWithStatus();
            }
        }, [getStallWithStatus, isDataFetched])
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Loader */}
            {loading && <Loader visible={loading} />}

            {/* Main Content */}
            {!loading && (
                <View>
                    {/* Header */}
                    <View style={styles.header}>
                        <BackButton replaceTo='MenuScreen' />
                        <Text style={styles.label}> Merchant Dashboard</Text>
                        <Text> </Text>
                    </View>

                    {/* Store Info */}
                    <View style={styles.storeInfo}>
                        <TouchableOpacity style={styles.storeName}>
                            <Text style={styles.storeName}>
                                {stallList.find(item => item.id === stallId)?.text || 'Select Store'}
                            </Text>
                        </TouchableOpacity>

                        <DropDownPicker
                            open={open}
                            value={selectedValue}
                            items={items}
                            setOpen={setOpen}
                            setValue={handleStallChange}
                            setItems={setItems}
                            placeholder="Switch Store"
                            containerStyle={styles.dropdown}
                            selectedItemContainerStyle={styles.selectedItemContainer}
                            dropDownContainerStyle={styles.dropdownContainerStyle}
                            zIndex={2000}
                            showTickIcon={false}
                        />
                    </View>

                    {/* Provider Follower */}
                    <ProviderFollower stallId={selectedValue} />

                    {/* Income and Wallet */}
                    <Income stallId={selectedValue} />

                    {/* Item Provider */}
                    <ItemProvider stallId={selectedValue} />
                </View>
            )}
        </SafeAreaView>
    );
};

export default ProviderDashboard;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        paddingVertical: 13,
        backgroundColor: Colors.Background,
        flex: 1,
    },
    dropdown: {
        marginBottom: 15,
    },
    selectedItemContainer: {
        backgroundColor: '#FEC77D', // Apply highlight color for default & selected
    },
    dropdownContainerStyle: {
        backgroundColor: Colors.Background,
        borderColor: Colors.LightGrey,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    label: {
        fontSize: 18,
         fontFamily:Fonts.bold,
        color: Colors.TextColor,
    },
    storeInfo: {
        marginTop: 20,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    storeName: {
       fontFamily:Fonts.semiBold,
        flex: 1,
    },
});
