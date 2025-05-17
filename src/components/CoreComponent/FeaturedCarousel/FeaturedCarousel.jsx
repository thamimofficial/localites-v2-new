import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';
import Colors from '../../../constants/Colors';

const { width } = Dimensions.get('window');
const carouselHeight = 200;
const padding = 15;

const FeaturedCarousel = ({ images, interval = 3000 }) => {
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      scrollRef.current?.scrollTo({ x: nextIndex * (width - padding * 2), animated: true });
      setCurrentIndex(nextIndex);
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, images.length]);

  return (
    <View style={styles.container}>
      <View style={styles.carouselWrapper}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          contentContainerStyle={{ paddingHorizontal: 0 }}
        >
          {images.map((img, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image 
                source={
            typeof img === 'string'
              ? { uri: img }
              : img
          }
               style={styles.image} />
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.indicatorContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicatorDot,
              currentIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: padding,
  },
  carouselWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  imageWrapper: {
    width: width - padding * 2,
    height: carouselHeight,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.primary,
    width: 10,
    height: 10,
  },
});

export default FeaturedCarousel;
