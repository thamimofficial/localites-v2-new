import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import Fonts from "../../constants/Font";

const ErrorModal = ({ isOpen, title, message, onClose }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{title || "Error"}</Text>
          <Text style={styles.message}>{message || "Something went wrong."}</Text>
          <TouchableOpacity style={styles.okButton} onPress={onClose}>
            <Text style={styles.okButtonText}>Okay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
      fontFamily:Fonts.bold,
    marginBottom: 10,
    color: "#ff4444",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  okButton: {
    backgroundColor: "#ff4444",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  okButtonText: {
    color: "#fff",
    fontSize: 16,
       fontFamily:Fonts.bold,
  },
});

export default ErrorModal;
