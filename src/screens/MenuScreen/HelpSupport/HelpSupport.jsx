// HelpSupport.jsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../../../constants/Font';

const HelpSupport = ({ navigation }) => {
  const handleOptionPress = (title) => {
    //console.log(`${title} pressed`);
    // navigation.navigate(...) as needed
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Options */}
      <View style={styles.body}>
        {/* <TouchableOpacity style={styles.optionBox} onPress={() => navigation.navigate('CustomerService')}>
          <Text style={styles.optionText}>FAQ</Text>
          <Icon name="chevron-forward" size={20} color="#000" />
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.optionBox}  onPress={() => Linking.openURL("https://www.localites.in/terms-of-service")}>
          <Text style={styles.optionText}>Terms and Conditions</Text>
          <Icon name="chevron-forward" size={20} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionBox} onPress={() => Linking.openURL("https://www.localites.in/privacy")}>
          <Text style={styles.optionText}>Privacy Policy</Text>
          <Icon name="chevron-forward" size={20} color="#000" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#000',
  },
  body: {
    paddingHorizontal: 16,
  },
  optionBox: {
    backgroundColor: '#f0f6f8',
    padding: 16,
    borderRadius: 10,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#000',
    fontFamily: Fonts.regular,
  },
});

export default HelpSupport;
