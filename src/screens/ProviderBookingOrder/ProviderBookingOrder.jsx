import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking } from 'react-native';
import React, { useEffect, useState } from 'react';
import Fonts from '../../constants/Font';
import Colors from '../../constants/Colors';
import StorageService from '../../services/StorageService/storageService';
import { DateFormat } from '../../components/CoreComponent/GlobalServices/DateFormat';
import { apiService } from '../../services/api';
import Loader from '../../components/Loader/Loader';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ProviderBookingOrder({ stallId }) {

  // stallbookingrequest/list
  const filters = [
    { id: -1, name: 'All' },
    { id: 1, name: 'Booked' },
    { id: 2, name: 'Approved' },
    { id: 3, name: 'Rejected' },
  ];

  const [bookingList, setBookingList] = useState([]);
  const [filter, setFilter] = useState([]);
  const [bookingRequestStatusId, setBookingRequestStatusId] = useState(1);
  const [loading, setLoading] = useState(true);

  const getOrderList = async () => {
    try {
      setLoading(true);
      const token = await StorageService.getItem('sessionId');
      const inputData = {
        stallBookingId: -1,
        stallId,
        stallBookingDate: "",
      };
      const response = await apiService.post(`/stallbookingrequest/list`, inputData, token);
      const result = response.data;
      setBookingList(result);
      setFilter(result);
    } catch (error) {
      console.log("Error fetching orders from provider side:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilter = () => {
    if (bookingRequestStatusId === 1) {
      setFilter(bookingList);
    } else {
      const filtered = bookingList.filter((item) => item.bookingRequestStatusId === bookingRequestStatusId);
      setFilter(filtered);
    }
  };

  useEffect(() => {
    if (stallId) {
      getOrderList();
    }
  }, [stallId]);

  useEffect(() => {
    getFilter();
  }, [bookingList, bookingRequestStatusId]);

  const statusColors = {
    Approved: '#d4f5e7',
    Booked: '#fff5d1',
    Rejected: '#fddede',
  };

  const statusTextColors = {
    Approved: '#1e9d6f',
    Booked: '#e6a700',
    Rejected: '#e25555',
  };

  const renderOrder = ({ item: order }) => {
    const formattedDate = order.bookingDate
      ? new Date(order.bookingDate).toLocaleDateString('en-gb', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      : 'N/A';

    return (
      <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.orderLabel}>Order no.</Text>
            <Text style={styles.orderValue}>#{order.bookingRequestIdentifier}</Text>

            <View style={{ flex: 1 }} />
            <Text style={styles.dateText}>{`Booking Date: ${formattedDate}`}</Text>
          </View>
          <Text style={styles.detailLine}>
            Name: <Text style={styles.bold}>{order.contactName}</Text>
          </Text>
          <Text style={styles.detailLine}>
          Booking Time: <Text style={styles.bold}>{order.bookingTime}</Text>
          </Text>
          <Text style={styles.detailLine}>
          price Per Seat: <Text style={styles.bold}>₹{order.pricePerSeat}</Text>
          </Text>

          <Text style={styles.detailLine}>
            Amount: <Text style={styles.bold}>₹{order.amount}</Text>
          </Text>

          {order.bookingPayments &&
  order.bookingPayments.map((orderPayment, paymentIndex) => (
     <Text style={styles.detailLine} key={paymentIndex}>
      Payment Status: <Text style={styles.bold}>{orderPayment.paymentStatus}</Text>
    </Text> 
   
  ))}


        <View style={styles.cardRow}>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => Linking.openURL(`tel:${order.contactNumber}`)}
          >
            <Icon name="phone" size={18} color="#f69516" />
          </TouchableOpacity>
      
          {/* <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewButtonText}>View Details</Text>
          </TouchableOpacity> */}
          <View
            style={[
              styles.statusPill,
              { backgroundColor: statusColors[order.bookingRequestStatus] },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: statusTextColors[order.bookingRequestStatus] },
              ]}
            >
              {order.bookingRequestStatus}
            </Text>
          </View>
        </View>


      </View>

    );
  };

  return (
    <View style={{ flex: 1, paddingBottom: 30 }}>
      <View style={{ flexDirection: 'row', marginBottom: 16, gap: 5 }}>
        {filters.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => setBookingRequestStatusId(item.id)}
            style={[
              styles.filterButton,
              {
                backgroundColor:
                  item.id === bookingRequestStatusId ? Colors.primary : Colors.TextInputBackground,
              },
            ]}
          >
            <Text
              style={{
                color: item.id === bookingRequestStatusId ? '#fff' : '#000',
                fontFamily:Fonts.medium,
              }}
            >
              {item?.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && <Loader visible={loading} />}

      {!loading && filter.length > 0 ? (
        <FlatList
          data={filter}
          renderItem={renderOrder}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      ) : (
        !loading && <Text style={{ textAlign: 'center', marginTop: 20 }}>No orders found.</Text>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 14,
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8,
    justifyContent: 'space-between'
  },
  orderLabel: {
    fontSize: 14,
    color: '#333',
    fontFamily: Fonts.medium,
  },
  orderValue: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    marginLeft: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    fontFamily: Fonts.regular,
  },
  detailLine: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
    fontFamily: Fonts.medium,
  },
  bold: {
    fontFamily: Fonts.bold,
  },
  viewButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  viewButtonText: {
    color: '#333',
    fontSize: 13,
    fontFamily: Fonts.medium,
  },
  statusPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginLeft: 10,
  },
  statusText: {
    fontSize: 13,
    fontFamily: Fonts.bold,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,

  },
  contactButton: {
    backgroundColor: '#ffe6c7',
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 45,
  }
});