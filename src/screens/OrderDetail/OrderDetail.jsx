import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { apiBase, apiService } from '../../services/api';
import StorageService from '../../services/StorageService/storageService';
import Fonts from '../../constants/Font';
import BackButton from '../../components/CoreComponent/BackButton/BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';

const OrderDetail = ({ route }) => {
  const { id } = route.params;

  const [orderDetails, setOrderDetail] = useState({
    order: {},
    orderLines: [],
  });

  useEffect(() => {
    getOrderDetail();
  }, []);

  const getOrderDetail = async () => {
    const token = await StorageService.getItem('sessionId');
    try {
      const response = await apiService.get(`/order/detail/${id}`, token);
      const data = response.data?.[0];
      if (data) {
        setOrderDetail(data);
      }
    } catch (error) {
      console.error('Error getOrderDetail:', error);
    }
  };

  const { order, orderLines, address, orderPayments } = orderDetails;

  const couponAmount = order?.couponAmount || 0;
  const deliveryCharge = order?.deliveryCharge || 0;
  const orderAmount = order?.orderAmount || 0;
  const orderTotal = order?.orderTotal || 0;

  return (
    <SafeAreaView style={{backgroundColor:Colors.Background}}>
    <ScrollView contentContainerStyle={styles.container}>
      <BackButton />
      <Text style={styles.header}>Order Details</Text>

      <View style={styles.orderIdRow}>
        <Text style={styles.orderIdLabel}>Order No:</Text>
        <Text style={styles.orderId}>#{order?.orderIdentifier}</Text>
      </View>

      {orderLines.map((item) => (
        <View key={item.id} style={styles.itemContainer}>
          <Image
            source={{ uri: `${apiBase.imagePath}${item.imagePath}` }}
            style={styles.image}
          />
          <View style={styles.itemDetails}>
            <Text style={styles.itemName}>{item.itemName}</Text>
            <View style={styles.qtyRow}>
              <Text style={styles.itemQty}>Qty: {item.itemQuantity}</Text>
              <Text style={styles.itemQty}>Price: ₹{item.lineTotalPrice}</Text>
            </View>
            {item.orderLineModifiers?.length > 0 && (
              <View style={styles.modifierContainer}>
                {item.orderLineModifiers.map((mod, index) => (
                  <Text key={index} style={styles.modifierText}>{mod.description}</Text>
                ))}
              </View>
            )}
          </View>
        </View>
      ))}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Details</Text>
        <View style={styles.detailBox}>
          {
            (address?.displayName || address?.fullName || order?.consumerName) && 
                      <Text style={styles.detailText}>Name: <Text style={styles.bold}>{address?.displayName || address?.fullName || order?.consumerName}</Text></Text>

          }{
            order?.consumerEmail && 
                      <Text style={styles.detailText}>Email: <Text style={styles.bold}>{order?.consumerEmail}</Text></Text>

          }
          {
            (address?.mobile ||order?.consumerPhone  ) &&
                      <Text style={styles.detailText}>Phone: <Text style={styles.bold}>{address?.mobile ||order?.consumerPhone }</Text></Text>

          }
          {
            address?.fullAddress &&
                      <Text style={styles.detailText}>Location: <Text style={styles.bold}>{address?.fullAddress}</Text></Text>

          }
          <Text style={styles.detailText}>Payment: <Text style={styles.bold}>{orderPayments?.[0]?.paymentMode}</Text></Text>
          <Text style={styles.detailText}>Status: <Text style={styles.paidStatus}>{orderPayments?.[0]?.paymentStatus}</Text></Text>
        </View>
      </View>

      <View style={styles.statusChange}>
        <Text style={styles.statusText}>Status Change</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>{order?.orderStatus}</Text>
        </View>
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>₹{orderAmount.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>+ ₹{deliveryCharge.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Coupon</Text>
          <Text style={styles.summaryValue}>- ₹{couponAmount.toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total incl. GST</Text>
          <Text style={styles.totalAmount}>₹{orderTotal.toFixed(2)}</Text>
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', flexGrow: 1 },
  header: { fontSize: 20, fontFamily: Fonts.bold, marginBottom: 16, textAlign: 'center' },
  orderIdRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  orderIdLabel: { fontSize: 16, fontFamily: Fonts.regular },
  orderId: { fontSize: 18, fontFamily: Fonts.bold, color: '#007aff' },
  itemContainer: { flexDirection: 'row', marginBottom: 16, backgroundColor: '#f9f9f9', borderRadius: 10, padding: 10 },
  image: { width: 80, height: 80, borderRadius: 8, marginRight: 10 },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 16, fontFamily: Fonts.bold },
  qtyRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  itemQty: { fontSize: 14, fontFamily: Fonts.regular, color: '#555' },
  modifierContainer: { marginTop: 6 },
  modifierText: { fontSize: 13, fontFamily: Fonts.regular, color: '#333' },
  section: { marginTop: 10 },
  sectionTitle: { fontSize: 16, fontFamily: Fonts.bold, marginBottom: 10 },
  detailBox: { padding: 10, borderWidth: 1, borderColor: '#eee', borderRadius: 10 },
  detailText: { fontSize: 14, fontFamily: Fonts.regular, marginBottom: 4 },
  bold: { fontFamily: Fonts.bold },
  paidStatus: { fontFamily: Fonts.bold, color: 'green' },
  statusChange: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  statusText: { fontSize: 14, fontFamily: Fonts.bold },
  statusBadge: { backgroundColor: '#e0e0ff', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12, marginLeft: 10 },
  statusBadgeText: { fontSize: 12, color: '#666', fontFamily: Fonts.bold },
  summary: { marginTop: 20, borderTopWidth: 1, borderTopColor: '#ccc', paddingTop: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 15, fontFamily: Fonts.regular },
  summaryValue: { fontSize: 15, fontFamily: Fonts.regular },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, borderTopWidth: 1, borderTopColor: '#ccc', paddingTop: 10 },
  totalText: { fontSize: 16, fontFamily: Fonts.bold },
  totalAmount: { fontSize: 16, fontFamily: Fonts.bold },
});

export default OrderDetail;
