import React, { useState, useRef } from 'react';
import { 
  View, Text, Image, ScrollView, 
  Dimensions, TouchableOpacity 
} from 'react-native';
import styles from './IntroStyles';

import { Locatites } from '../../Localites/Localites';
import Images from '../../constants/Images';
const { Header1, Header2, Header3, Description1, Description2, Description3 } = Locatites;

const { width } = Dimensions.get('window');

const Intro = ({ navigation }) => {
  const scrollViewRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: Images.intro1,
      header:Header1,
      description: Description1,
    },
    {
      image: Images.intro2,
      header:Header2,
      description: Description2,
    },
    {
      image: Images.intro3,
      header: Header3,
      description: Description3,
    },
  ];

  const handleScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentSlide(slideIndex);
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      scrollViewRef.current.scrollTo({ x: (currentSlide + 1) * width, animated: true });
    } else {
      navigation.replace('Location'); // Navigate after last slide
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {slides.map((slide, index) => (
          <View key={index} style={styles.slide}>
            <Image    source={
             typeof slide?.image === 'string'
               ? { uri: slide.image }
               : slide?.image
           } style={styles.image} />
            <Text style={styles.header}>{slide.header}</Text>
            <Text style={styles.description}>{slide.description}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomRow}>
      {currentSlide === slides.length - 1 ? null : (
      <TouchableOpacity onPress={() => navigation.replace('Location')}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}
      


        <View style={styles.paginationContainer}>
          <View style={styles.pagination}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[styles.paginationDot, currentSlide === index && styles.activeDot]}
              />
            ))}
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.nextButton, currentSlide === slides.length - 1 && styles.getStartedButton]} 
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Intro;
