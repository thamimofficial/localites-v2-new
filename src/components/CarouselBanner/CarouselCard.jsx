import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { apiBase } from '../../services/api';
import Fonts from '../../constants/Font';

const { width: screenWidth } = Dimensions.get('window');

const CarouselCard = ({ item }) => {
  if (!item.stall) return null;

  return (
    <View style={styles.slide}>
      <Image
        source={{ uri: `${apiBase.imagePath}${item.stall.imagePath}` }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.stall.name}</Text>
        <Text style={styles.description} numberOfLines={3}>{item.stall.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  slide: {
    width: screenWidth - 40,
    height: 205,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    marginHorizontal: 15,marginVertical:10,
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
   fontFamily:Fonts.bold,
    marginBottom: 5,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});

export default CarouselCard;
