import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import Colors from "../../../constants/Colors";
import Fonts from "../../../constants/Font";

const AlertBox = ({
  visible,
  title = "Alert",
  body,
  onClose,
  buttonText = "Okay",
  buttonColor = Colors.ButtonGreen,
  onConfirm = null,
  secondButtonText,
  onSecondButton,
}) => {
  const handlePrimaryPress = () => {
    if (onConfirm) {
      onConfirm();
    } else if (onClose) {
      onClose();
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{body}</Text>

          <View style={styles.buttonRow}>
            {secondButtonText && onSecondButton && (
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={onSecondButton}
              >
                <Text style={styles.secondaryButtonText}>
                  {secondButtonText}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, { backgroundColor: buttonColor }]}
              onPress={handlePrimaryPress}
            >
              <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Pressable style={styles.backdrop} onPress={onClose} />
      </View>
    </Modal>
  );
};

export default AlertBox;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  container: {
    width: "85%",
    backgroundColor: Colors.White,
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    zIndex: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    marginBottom: 10,
    color: Colors.Black,
  },
  body: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.DarkGray,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6,
    marginLeft: 10,
  },
  buttonText: {
    color: Colors.White,
    fontFamily: Fonts.medium,
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: Colors.LightGray,
  },
  secondaryButtonText: {
    color: Colors.Black,
    fontFamily: Fonts.medium,
    fontSize: 16,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
});


// usage 

// const [isModalVisible, setModalVisible] = useState(false); // Modal visibility state
// const [alertMessage, setAlertMessage] = useState(""); // To store the alert message
// const [alertTitle, setAlertTitle] = useState(""); // To store the alert message