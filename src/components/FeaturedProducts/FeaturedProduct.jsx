import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { apiBase, apiService } from '../../services/api';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Font';
import HomeHeaderRow from '../HomeHeaderRow/HomeHeaderRow';
import { DateFormat } from '../CoreComponent/GlobalServices/DateFormat';
import StorageService from '../../services/StorageService/storageService';

const FeaturedProduct = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [communityId, setCommunityId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const storedCommunityId = await StorageService.getItem('communityId');
      setCommunityId(storedCommunityId);

      const token = await StorageService.getItem('sessionId');
      const inputData = {
        communityId: storedCommunityId,
        currentDate: DateFormat.getCurrentDate(),
      };

      try {
        const response = await apiService.post(
          '/portal/community/featuredproducts',
          inputData,
          token
        );
        if (response?.data?.items) {
          setProducts(response.data.items);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Stall', { code: communityId, slug: item.slug })}
      activeOpacity={0.85}
    >
      <Image
        source={{
          uri: item.itemImagePath
            ? `${apiBase.imagePath}${item.itemImagePath}`
            : 'https://via.placeholder.com/300',
        }}
        style={styles.itemImage}
      />
      <View style={styles.darkOverlay} />
      <View style={styles.detailsContainer}>
        <Text style={styles.itemName}>{item.itemName}</Text>
        <View style={styles.separator} />
        <Text style={styles.price}>{`₹${item.price} / ${item.unit}`}</Text>
      </View>
      {item.stallImagePath && (
        <Image
          source={{ uri: `${apiBase.imagePath}${item.stallImagePath}` }}
          style={styles.stallImage}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <HomeHeaderRow title="Featured Products" />
      <FlatList
        data={products}
        horizontal
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={!loading && <Text style={styles.empty}>No Featured Products</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    backgroundColor: Colors.Background,
  },
  card: {
    width: 342,
    height: 222,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 15,
    marginBottom: 16,
    backgroundColor: Colors.Background,
    elevation: 4,
    shadowColor: Colors.Black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  itemImage: {
    width: '100%',
    height: 222,
    resizeMode: 'cover',
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  detailsContainer: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
  },
  itemName: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.WhiteText,
  },
  price: {
    fontSize: 16,
    color: Colors.WhiteText,
    fontFamily: Fonts.regular,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.Background,
    marginVertical: 3,
  },
  stallImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    position: 'absolute',
    top: 10,
    right: 10,
    borderWidth: 2,
    borderColor: Colors.White,
  },
  empty: {
    paddingHorizontal: 15,
    paddingTop: 20,
    fontSize: 16,
    color: Colors.GrayText,
    fontFamily: Fonts.regular,
  },
});

export default FeaturedProduct;
