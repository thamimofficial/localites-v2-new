import { View, Image, StyleSheet, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import HomeHeaderRow from "../HomeHeaderRow/HomeHeaderRow";
import { apiBase, apiService } from "../../services/api";
import userLocation from "../UserLocation/userLocation";
import { DateFormat } from "../CoreComponent/GlobalServices/DateFormat";
import Colors from "../../constants/Colors";
import Fonts from "../../constants/Font";
import { useNavigation } from "@react-navigation/native";
import StorageService from "../../services/StorageService/storageService";
export default function FeatureServices() {
  const [bookings, setBookings] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchFeaturedServices = async () => {
      try {
        const storedCommunityId = await StorageService.getItem('communityId');
        const token = await StorageService.getItem('sessionId');

        const inputData = {
          communityId: storedCommunityId,
          currentDate: DateFormat.getCurrentDateTime(),
        };

        const response = await apiService.post(
          `/portal/community/featuredproducts`,
          inputData,
          token
        );

        setBookings(response.data?.booking ?? []);
      } catch (error) {
        console.log("Error fetching featured services", error);
      }
    };

    fetchFeaturedServices();
  }, []);

  const handlePress = (item, communityId) => {
    navigation.navigate("Stall", { slug: item.slug, communityId });
  };

  return (
    <View>
      <HomeHeaderRow title="Featured Services" />
      <View>
        <FlatList
          style={styles.Booking}
          contentContainerStyle={styles.frameContainerContent}
          data={bookings}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => handlePress(item, item.communityId)}
              >
                <Image
                  source={{
                    uri: item.itemImagePath
                      ? `${apiBase.imagePath}${item.itemImagePath}`
                      : "https://via.placeholder.com/300",
                  }}
                  style={styles.itemImage}
                />

                <View style={styles.darkOverlay} />

                <View style={styles.detailsContainer}>
                  <Text style={styles.itemName}>{item.itemName}</Text>
                  <View style={styles.separator} />
                  <Text style={styles.price}>{`₹${item.price}`}</Text>
                </View>

                {item.stallImagePath && (
                  <Image
                    source={{
                      uri: `${apiBase.imagePath}${item.stallImagePath}`,
                    }}
                    style={styles.stallImage}
                  />
                )}
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  frameContainerContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 15,
    // paddingHorizontal: 24,
    paddingVertical: 13,
  },

  Booking: {
    flex: 1,
    maxWidth: "100%",
    width: "100%"
  },
  card: {
    width: 342,
    height: 222,
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 15,
    marginBottom: 16,
    backgroundColor: Colors.Background,
    elevation: 4, // Android shadow
    shadowColor: Colors.Black, // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  itemImage: {
    width: "100%",
    height: 222,
    resizeMode: "cover",
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  detailsContainer: {
    position: "absolute",
    bottom: 10,
    left: 20,
    right: 20,
  },
  itemName: {
    fontSize: 18,
    fontFamily: Fonts.bold, // Make sure the font is loaded correctly
    color: Colors.WhiteText,
  },
  price: {
    fontSize: 16,
    color: Colors.WhiteText,
    fontFamily: Fonts.regular, // Same here
  },
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: Colors.Background,
    marginVertical: 3,
  },
  stallImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    position: "absolute",
    top: 10,
    right: 10,
    borderWidth: 2,
    borderColor: Colors.White,
  },

});
