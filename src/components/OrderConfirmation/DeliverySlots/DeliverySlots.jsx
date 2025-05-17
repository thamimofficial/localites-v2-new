import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Fonts from '../../../constants/Font';
import Colors from '../../../constants/Colors';

const DeliverySlots = ({ availableSlots = [], onSlotChange,orderTypeId }) => {
  // console.log("orderTypeId",orderTypeId);
  // console.log("avaialbleslots",availableSlots)


  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState(null);

  const minDate = new Date();
  const onDeliveryDateSelect = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDeliveryDate(date);
      setSelectedSlotId(null); // Reset slot when date changes
    }
  };

  const convertTo24Hour = (time) => {
    const [hourMin, period] = time.split(' ');
    let [hour, minute] = hourMin.split(':').map(Number);
    if (period.toUpperCase() === 'PM' && hour !== 12) hour += 12;
    if (period.toUpperCase() === 'AM' && hour === 12) hour = 0;
    return { hour, minute };
  };

  const isSlotAvailable = (slot) => {
    if (!selectedDeliveryDate) return false;

    const today = new Date();
    const selectedDate = new Date(selectedDeliveryDate);

    const isToday =
      today.getDate() === selectedDate.getDate() &&
      today.getMonth() === selectedDate.getMonth() &&
      today.getFullYear() === selectedDate.getFullYear();

    const { hour: slotEndHour, minute: slotEndMinute } = convertTo24Hour(
      slot.formattedEndTime
    );

    if (isToday) {
      const currentHour = today.getHours();
      const currentMinute = today.getMinutes();
      if (
        currentHour > slotEndHour ||
        (currentHour === slotEndHour && currentMinute >= slotEndMinute)
      ) {
        return false;
      }
    }

    return true;
  };

  const availableSlotsForSelectedDate = availableSlots.filter(isSlotAvailable);

  const onSelectSlot = (slot) => {
    const isSame = selectedSlotId === slot.id;
    const newSelectedSlotId = isSame ? null : slot.id;
    setSelectedSlotId(newSelectedSlotId);
    if (onSlotChange) {
      onSlotChange(isSame ? null : slot);
    }
  };

  const formatFullDate = (date) => {
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      {orderTypeId ? (
      <Text style={styles.sectionTitle}>Delivery Slots</Text>
      ):(
        <Text style={styles.sectionTitle}>Pickup Slots</Text>
      )}


      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateText}>
          {selectedDeliveryDate
            ? formatFullDate(selectedDeliveryDate)
            : 'Select a Date'}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDeliveryDate || new Date()}
          mode="date"
          display="default"
          minimumDate={minDate}
          onChange={onDeliveryDateSelect}
        />
      )}

      {selectedDeliveryDate && availableSlotsForSelectedDate.length > 0 ? (
        <ScrollView contentContainerStyle={styles.slotContainer}>
          {availableSlotsForSelectedDate.filter(s=>s.slotType ==0 ).map((slot) => {
            const isSelected = selectedSlotId === slot?.id;
            return (
              <TouchableOpacity
                key={slot?.id}
                style={[
                  styles.slotButton,
                  isSelected && styles.slotButtonActive,
                ]}
                onPress={() => onSelectSlot(slot)}
              >
                <Text
                  style={[
                    styles.slotText,
                    isSelected && styles.slotTextActive,
                  ]}
                >
                  {slot?.description || 'Slot'}
                </Text>
                <Text
                  style={[
                    styles.slotText,
                    isSelected && styles.slotTextActive,
                  ]}
                >
                  {slot?.formattedStartTime} - {slot?.formattedEndTime}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : selectedDeliveryDate ? (
        <Text style={styles.noSlotsText}>No delivery slots available.</Text>
      ) : null}
    </View>
  );
};

export default DeliverySlots;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: Colors.orderPageBackground || '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    marginBottom: 12,
    textAlign: 'center',
    color: '#333',
  },
  dateButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f0f8ff',
  },
  dateText: {
    fontSize: 16,
    color: '#007BFF',
    fontFamily: Fonts.regular,
  },
  slotContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  slotButton: {
    backgroundColor: '#eee',
    padding: 14,
    borderRadius: 6,
    marginVertical: 5,
    alignItems: 'center',
    width: '48%',
  },
  slotButtonActive: {
    backgroundColor: Colors.primary,
  },
  slotText: {
    fontSize: 14,
    color: '#333',
    fontFamily: Fonts.bold,
  },
  slotTextActive: {
    color: '#fff',
  },
  noSlotsText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
    color: '#777',
    fontFamily: Fonts.regular,
  },
});
