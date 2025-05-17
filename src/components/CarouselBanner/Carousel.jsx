import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, FlatList, Alert } from 'react-native';
import { apiBase, apiService } from '../../services/api';
import CarouselCard from './CarouselCard';
import Loader from '../Loader/Loader';
import StorageService from '../../services/StorageService/storageService';

const { width: screenWidth } = Dimensions.get('window');

const CarouselComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollInterval = useRef(null);
  const currentIndex = useRef(0);

  const fetchData = async () => {
    setLoading(true);
    const communityId = await StorageService.getItem('communityId');
    console.log('communityId',communityId)
    try {
      const body = {
        communityId: 20052,
        currentDate: '2025-01-29',
      };
      const token = await StorageService.getItem('sessionId');

      
      const response = await apiService.post('/portal/stall/featuredstallswithitems', body, token);
      
      if (response?.status === 200) {
        setData(response.data || []);
        //console.log('carousel',response.data)
      } else {
        handleError(response.status);
      }
    } catch (err) {
      console.error('API Error:', err);
      handleError(err.response?.status);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (statusCode) => {
    switch (statusCode) {
      case 401:
        setError('Unauthorized! Please login again.');
        Alert.alert('Session Expired', 'Please log in again.');
        break;
      case 500:
        setError('Server error! Please try again later.');
        break;
      default:
        setError('Something went wrong. Please try again.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      startAutoScroll();
    }
    return () => clearInterval(scrollInterval.current);
  }, [data]);

  const startAutoScroll = () => {
    scrollInterval.current = setInterval(() => {
      if (flatListRef.current && data.length > 0) {
        currentIndex.current = (currentIndex.current + 1) % data.length;
        flatListRef.current.scrollToIndex({
          index: currentIndex.current,
          animated: true,
        });
      }
    }, 3000);
  };

  const onScrollEnd = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const renderItem = ({ item }) => <CarouselCard item={item} />;

  if (loading) {
    return (
      <Loader visible={loading} />
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No featured stalls available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Carousel */}
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.stall?.id?.toString() || Math.random().toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        decelerationRate="fast"
        removeClippedSubviews={true}
        onMomentumScrollEnd={onScrollEnd} // Smooth index update
      />

      {/* Indicators Below Carousel */}
      <View style={styles.indicatorContainer}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[styles.indicator, index === activeIndex ? styles.activeIndicator : null]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginTop: 10, // Space below the carousel
    alignSelf: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: 'orange',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default CarouselComponent;
