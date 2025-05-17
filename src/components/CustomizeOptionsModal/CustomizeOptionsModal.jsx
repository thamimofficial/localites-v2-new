import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Font';

const CustomizeOptionsModal = ({ visible, onClose, data , itemData}) => {
  const groupTypeId = data?.header?.groupTypeId;
  const isRadio = groupTypeId === 1;

  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if (data && data.details) {
      if (isRadio) {
        const defaultOption = data.details.find((d) => d.isDefault);
        setSelectedItems(defaultOption ? [defaultOption] : []);
      } else {
        const defaultOptions = data.details.filter((d) => d.isDefault);
        setSelectedItems(defaultOptions);
      }
     // console.log('Selected items:', itemData);
    }
  }, [data]);

  const handleOptionPress = (item) => {
    if (isRadio) {
      setSelectedItems([item]);
    } else {
      const exists = selectedItems.find((opt) => opt.id === item.id);
      if (exists) {
        setSelectedItems((prev) => prev.filter((opt) => opt.id !== item.id));
      } else {
        setSelectedItems((prev) => [...prev, item]);
      }
    }
  };

  if (!data || !data.details) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={() => onClose()}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>{data?.header?.groupName}</Text>
            <TouchableOpacity onPress={() => onClose()}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Options List */}
          <FlatList
            data={data.details}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const isSelected = selectedItems.some((opt) => opt.id === item.id);

              return (
                <TouchableOpacity
                  style={styles.optionRow}
                  onPress={() => handleOptionPress(item)}
                >
                  <Text style={styles.optionText}>{item.description}</Text>
                  <Ionicons
                    name={
                      isRadio
                        ? isSelected
                          ? 'radio-button-on'
                          : 'radio-button-off'
                        : isSelected
                        ? 'checkbox'
                        : 'square-outline'
                    }
                    size={22}
                    color={isSelected ? Colors.primary : '#888'}
                    style={{ marginRight: 10 }}
                  />
                </TouchableOpacity>
              );
            }}
          />

          {/* Done Button */}
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => onClose({ header: data.header, selected: selectedItems, itemData })}
          >
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomizeOptionsModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.BlackOpacity,
    justifyContent: 'flex-end',
  },
  container: {
    height: '40%',
    backgroundColor: Colors.Background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingTop: 40,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.bold,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  optionText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
  },
  doneButton: {
    marginTop: 12,
    backgroundColor: Colors.primary,
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: 'center',
  },
  doneText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: Fonts.bold,
  },
});
