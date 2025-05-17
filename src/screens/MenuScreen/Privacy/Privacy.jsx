import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Fonts from '../../../constants/Font';
import Icon from 'react-native-vector-icons/Ionicons';

const Privacy = ({navigation}) => {
  return (
    <ScrollView style={styles.container}>
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Icon name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Privacy Policy</Text>
                {/* <Icon name="ellipsis-vertical" size={20} color="#333" /> */}
              </View>
      <Text style={styles.title}>Localites.in</Text>
      <Text style={styles.updated}>Last Updated: December 10, 2023</Text>

      <Text style={styles.heading}>1. Information We Collect</Text>
      <Text style={styles.text}>
        Localites collects the following types of information:
      </Text>
      <Text style={styles.bullet}>
        • <Text style={styles.bold}>Personal Information:</Text> When you register or use our services, we may collect personal information such as your name, email address, and other details you provide.
      </Text>
      <Text style={styles.bullet}>
        • <Text style={styles.bold}>Usage Data:</Text> We collect data about your interactions with our platform, including your browsing history, search queries, and usage patterns.
      </Text>

      <Text style={styles.heading}>2. How We Use Your Information</Text>
      <Text style={styles.text}>We use your information for the following purposes:</Text>
      <Text style={styles.bullet}>• To provide and improve our services.</Text>
      <Text style={styles.bullet}>• To personalize your experience and offer relevant content and recommendations.</Text>
      <Text style={styles.bullet}>• To send updates, promotions, and important communications.</Text>
      <Text style={styles.bullet}>• To analyze usage data and improve our platform.</Text>

      <Text style={styles.heading}>3. Information Sharing</Text>
      <Text style={styles.text}>
        We do not share your personal information with third parties except as described in our Privacy Policy.
      </Text>

      <Text style={styles.heading}>4. Data Security</Text>
      <Text style={styles.text}>
        We employ industry-standard security measures to protect your data. However, please be aware that no method of data transmission over the internet is entirely secure.
      </Text>

      <Text style={styles.heading}>5. Your Choices</Text>
      <Text style={styles.text}>
        You can control your information through your account settings, including opting out of promotional emails.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom:20
  },
  headerTitle: {
    fontSize: 18,

    fontFamily: Fonts.bold,
  },
  title: {
    fontSize: 22,

    fontFamily: Fonts.bold,  // Using Fonts.bold
    marginBottom: 4,
  },
  updated: {
    fontSize: 12,
    color: 'gray',
    fontFamily: Fonts.regular, // Using Fonts.regular
    marginBottom: 16,
  },
  heading: {
    fontSize: 16,
    fontFamily: Fonts.bold, // Using Fonts.bold
    marginTop: 16,
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
    fontFamily: Fonts.regular, // Using Fonts.regular
    marginBottom: 6,
    lineHeight: 20,
  },
  bullet: {
    fontSize: 14,
    fontFamily: Fonts.regular, // Using Fonts.regular
    marginLeft: 10,
    marginBottom: 4,
    lineHeight: 20,
  },
  bold: {
        fontFamily:Fonts.semiBold
  },
});

export default Privacy;
