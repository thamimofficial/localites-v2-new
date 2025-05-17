import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addCart, reduceCart } from '../../redux/cartSlice';
import { apiBase } from '../../services/api';
import Fonts from '../../constants/Font';

const StallItem = ({ item }) => {
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const openInfoModal = () => setInfoModalVisible(true);
  const closeInfoModal = () => setInfoModalVisible(false);

  const addQtyToCart = (item) => {
    const stallId = item?.stallItemBatch?.stallId;
    dispatch(addCart({ stallId, item }));
  };

  const reduceQtyFromCart = (item) => {
    const stallId = item?.stallItemBatch?.stallId;
    dispatch(reduceCart({ stallId, item }));
  };

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: `${apiBase.imagePath}${item.stalltemBatch.imagePath}` }}
        style={styles.image}
      />

      <View style={styles.detailsContainer}>
        <Text style={styles.itemName}>{item.stalltemBatch.itemName}</Text>

      <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>

        <View>
        <Text style={styles.unitText}>{item.stalltemBatch.unit}</Text>
        <Text style={styles.priceText}>
         ₹{item.stalltemBatch.price}
        </Text>
        </View>

            <View style={styles.quantityContainer}>
              {item.stalltemBatch.quantity > 0 ? (
                <View style={styles.quantityBox}>
                  <TouchableOpacity 
                    style={styles.countButton} 
                    onPress={() => reduceQtyFromCart(item.stalltemBatch)}
                  >
                    <Text style={styles.countText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.stalltemBatch.quantity}</Text>
                  <TouchableOpacity 
                    style={styles.countButton} 
                    onPress={() => addQtyToCart(item.stalltemBatch)}
                  >
                    <Text style={styles.countText}>+</Text>
                  </TouchableOpacity>
                </View>
              ) : item.stalltemBatch.isCustomized ? (
                <TouchableOpacity 
                  style={styles.addButton} 
                  onPress={() => openCustomizeForm(item.stalltemBatch)}
                >
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={styles.addButton} 
                  onPress={() => addQtyToCart(item.stalltemBatch)}
                >
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              )}
            </View>
        </View>
      </View>

      <TouchableOpacity style={styles.infoIcon} onPress={openInfoModal}>
        <Image source={{ uri: 'https://via.placeholder.com/20' }} style={styles.infoImage} />
      </TouchableOpacity>

      <Modal visible={infoModalVisible} transparent={true} onRequestClose={closeInfoModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Description</Text>
            <Text style={styles.modalDescription}>{item.stalltemBatch.stallItemDescription}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={closeInfoModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    width: '100%'
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginRight: 15,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 15,
    fontFamily: "Sora-Regular",
    color: '#333',
    marginBottom: 5,
  },
  priceText: {
    fontSize: 15,
  fontFamily: "Sora-SemiBold",
    color: 'Black',
  },
  unitText: {
    fontSize: 14,
    color: '#888',
  },
  infoIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  infoImage: {
    width: 20,
    height: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
   fontFamily:Fonts.bold,
    marginBottom: 10,
    color: '#333',
  },
  modalDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#fff',
   fontFamily:Fonts.bold,
  },
  quantityContainer: {
    alignItems: 'center',
  },
  quantityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    width:70,
    borderWidth:1
  },
  countButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor:'#f69516'
  },
  countText: {
    fontSize: 18,
   fontFamily:Fonts.bold,
    color: 'white',
  },
  quantityText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
      fontFamily:Fonts.bold,
    color: 'black',
  },
  addButton: {
    backgroundColor: '#ffe6c7',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth:1,
    borderColor:'#f69516'
  },
  addButtonText: {
    fontSize: 14,
    fontFamily:'Sora-Bold',
    color: '#f69516',
  },
});

export default StallItem;