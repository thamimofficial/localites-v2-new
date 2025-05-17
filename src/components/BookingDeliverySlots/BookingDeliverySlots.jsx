import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Fonts from '../../constants/Font';
import Colors from '../../constants/Colors';
import StorageService from '../../services/StorageService/storageService';
import { apiService } from '../../services/api';

const BookingDeliverySlots = ({ availableSlots = [], onSlotChange, dateFromBook }) => {
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedSlotTime, setSelectedSlotTime] = useState(null);
  const [slots, setSlots] = useState([]);

  const minDate = new Date();

  useEffect(() => {
    getAvailableSlots();
  }, [selectedDeliveryDate]);

  const onDeliveryDateSelect = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDeliveryDate(date);
      setSelectedSlotTime(null); // Reset on date change
    }
  };

  const getAvailableSlots = async () => {
    const formattedDate = selectedDeliveryDate.toISOString().split('T')[0];
    const inputData = {
      bookingDate: formattedDate,
      stallBookingId: dateFromBook.stallBookingId,
      duration: dateFromBook.duration,
      maxCapacityPerSlot: dateFromBook.maxCapacityPerSlot,
    };
    console.log('inputData', inputData);
    const token = await StorageService.getItem('sessionId');

    try {
      const response = await apiService.post(`/portal/booking/slot/available`, inputData, token);
      console.log('API getAvailableSlots:', response.data);
      setSlots(response.data || []);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setSlots([]);
    }
  };

  const formatTo12Hour = (time) => {
    if (!time) return '';
    const [hour, minute] = time.split(':');
    const h = parseInt(hour, 10);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const formattedHour = h % 12 === 0 ? 12 : h % 12;
    return `${formattedHour}:${minute} ${suffix}`;
  };

  const isSlotAvailable = (slot) => {
    if (!selectedDeliveryDate) return false;

    const now = new Date();
    const selected = new Date(selectedDeliveryDate);
    const isToday =
      now.getDate() === selected.getDate() &&
      now.getMonth() === selected.getMonth() &&
      now.getFullYear() === selected.getFullYear();

    if (isToday) {
      const [endH, endM] = slot.endTime.split(':').map(Number);
      if (
        now.getHours() > endH ||
        (now.getHours() === endH && now.getMinutes() >= endM)
      ) {
        return false;
      }
    }

    return true;
  };

  const handleSlotSelect = (slot) => {
    const isSame = selectedSlotTime === slot.startTime + '-' + slot.endTime;
    const selected = isSame ? null : slot.startTime + '-' + slot.endTime;
    setSelectedSlotTime(selected);

    if (onSlotChange) {
      const selectedDate = selectedDeliveryDate.toISOString().split('T')[0];
      onSlotChange(
        isSame
          ? null
          : {
              date: selectedDate,
              startTime: slot.startTime,
              endTime: slot.endTime,
            }
      );
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

  const filteredSlots = slots.filter(isSlotAvailable);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Booking Slots</Text>

      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateText}>
          {selectedDeliveryDate ? formatFullDate(selectedDeliveryDate) : 'Select a Date'}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDeliveryDate}
          mode="date"
          display="default"
          minimumDate={minDate}
          onChange={onDeliveryDateSelect}
        />
      )}

      {selectedDeliveryDate && filteredSlots.length > 0 ? (
        <ScrollView contentContainerStyle={styles.slotContainer}>
          {filteredSlots.map((slot, index) => {
            const slotKey = slot.startTime + '-' + slot.endTime;
            const isSelected = selectedSlotTime === slotKey;
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.slotButton,
                  isSelected && styles.slotButtonActive,
                ]}
                onPress={() => handleSlotSelect(slot)}
              >
                <Text
                  style={[
                    styles.slotText,
                    isSelected && styles.slotTextActive,
                  ]}
                >
                  {formatTo12Hour(slot.startTime)} - {formatTo12Hour(slot.endTime)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : (
        <Text style={styles.noSlotsText}>No Booking slots available.</Text>
      )}
    </View>
  );
};

export default BookingDeliverySlots;

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
