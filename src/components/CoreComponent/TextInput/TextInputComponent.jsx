import React from "react";
import { TextInput, StyleSheet } from "react-native";

const TextInputComponent = ({ placeholder, value, onChangeText, keyboardType,multiline,numberOfLines,editable,style ,maxLength}) => {
  return (
    <TextInput
      style={[styles.input,{style}]}
      placeholder={placeholder}
      placeholderTextColor="#888" // Light grey for visibility
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      multiline={multiline}
      numberOfLines={numberOfLines}
      editable={editable}
      maxLength={maxLength}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    display: "flex",
    height: 56,
    paddingHorizontal: 13,
    alignItems: "center",
    gap: 10,
    alignSelf: "stretch",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    color: "#000", // Ensuring text is visible
    fontSize: 16,
    backgroundColor: '#eff2f5',
    fontFamily: "Sora-Regular",
    marginVertical:15
  },
});

export default TextInputComponent;
