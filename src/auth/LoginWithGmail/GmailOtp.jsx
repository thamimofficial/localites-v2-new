import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Linking,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  LayoutAnimation,
  UIManager,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { apiService } from "../../services/api";
import StorageService from "../../services/StorageService/storageService";
import BackButton from "../../components/CoreComponent/BackButton/BackButton";
import Fonts from "../../constants/Font";
import Colors from "../../constants/Colors";
import AlertBox from "../../components/CoreComponent/AlertBox/AlertBox";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const GmailOtp = () => {
  const [email, setEmail] = useState("");
  const [communityId, setCommunityId] = useState("");
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCommunityId = async () => {
      const id = await StorageService.getItem("communityId");
      setCommunityId(id);
    };
    fetchCommunityId();
  }, []);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      LayoutAnimation.easeInEaseOut();
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      LayoutAnimation.easeInEaseOut();
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleGetOtp = async () => {
    if (!email.trim()) {
      setModalVisible(true);
      setAlertTitle("Validation Error");
      setAlertMessage("Email or Mobile is required");
      return;
    }

    try {
      const inputData = { identity: email };
      const response = await apiService.post("/users/getotp", inputData);
      const result = response.data;

      if (result.userId) {
        setAlertMessage(result.message);
        setModalVisible(true);
        navigation.navigate("GmailVerifyOtp", {
          userId: result.userId,
          email,
          userName: result.userName || "",
          communityId,
        });
      } else {
        setAlertTitle("Error");
        setAlertMessage(result.message || "Account not found. Please sign in with Google.");
        setModalVisible(true);
      }
    } catch (error) {
      setAlertTitle("Alert");
      setAlertMessage("Account not found. Please sign in with Google.");
      setModalVisible(true);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.backButton}>
            <BackButton />
          </View>

          <Text style={styles.title}>To continue, please provider your Email</Text>

          <Text style={styles.label}>Enter your Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter mobile or Gmail"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#999"
            keyboardType="email-address"
          />
        </ScrollView>

        <View
          style={[
            styles.bottom,
            isKeyboardVisible && { paddingBottom: Platform.OS === "ios" ? 10 : 20 },
          ]}
        >
          <View style={styles.termsContainer}>
            <Text> I agree to the </Text>
            <TouchableOpacity onPress={() => Linking.openURL("https://www.localites.in/privacy")}>
              <Text style={styles.link}>Privacy policy</Text>
            </TouchableOpacity>
            <Text> and </Text>
            <TouchableOpacity onPress={() => Linking.openURL("https://www.localites.in/terms-of-service")}>
              <Text style={styles.link}>Terms And Condition</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleGetOtp}>
            <Text style={styles.buttonText}>Get OTP</Text>
          </TouchableOpacity>
        </View>

        <AlertBox
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          title={alertTitle}
          body={alertMessage}
          buttonText="Ok"
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default GmailOtp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  backButton: {
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontFamily: Fonts.bold,
    color: Colors.Black,
    textAlign: "left",
    width: 311,
    marginTop: 17,
  },
  label: {
    fontSize: 14,
    color: Colors.Black,
    marginBottom: 6,
    fontFamily: Fonts.regular,
    marginTop: 30,
  },
  input: {
    backgroundColor: Colors.TextInputBackground,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    color: Colors.Black,
    marginTop: 10,
  },
  termsContainer: {
    flexDirection: "row",
    marginBottom: 10,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  link: {
    color: "#111827",
    fontFamily: Fonts.semiBold,
  },
  bottom: {
    backgroundColor: "#fff",
    paddingBottom: 30,
  },
  button: {
    backgroundColor: "#F59E0B",
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    marginHorizontal: 24,
  },
  buttonText: {
    color: "#fff",
    fontFamily: Fonts.semiBold,
    fontSize: 16,
  },
});