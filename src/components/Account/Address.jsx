import { StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import BackButton from '../../components/CoreComponent/BackButton/BackButton';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation, useRoute } from '@react-navigation/native';
import Colors from '../../constants/Colors';
import { apiService } from '../../services/api';
import StorageService from '../../services/StorageService/storageService';
import Loader from '../Loader/Loader';
import Fonts from '../../constants/Font';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window'); // Dynamic screen size


const Address = () => {
  const navigation = useNavigation();
  const [addressList, setAddressList] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const getAddressList = async () => {
    setLoading(true);
    try {
      const userId = await StorageService.getItem('userId')
      const token = await StorageService.getItem('sessionId');
      const response = await apiService.post(`/address/query/${userId}`, {}, token);
      setAddressList(response.data);
     // console.log('Address List:', response.data);
    } catch (error) {
      console.error('Error fetching address list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAddressList();
  }, []);

  const handleEdit = (address) => {
    navigation.navigate('AddressEdit', {
      addressId: address.id,
      typeId: address.addressTypeId,
    });
  };

  const handleDelete = async (address) => {
    try {
      const token = await StorageService.getItem('sessionId');
      await apiService.delete(`/address/${address.id}`, token);
      getAddressList(); // Refresh list
    } catch (error) {
     console.log('Delete error:', error);
    }
  };

  const handleAdd = () => {
    navigation.navigate('AddressEdit', {
      addressId: null,
      typeId: null,
      isdefault: true,

    });
  };

  const homeAddresses = addressList.filter(
    addr => addr.isDefault === true && addr.addressTypeId === 1
  );
  const otherAddresses = addressList.filter(
    addr => !(addr.isDefault === true && addr.addressTypeId === 1)
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton replaceTo='Account' />
        <Text style={styles.label}>Address</Text>
        <Text style={styles.save}> </Text>
      </View>

      {loading ? (
        <Loader Loading={loading} />
      ) : (
        <ScrollView>
    
          {/* Home */}
          {
            homeAddresses.length > 0 && (
              <>
              <Text style={styles.sectionTitle}>Default</Text>
          <View style={{ gap: 12 }}>
            {  homeAddresses.map(address => (
              <View
                key={address.id}
                style={[styles.option, styles.optionFlexBox]}
              >
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => handleEdit(address)}
                >
                  <Text style={[styles.optionName]} numberOfLines={1}>
                    {address.displayName || 'Home'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleEdit(address)}>
                  <AntDesign name="edit" style={styles.arrowIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(address)}>
                  <AntDesign name="delete" style={styles.arrowIcon} />
                </TouchableOpacity>
              </View>
            ))}
          </View></>
            )
          }
          

          {/* Others */}
          {
            otherAddresses.length >0 &&(
              <>
               <Text style={styles.sectionTitle}>Saved Others</Text>
          <View style={{ gap: 12 }}>
            {otherAddresses.map(address => (
              <View
                key={address.id}
                style={[styles.option, styles.optionFlexBox]}
              >
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => handleEdit(address)}
                >
                  <Text style={[styles.optionName]} numberOfLines={1}>
                    {address.displayName || 'Other'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleEdit(address)}>
                  <AntDesign name="edit" style={styles.arrowIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(address)}>
                  <AntDesign name="delete" style={styles.arrowIcon} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
              </>
            )
          }
         

          {/* Add */}
          {
            addressList.length >=0  &&(
              <>
               <Text style={styles.sectionTitle}>Add New Addresses</Text>
          <View style={{ gap: 12 }}>
            <TouchableOpacity
              style={[styles.optionAdd, styles.optionFlexBox]}
              onPress={handleAdd}
            >
              <Text style={[styles.optionName]} numberOfLines={1}>Add</Text>
              <AntDesign name="plus" style={styles.arrowIcon} />
            </TouchableOpacity>
          </View>
              </>
            )
          }
         
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Address;





const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
    padding: width * 0.05,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

},
label: {
    fontSize: 18,
   fontFamily:Fonts.bold,
    color: Colors.TextColor,
},
  sectionTitle: {
    marginVertical: width * 0.03,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "Sora-Regular",
    color: Colors.Text
  },

  optionFlexBox: {
    overflow: "hidden",
    flex: 1
  },
  icon: {
    fontSize: width * 0.06,
    color: '#000',
    marginRight: width * 0.04,
    backgroundColor: 'transparent'
  },
  optionName: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "Sora-Regular",
    color: "#363a33",
    textAlign: "left"
  },
  option: {
    borderRadius: 8,
    backgroundColor: "#eff2f5",
    width: "100%",
    
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12
  },
  optionAdd: {
    borderRadius: 8,
    width: "100%",
    borderColor:Colors.borderColor,
    borderWidth: 3,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12
  },
  arrowIcon: {
    fontSize: width * 0.05,
    color: '#000',
  }


});
