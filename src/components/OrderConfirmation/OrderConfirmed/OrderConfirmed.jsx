import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import Fonts from '../../../constants/Font';

const OrderConfirmed = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 3000); // navigate to Home after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon name="check-circle" size={60} color="#f9a825" />
        </View>
        <Text style={styles.title}>Yay! Your order has been placed.</Text>
        {/* <Text style={styles.subtitle}>
          Your order would be delivered in the{"\n"}30 mins almost
        </Text> */}

        {/* <View style={styles.infoContainer}>
          <View style={styles.row}>
            <IonIcon name="time-outline" size={20} color="#888" />
            <Text style={styles.label}>Estimated time</Text>
            <Text style={styles.value}>30mins</Text>
          </View>
          <View style={styles.row}>
            <EntypoIcon name="location-pin" size={20} color="#888" />
            <Text style={styles.label}>Deliver to</Text>
            <Text style={styles.value}>Home</Text>
          </View>
          <View style={styles.row}>
            <IonIcon name="card-outline" size={20} color="#888" />
            <Text style={styles.label}>Amount Paid</Text>
            <Text style={styles.value}>₹726</Text>
          </View>
        </View> */}
      </View>
    </SafeAreaView>
  );
};

export default OrderConfirmed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
     fontFamily:Fonts.bold,
    color: '#222',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  infoContainer: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    flex: 1,
    fontSize: 15,
    color: '#666',
    marginLeft: 8,
  },
  value: {
    fontSize: 15,
    fontFamily:Fonts.bold,
    color: '#000',
  },
});
