import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import Colors from '../../constants/Colors';
import BackButton from '../CoreComponent/BackButton/BackButton';
import Fonts from '../../constants/Font';
import Images from '../../constants/Images';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function JourneyCompleted({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <View style={styles.back}>
        <BackButton replaceTo="JourneyTracker" />
        <Text style={styles.backText}>Back</Text>
      </View>

      {/* Congratulations Section */}
      <View style={styles.content}>
        <Image source={{uri:Images.Layer_1}} style={styles.image} />
        <Text style={styles.title}>Congratulations!</Text>
        <Text style={styles.subtitle}>
          You've completed your journey and unlocked exclusive rewards.
        </Text>
      </View>

      {/* Get Rewards Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>Get Rewards!</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
    paddingHorizontal: 24,
    paddingVertical: 11,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  backText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: Colors.Text,
    marginLeft: 10,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', // Center content vertically
    marginTop: 20,
  },
  image: {
    width: 250, // Adjusted width for better visibility
    height: 250, // Adjusted height for better visibility
    marginBottom: 20,
    resizeMode: 'contain', // Ensure the image scales properly
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.Text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.Text,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  button: {
    backgroundColor: Colors.Black,
    paddingVertical: 15,
    borderRadius: 32,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20, // Add spacing at the bottom
  },
  buttonText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: Colors.WhiteText,
  },
});


