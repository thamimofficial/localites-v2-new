import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { apiService } from "../../services/api";
import BackButton from "../../components/CoreComponent/BackButton/BackButton";
import StorageService from "../../services/StorageService/storageService";
import Fonts from "../../constants/Font";
import Colors from "../../constants/Colors";
import AlertBox from "../../components/CoreComponent/AlertBox/AlertBox";

export default function GmailVerifyOtp() {
  const route = useRoute();
  const navigation = useNavigation();

  const [isModalVisible, setModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");

  const { userId, email, userName, communityId } = route.params;

  const [otpArray, setOtpArray] = useState(["", "", "", "", "", ""]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const otpRefs = useRef([]);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleOtpChange = (text, index) => {
    if (/^\d*$/.test(text)) {
      const newOtp = [...otpArray];
      newOtp[index] = text;
      setOtpArray(newOtp);
      if (text && index < 5) otpRefs.current[index + 1]?.focus();
      else if (!text && index > 0) otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otp = otpArray.join("");
    if (otp.length !== 6) {
      setAlertTitle("Invalid OTP");
      setAlertMessage("OTP should be 6 digits.");
      setModalVisible(true);
      return;
    }

    try {
      const inputData = {
        OTP: otp,
        communityId,
        id: userId,
        identity: email,
        password: "",
        userName,
        message: "",
      };

      const response = await apiService.post("/security/authenticate/otp", inputData);
      const result = response.data;

      if (response.status === 200 && result.authToken.isAuthenticated) {
        setAlertTitle("Success");
        setAlertMessage("OTP Verified Successfully!");
        setModalVisible(true);

        await StorageService.setItem("user", JSON.stringify(result));
        await StorageService.setItem("imagStorageUrl", result.config.imagStorageUrl);
        await StorageService.setItem("sessionId", result.authToken.sessionId);
        await StorageService.setItem("userId", result.authToken.userId.toString());
        navigation.replace("Home");
      } else {
        setAlertTitle("Error");
        setAlertMessage(result.authToken.communityMessage || "OTP Verification failed.");
        setModalVisible(true);
      }
    } catch (error) {
      console.log("OTP verification error:", error);
      setAlertTitle("Error");
      setAlertMessage("Failed to verify OTP. Please try again.");
      setModalVisible(true);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.avoidingView}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.backButton}>
            <BackButton />
          </View>

          <Text style={styles.title}>Verify Number</Text>

          <Text style={styles.subtitle}>
            Enter the code sent to <Text style={styles.emailText}>{email}</Text> to verify your account.
          </Text>

          <View style={styles.otpContainer}>
            {otpArray.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (otpRefs.current[index] = ref)}
                style={styles.otpInput}
                maxLength={1}
                keyboardType="numeric"
                onChangeText={(text) => handleOtpChange(text, index)}
                value={digit}
                placeholder=""
                placeholderTextColor="#ccc"
              />
            ))}
          </View>
        </View>

        <View style={styles.bottomWrapper}>
          <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOtp}>
            <Text style={styles.verifyButtonText}>Verify and Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <AlertBox
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        title={alertTitle}
        body={alertMessage}
        buttonText="Ok"
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  avoidingView: {
    flex: 1,
    backgroundColor: Colors.Background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 80 : 60,
    paddingBottom: 30,
  },
  container: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? -50 : -30,
    left: -20,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontFamily: Fonts.bold,
    color: Colors.Black,
    textAlign: "left",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.Black,
    marginBottom: 25,
  },
  emailText: {
    fontFamily: Fonts.black,
    color: Colors.Black,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    gap: 5,
  },
  otpInput: {
    width: 48,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.BorderColor,
    borderRadius: 10,
    textAlign: "center",
    fontSize: 18,
    color: Colors.Black,
    backgroundColor: Colors.TextInputBackground,
  },
  bottomWrapper: {
    marginTop: 20,
  },
  verifyButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 50,
    alignItems: "center",
  },
  verifyButtonText: {
    color: Colors.White,
    fontSize: 16,
    fontFamily: Fonts.bold,
  },
});
