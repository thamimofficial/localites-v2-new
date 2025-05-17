import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { addCart, reduceCart } from '../../redux/cartSlice';
import { apiBase } from '../../services/api';
import Fonts from '../../constants/Font';
import Colors from '../../constants/Colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const StallItem = ({ item , onCustomizeSelect}) => {
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [showQtyBox, setShowQtyBox] = useState(false);
  const [quantity, setQuantity] = useState(0); // ✅ added quantity state

  const dispatch = useDispatch();

const deliveryTimeUnits = {
    1:"Minutes",
    2:"Hours",
    3:"Days"
   }
  const batch = item?.stalltemBatch;
  //console.log(batch)
  const stallItem = item?.stallitem;
  

  const openInfoModal = () => setInfoModalVisible(true);
  const closeInfoModal = () => setInfoModalVisible(false);

  const addQtyToCart = () => {
   // console.log('Adding to cart:', batch);
    dispatch(addCart({ stallId: batch?.stallId, item: batch }));
    setQuantity((prev) => prev + 1); // ✅ increase quantity
  };

  const reduceQtyFromCart = () => {
    dispatch(reduceCart({ stallId: batch?.stallId, item: batch }));
    setQuantity((prev) => (prev > 1 ? prev - 1 : 0)); // ✅ reduce quantity, not below 0
    if (quantity <= 1) {
      setShowQtyBox(false); // ✅ hide box if quantity is 0
    }
  };


  const handleAddClick = () => {
    if (batch?.isCustomized) {
      // console.log('Customize product:', item);
      if (onCustomizeSelect) {
        onCustomizeSelect(item); // 🔁 Send the item to parent
      }
      return;
    } else {
      setShowQtyBox(true);
      addQtyToCart();
    }
  };

  
  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={{ uri: `${apiBase.imagePath}${batch?.imagePath}` }}
          style={styles.image}
        />

        <View style={styles.detailsContainer}>
          <Text style={styles.itemName}>{batch?.itemName}</Text>
          <Text style={styles.unitText}>{batch?.unit}</Text>
          <View style={{display:'flex',flexDirection:'row', gap:10}}>
          <Text style={styles.priceText}>₹{batch?.price}</Text>
          {
            batch.listingPrice !== 0  &&
            <Text style={styles.priceTextStrike}>₹{batch?.listingPrice}</Text>

          }
             
          </View>
          
{/* <View style={{display:"flex",flexDirection:'row',gap:5, marginTop:5}}>
            <MaterialCommunityIcons
                  name="truck-delivery"
                  size={20}
                  color={Colors.primary}
                />
                        <Text style={{ textAlign: 'right', flexWrap: 'wrap' }}>
                          {stallItem.deliveryTime} {deliveryTimeUnits[stallItem.deliveryTimeUnits]}
                        </Text>
          </View> */}

          <View style={styles.quantityContainer}>
            
            {showQtyBox && !batch?.isCustomized ? (
              <View style={styles.quantityBox}>
                <TouchableOpacity style={styles.countButton} onPress={reduceQtyFromCart}>
                  <Text style={styles.countText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity style={styles.countButton} onPress={addQtyToCart}>
                  <Text style={styles.countText}>+</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.addButton} onPress={handleAddClick}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            )}
            
          </View>
        </View>
      </View>

      {/* <TouchableOpacity style={styles.infoIcon} onPress={openInfoModal}>
        <Image
          source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/info.png' }}
          style={styles.infoImage}
        />
      </TouchableOpacity> */}
{/* 
      <Modal visible={infoModalVisible} transparent onRequestClose={closeInfoModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Description</Text>
            <Text style={styles.modalDescription}>{batch?.stallItemDescription}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={closeInfoModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 4,
    marginBottom:14,
    width: 'auto',
    marginHorizontal:10,
    borderWidth:1,
    borderColor:'#F4F7F2',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 15,
  },
  detailsContainer: {
    flex: 1,
  },
  
  itemName: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: '#333',
    marginBottom: 5,
  },
  priceText: {
    fontSize: 15,
    fontFamily: Fonts.semiBold,
    color: 'black',
  },
  priceTextStrike: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: Colors.LightGrey,
    textDecorationLine:'line-through'
  },
  unitText: {
    fontSize: 14,
    color: '#888',
    fontFamily: Fonts.regular,
  },
  quantityContainer: {
    marginTop: 8,
    alignItems:'flex-end',
  },
  quantityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    width: 90,
    borderColor: '#ccc',
    overflow: 'hidden',
  },
  countButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f69516',
    borderRadius:'50%',
    padding:5
  },
  countText: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: 'white',
  },
  quantityText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: 'black',
  },
  addButton: {
    backgroundColor: '#f69516',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderRadius:30,
    
    
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: '#fff',
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
    fontFamily: Fonts.bold,
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
    fontFamily: Fonts.bold,
  },
});

export default StallItem;
