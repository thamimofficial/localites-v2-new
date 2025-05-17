import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking ,Modal} from 'react-native';
import React, { useEffect, useState } from 'react';
import Fonts from '../../constants/Font';
import Colors from '../../constants/Colors';
import StorageService from '../../services/StorageService/storageService';
import { DateFormat } from '../../components/CoreComponent/GlobalServices/DateFormat';
import { apiService } from '../../services/api';
import Loader from '../../components/Loader/Loader';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

export default function ProviderItemOrder({ stallId }) {
  const navigation = useNavigation();
  const filters = [
    { id: -1, name: 'All' },
    { id: 1, name: 'Placed' },
    { id: 2, name: 'Accepted' },
    { id: 6, name: 'Delivered' },
    { id: 7, name: 'Cancelled' },
  ];

  const [orderList, setOrderList] = useState([]);
  const [filter, setFilter] = useState([]);
  const [orderStatusId, setOrderStatusId] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [currentOrder, setCurrentOrder] = useState(null);
  const [actionType, setActionType] = useState('');

  const getOrderList = async () => {
    try {
      setLoading(true);
      const token = await StorageService.getItem('sessionId');
      const inputData = {
        orderStatusId: -1,
        stallId,
        fromDate: "2024-01-01",
        toDate: DateFormat.getServerDateFormat(),
      };
      const response = await apiService.post(`/order/community/query`, inputData, token);
      const result = response.data;
      setOrderList(result);
      setFilter(result);
    } catch (error) {
      console.log("Error fetching orders from provider side:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilter = () => {
    if (orderStatusId === -1) {
      setFilter(orderList);
    } else {
      const filtered = orderList.filter((item) => item.orderStatusId === orderStatusId);
      setFilter(filtered);
    }
  };

  // Show confirmation alert before taking action
  const showConfirmationAlert = (order, type) => {
    setCurrentOrder(order);
    setActionType(type);
    
    switch(type) {
      case 'accept':
        setAlertTitle('Confirm Accept');
        setAlertMessage(`Do you want to accept the order ${order.orderIdentifier}?`);
        break;
      case 'ship':
        setAlertTitle('Confirm Shipping');
        setAlertMessage(`Do you want to mark the order ${order.orderIdentifier} as shipped?`);
        break;
      case 'ready':
        setAlertTitle('Confirm Ready');
        setAlertMessage(`Do you want to mark the order ${order.orderIdentifier} as ready for pickup?`);
        break;
      case 'deliver':
        setAlertTitle('Confirm Delivery');
        setAlertMessage(`Do you want to mark the order ${order.orderIdentifier} as delivered?`);
        break;
      case 'cancel':
        setAlertTitle('Confirm Cancellation');
        setAlertMessage(`Are you sure you want to cancel the order ${order.orderIdentifier}?`);
        break;
      default:
        break;
    }
    
    setModalVisible(true);
  };

  // Handle confirmation from alert
  const handleConfirmation = async (confirmed) => {
    setModalVisible(false);
    
    if (!confirmed || !currentOrder) return;
    
    try {
      switch(actionType) {
        case 'accept':
          await markAsAccepted(currentOrder);
          break;
        case 'ship':
        case 'ready':
          await markAsShippedOrReady(currentOrder);
          break;
        case 'deliver':
          await markAsDelivered(currentOrder);
          break;
        case 'cancel':
          await cancelOrder(currentOrder);
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(`Error processing ${actionType} action:`, error);
    } finally {
      setCurrentOrder(null);
      setActionType('');
    }
  };

  const markAsAccepted = async (order) => {
    try {
      const token = await StorageService.getItem('sessionId');
      await apiService.put(`/order/${order.id}/markAsAccepted`, {}, token);
      
      // Success alert
      setAlertTitle('Success');
      setAlertMessage(`Order ${order.orderIdentifier} has been accepted successfully.`);
      setModalVisible(true);
      
      await getOrderList(); // Refresh
    } catch (error) {
      console.log("Mark as accepted error", error);
      
      // Error alert
      setAlertTitle('Error');
      setAlertMessage(`Failed to accept order. Please try again.`);
      setModalVisible(true);
    }
  };

  const markAsShippedOrReady = async (order) => {
    try {
      const token = await StorageService.getItem('sessionId');
      await apiService.put(`/order/${order.id}/MarkAsReadyOrShipped`, {}, token);
      
      // Success alert
      const actionText = order.orderTypeID === 1 ? "shipped" : "marked as ready for pickup";
      setAlertTitle('Success');
      setAlertMessage(`Order ${order.orderIdentifier} has been ${actionText} successfully.`);
      setModalVisible(true);
      
      await getOrderList(); // Refresh
    } catch (error) {
      console.log("Mark as shipped/ready error", error);
      
      // Error alert
      setAlertTitle('Error');
      setAlertMessage(`Failed to update order status. Please try again.`);
      setModalVisible(true);
    }
  };

  const markAsDelivered = async (order) => {
    try {
      const token = await StorageService.getItem('sessionId');
      const inputData = {
        id: order.id,
        currentDate: DateFormat.getCurrentDate()
      };
      await apiService.post(`/order/MarkAsDelivered`, inputData, token);
      
      // Success alert
      setAlertTitle('Success');
      setAlertMessage(`Order ${order.orderIdentifier} has been marked as delivered.`);
      setModalVisible(true);
      
      await getOrderList(); // Refresh
    } catch (error) {
      console.log("Mark as delivered error", error);
      
      // Error alert
      setAlertTitle('Error');
      setAlertMessage(`Failed to mark order as delivered. Please try again.`);
      setModalVisible(true);
    }
  };

  const cancelOrder = async (order) => {
    try {
      const token = await StorageService.getItem('sessionId');
      const inputData = {
        id: order.id,
        cancelledRemarks: "yes"
      };
      await apiService.post(`/order/MarkOrderCancelled`, inputData, token);
      
      // Success alert
      setAlertTitle('Success');
      setAlertMessage(`Order ${order.orderIdentifier} has been cancelled.`);
      setModalVisible(true);
      
      await getOrderList(); // Refresh
    } catch (error) {
      console.log("Cancel order error", error);
      
      // Error alert
      setAlertTitle('Error');
      setAlertMessage(`Failed to cancel order. Please try again.`);
      setModalVisible(true);
    }
  };

  useEffect(() => {
    if (stallId) {
      getOrderList();
    }
  }, [stallId]);

  useEffect(() => {
    getFilter();
  }, [orderList, orderStatusId]);

  const statusColors = {
    Delivered: '#d4f5e7',
    Placed: '#ece9fc',
    Accepted: '#fff5d1',
    Cancelled: '#fddede',
  };

  const statusTextColors = {
    Delivered: '#1e9d6f',
    Placed: '#7269e0',
    Accepted: '#e6a700',
    Cancelled: '#e25555',
  };

  const renderOrder = ({ item: order }) => {
    const formattedDate = order.placedDate
      ? new Date(order.placedDate).toLocaleDateString('en-gb', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      : 'N/A';

       return (
      <View style={styles.card}>
        <View style={styles.cardRow}>
          <Text style={styles.orderLabel}>Order no.</Text>
          <Text style={styles.orderValue}>#{order.orderIdentifier}</Text>

          <View style={{ flex: 1 }} />
          <Text style={styles.dateText}>{`Date: ${formattedDate}`}</Text>
        </View>
        <Text style={styles.detailLine}>
          Name: <Text style={styles.bold}>{order.consumerName}</Text>
        </Text>
        
        <Text style={styles.detailLine}>
          Amount: <Text style={styles.bold}>₹{order.orderTotal}</Text>
        </Text>

        {order.orderPayments &&
          order.orderPayments.map((orderPayment, paymentIndex) => (
            (orderPayment.paymentMode === "cod" || orderPayment.paymentMode === "razorpay") && (
              <Text style={styles.detailLine} key={paymentIndex}>
                Payment Type: <Text style={styles.bold}>{orderPayment.paymentMode}</Text>
              </Text>
            )
          ))}

        <View style={styles.cardRow}>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => Linking.openURL(`tel:${order.consumerPhone}`)}
          >
            <Icon name="phone" size={18} color="#f69516" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => Linking.openURL(`mailto:${order.consumerEmail}`)}
          >
            <Icon name="envelope" size={18} color="#f69516" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.viewButton} 
            onPress={() => navigation.navigate("OrderDetail", {id: order?.id})}
          >
            <Text style={styles.viewButtonText}>View Details</Text>
          </TouchableOpacity>
          <View
            style={[
              styles.statusPill,
              { backgroundColor: statusColors[order.orderStatus] },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: statusTextColors[order.orderStatus] },
              ]}
            >
              {order.orderStatus}
            </Text>
          </View>
        </View>
        
        <View style={styles.cardRow}>
          {/* Show action buttons based on current order status */}
          {order.orderStatusId === 1 && (
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => showConfirmationAlert(order, 'accept')}
            >
              <Text style={styles.actionButtonText}>Accept</Text>
            </TouchableOpacity>
          )}
          
          {order.orderStatusId === 2 && order.orderTypeID === 1 && (
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => showConfirmationAlert(order, 'ship')}
            >
              <Text style={styles.actionButtonText}>Ship</Text>
            </TouchableOpacity>
          )}
          
          {order.orderStatusId === 2 && order.orderTypeID === 2 && (
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => showConfirmationAlert(order, 'ready')}
            >
              <Text style={styles.actionButtonText}>Ready</Text>
            </TouchableOpacity>
          )}
          
          {(order.orderStatusId === 4 || order.orderStatusId === 5) && (
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => showConfirmationAlert(order, 'deliver')}
            >
              <Text style={styles.actionButtonText}>Delivered</Text>
            </TouchableOpacity>
          )}
          
          {/* Allow cancellation only for Placed status */}
          {order.orderStatusId === 1 && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]} 
              onPress={() => showConfirmationAlert(order, 'cancel')}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, paddingBottom: 30 }}>
      {/* Filter buttons */}
      <View style={{ flexDirection: 'row', marginBottom: 16, gap: 5 }}>
        {filters.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => setOrderStatusId(item.id)}
            style={[
              styles.filterButton,
              {
                backgroundColor:
                  item.id === orderStatusId ? Colors.primary : Colors.TextInputBackground,
              },
            ]}
          >
            <Text
              style={{
                color: item.id === orderStatusId ? '#fff' : '#000',
                fontFamily: Fonts.medium,
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
      
      {/* Alert Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{alertTitle}</Text>
            <Text style={styles.modalMessage}>{alertMessage}</Text>
            
            <View style={styles.modalButtons}>
              {actionType ? (
                <>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelModalButton]}
                    onPress={() => handleConfirmation(false)}
                  >
                    <Text style={styles.cancelModalButtonText}>No</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmModalButton]}
                    onPress={() => handleConfirmation(true)}
                  >
                    <Text style={styles.confirmModalButtonText}>Yes</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmModalButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.confirmModalButtonText}>OK</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
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
  },
   actionButton: {
    backgroundColor: '#f69516',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    marginRight: 8,
    marginTop: 10
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '500'
  },
  cancelButton: {
    backgroundColor: '#e25555'
  },
  cancelButtonText: {
    color: '#fff'
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
    marginHorizontal: 8
  },
  confirmModalButton: {
    backgroundColor: '#f69516'
  },
  confirmModalButtonText: {
    color: '#fff',
    fontWeight: '500'
  },
  cancelModalButton: {
    backgroundColor: '#e2e2e2'
  },
  cancelModalButtonText: {
    color: '#333',
    fontWeight: '500'
  }
});