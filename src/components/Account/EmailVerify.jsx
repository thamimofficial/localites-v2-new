import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { apiService } from '../../services/api';
import StorageService from '../../services/StorageService/storageService';
import BackButton from '../CoreComponent/BackButton/BackButton';
import Fonts from '../../constants/Font';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EmailVerify() {
  const [otp, setOtp] = useState('');
  const [showEmailSent, setShowEmailSent] = useState(false); // Alert box trigger
  const otpRefs = useRef([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { Email } = route.params;

  useEffect(() => {
    verifyEmail();
  }, []);

  const verifyEmail = async () => {
    const token = await StorageService.getItem('sessionId');
    try {
      await apiService.post('/user/verify/email', {}, token);
      setShowEmailSent(true);
      setTimeout(() => setShowEmailSent(false), 4000); // Hide after 4s
    } catch (error) {
      console.log('Error sending verification email', error);
    }
  };

  const verifyEmailStatus = async () => {
    const token = await StorageService.getItem('sessionId');
    try {
      const response = await apiService.post('/user/verify/email/status', { otp }, token);
      const result = response.data;
      onSuccessEmailVerify(result);
    } catch (error) {
      console.log('Error verifying email status', error);
    }
  };

  const onSuccessEmailVerify = (result) => {
    if (result.isVerified) {
      navigation.goBack();
    } else {
      setOtp('');
      otpRefs.current[0]?.focus();
    }
  };

  const handleOtpChange = (text, index) => {
    const newOtp = otp.split('');
    newOtp[index] = text;
    setOtp(newOtp.join(''));

    if (text && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1].focus();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View  style={styles.backButton}>
        {/* <Text style={styles.backText}>← Back</Text> */}
        <BackButton replaceTo='Profile'/>
      </View>

      <Text style={styles.title}>Verify Email</Text>

      {showEmailSent && (
        <View style={styles.alertBox}>
          <Text style={styles.alertText}>
            Verification Email Sent! Please check your inbox.
          </Text>
        </View>
      )}

      <Text style={styles.subtitle}>
        Enter the code sent to <Text style={styles.emailText}>{Email}</Text> to verify your account.
      </Text>

      <View style={styles.otpContainer}>
        {Array(6)
          .fill('')
          .map((_, index) => (
            <TextInput
              key={index}
              ref={(ref) => (otpRefs.current[index] = ref)}
              style={styles.otpInput}
              maxLength={1}
              keyboardType="numeric"
              onChangeText={(text) => handleOtpChange(text, index)}
              value={otp[index] || ''}
              placeholder=""
              placeholderTextColor="#ccc"
            />
          ))}
      </View>

      <TouchableOpacity style={styles.verifyButton} onPress={verifyEmailStatus}>
        <Text style={styles.verifyButtonText}>Verify and Continue</Text>
      </TouchableOpacity>

      <Text style={styles.resendText}>
        Didn’t Receive Code?{' '}
        <Text style={styles.resendLink} onPress={verifyEmail}>
          Get a New one
        </Text>
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  backText: {
    fontSize: 16,
    color: '#000',
  },
  title: {
    fontSize: 24,
       fontFamily:Fonts.bold,
    color: '#000',
    marginBottom: 10,
  },
  alertBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f69516',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  alertText: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    fontFamily:Fonts.regular
  },
  emailText: {
      fontFamily:Fonts.bold,
    color: '#000',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 5,
  },
  otpInput: {
    width: 48,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 18,
    color: '#000',
    backgroundColor: '#fff',
  },
  verifyButton: {
    backgroundColor: '#f69516',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
      fontFamily:Fonts.bold,
  },
  resendText: {
    fontSize: 14,
    color: '#666',
  },
  resendLink: {
    color: '#f69516',
      fontFamily:Fonts.bold,
  },
});
