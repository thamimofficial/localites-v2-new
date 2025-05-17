import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet, Dimensions, ScrollView, Alert } from 'react-native';
import { apiBase } from '../../services/api';
import Fonts from '../../constants/Font';
import Colors from '../../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import StorageService from '../../services/StorageService/storageService';

const { width } = Dimensions.get('window');



const StallBooking = ({item}) => {
    const navigation = useNavigation()
   // console.log("My data from stall",item);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [token, setToken] = useState()
    // const item = {
    //     communityId: 20052,
    //     stallId: 1116,
    //     name: "Seller Workshops",
    //     description: "Setting up a new business or looking for business networking in your area? Sign up for our 4-hour intense business workshop - Walk in with an idea and walk out with a fully set up business!",
    //     durationInMins: 240,
    //     pricePerSeat: 2999.00,
    //     maxCapacityPerSlot: 10,
    //     allowBookingBeforeNDays: 3,
    //     maxSeatPerBooking: 1,
    //     venueDetail: "Localites HQ, Gandhipuram",
    //     unit: "Per Session",
    //     stopBookingBeforeNDays: 1,
    //     imagePath: "communities/20052/stallbookings/stallbooking061124092625.jpeg",
    //     stallName: "Localites MerchStore",
    //     createdDate: "2024-08-30",
    //     modifiedDate: "2024-11-06",
    //     id: 1043,
    //     status: 1,
    //     isActive: true
    // };

    useEffect(()=>{
        const loadStorage = async () => {
            const storedToken = await StorageService.getItem('sessionId');
            setToken(storedToken);
            console.log('toekn from stallbooking',token)
          };
      
          loadStorage();

       

    },[])

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.cardContainer}>
                <View> 
                <TouchableOpacity onPress={() => setImageModalVisible(true)}>
                    <Image source={{ uri: `${apiBase.imagePath}${item.imagePath}` }} style={styles.image} />
                </TouchableOpacity>
                <View style={styles.detailsContainer}>
                    <Text style={styles.title}>{item.name}</Text>
                    <Text style={styles.price}>₹{item.pricePerSeat}</Text>
                    <Text style={styles.description} numberOfLines={2} >{item.description}</Text>
                    <Text style={styles.detail}><Text style={styles.bold}>Total Time:</Text> {item.durationInMins} mins</Text>
                    <Text style={styles.detail}><Text style={styles.bold}>Unit:</Text> 
                     {item.unit}</Text>
                 
                </View>
                </View>
               

                <View style={styles.stallNameRow}>
                        {/* <Text style={styles.stallName}>{item.stallName}</Text> */}
                        {console.log("token",token)}
                        {token ? (
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('StallBookingEntry', { bookingId: item.id,stallId: item.stallId })}>
                            <Text style={styles.buttonText}>Book Now</Text>
                        </TouchableOpacity>
                        ) : (
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.buttonText}>Book Now</Text>
                        </TouchableOpacity>
                        )}


                    </View>
            </View>

            <Modal visible={imageModalVisible} transparent={true} onRequestClose={() => setImageModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <Image source={{ uri: `${apiBase?.imagePath}${item?.imagePath}` }} style={styles.modalImage} />
                    <TouchableOpacity onPress={() => setImageModalVisible(false)} style={styles.closeButton}>
                        <Text style={styles.closeText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    cardContainer: {
        width: "100%",
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        borderWidth:1,
        borderColor:Colors.BorderColor
    },
    image: {
        width: '100%',
        height: width * 0.5,
        borderRadius: 10,
    },
    detailsContainer: {
        marginTop: 15,
    },
    title: {
        fontSize: 20,
        fontFamily:Fonts.bold,
        marginBottom: 5,
    },
    price: {
        fontSize: 18,
        fontFamily:Fonts.bold,
        color: Colors.Text
    },
    detail: {
        fontSize: 16,
        color: 'gray',
        marginTop: 5,
        fontFamily:Fonts.regular,
    },
    bold: {
        fontFamily:Fonts.bold,
    },
    description: {
        fontSize: 14,
        color: '#333',
        marginVertical: 10,
        fontFamily:Fonts.regular,
    },
    venue: {
        fontSize: 14,
        textAlign: 'center',
        color: '#555',
    },
    stallNameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: 10,
    },
    stallName: {
        fontSize: 14,
        backgroundColor: 'orange',
        color: 'white',
        padding: 8,
        borderRadius: 5,
        textAlign: 'center',
        fontFamily:Fonts.bold,
    },
    button: {
        backgroundColor: Colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 32,
        
    },
    buttonText: {
        color: 'white',
        fontFamily:Fonts.bold,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    modalImage: {
        width: width * 0.8,
        height: width * 0.6,
        borderRadius: 10,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    closeText: {
        fontSize: 16,
     fontFamily:Fonts.bold,
        color: 'black',
    },
});

export default StallBooking;
