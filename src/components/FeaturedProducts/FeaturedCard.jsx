import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import Colors from "../../constants/Colors";
import Fonts from "../../constants/Font";
import { apiBase } from "../../services/api";

const FeaturedCard = ({ item, onPress }) => {
  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => onPress(item)} activeOpacity={0.85}>
        {/* Full-Width Image with Aspect Ratio */}
        <Image
          source={{
            uri: item.itemImagePath
              ? `${apiBase.imagePath}${item.itemImagePath}`
              : "https://via.placeholder.com/300",
          }}
          style={styles.itemImage}
        />

        {/* Dark Overlay */}
        <View style={styles.darkOverlay} />

        {/* Overlay for Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.itemName}>{item.itemName}</Text>
          <View style={styles.separator} />
          <Text style={styles.price}>{`₹${item.price} / ${item.unit}`}</Text>
        </View>

        {/* Stall Image (Icon) */}
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
  );
};

const styles = StyleSheet.create({
  card: {
    width: 342,
    height: 222,
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 15,
    marginBottom: 16,
    backgroundColor: Colors.Background,
    elevation: 4, // Android shadow
    shadowColor:Colors.Black, // iOS shadow
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

export default FeaturedCard;
