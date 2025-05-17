import { View, Modal, ActivityIndicator, StyleSheet } from 'react-native';
import React from 'react';
import Colors from '../../constants/Colors';

export default function Loader({ visible }) {
  if (!visible) return null; // Don't render if not loading

  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={styles.modalBackground}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.Indicator} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    backgroundColor: Colors.Background,
    padding: 20,
    borderRadius: 10,
  },
});
