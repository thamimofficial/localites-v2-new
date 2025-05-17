import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import HomeHeaderRow from '../HomeHeaderRow/HomeHeaderRow';
import { apiBase, apiService } from '../../services/api';
import { DateFormat } from '../CoreComponent/GlobalServices/DateFormat';
import userLocation from '../UserLocation/userLocation';
import { useNavigation } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import Images from '../../constants/Images';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Font';
import StorageService from '../../services/StorageService/storageService';

const images = [Images.foodDrink, Images.Beauty, Images.Professional, Images.Tution];

console.log("uimage",images)
export default function ServiceCategory() {
  const navigation = useNavigation();
  const Location = userLocation();
  const communityId = Location.communityId;
  const [serviceCard, setServiceCard] = useState([]);


useEffect(()=>{
  const getDashboardDetails = async () => {
         const inputData = {
             communityId: await StorageService.getItem('communityId'),
             currentDate: DateFormat.getCurrentDateTime(),
         };
 
         try {
             const response = await apiService.post(`/portal/service/portal/dashboard`, inputData);
             if (response.data && response.data.Items) {
                 setServiceCard(response.data.Items);
             } else {
                 console.warn("No Items found in API response.");
             }
         } catch (error) {
             console.error('Error fetching data:', error);
         }
     };
     getDashboardDetails();
},[])
 
   

  const navigate = () => {
    navigation.navigate('ExploreCategory');
  }




  return (
    <View>
      <View>
        <HomeHeaderRow title="Explore Categories" onActionPress={navigate} actionText = "View All"/>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
        <View style={styles.categoryCard}>
          {serviceCard.length > 0 ? (

            serviceCard.map((item, index) => (
              <TouchableOpacity onPress={() => navToStallHome(item)} key={index} >

                <View key={index} style={styles.serviceItem}>
                  <Image
                    style={styles.categoryImage}
                    source={
                      item.ImagePath
                        ? { uri: `${apiBase.imagePath}${item.ImagePath}` }
                        : images[index % images.length] // Fallback to default image
                    }
                  />
                  <Text style={styles.categoryText}>{item.ServiceName}</Text>
                </View>
              </TouchableOpacity>

            ))
          ) : (
            <Text style={styles.noDataText}>No categories available</Text>
          )}


        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({

  scrollContainer: {
    paddingHorizontal: 24,
    // paddingVertical:13
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceItem: {
    alignItems: 'center',
    marginRight: 15, // Space between items
    // backgroundColor: Colors.primary,
    padding: 10, // Add padding for better spacing
    borderRadius: 10,

  },
  categoryImage: {
    width: 60, // Explicit width
    height: 60, // Explicit height
    borderRadius: 30, // Make the image circular
    overflow: "hidden"

  },
  categoryText: {
    alignSelf: "stretch",
    fontSize: 12,
    lineHeight: 17,
    fontFamily: Fonts.bold,
    color: Colors.Text,
    textAlign: "center",
    marginTop:2
  },
  noDataText: {
    fontSize: 14,
    color: '#888',
  },
});


