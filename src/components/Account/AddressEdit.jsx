import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Dimensions, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import BackButton from '../CoreComponent/BackButton/BackButton';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Loader from '../Loader/Loader';
import { apiService } from '../../services/api';
import { useNavigation, useRoute } from '@react-navigation/native';
import StorageService from '../../services/StorageService/storageService';
import DropDownPicker from 'react-native-dropdown-picker';
import Colors from '../../constants/Colors';
import AlertBox from '../CoreComponent/AlertBox/AlertBox';
import Fonts from '../../constants/Font';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function AddressEdit() {
  const route = useRoute();
  const navigation = useNavigation();
  const { addressId, typeId } = route.params || {};
  const isNew = !addressId;

  const [formData, setFormData] = useState({
    fullName: '',
    displayName: '',
    mobile: '',
    fullAddress: '',
    city: '',
    state: 'Tamil Nadu',
    pinCode: '',
    country: 'India',
    addressId: addressId || '',
    typeId: typeId || null,
    isDefault: false,
  });

  const [loading, setLoading] = useState(false);
  const [isDefault, setIsDefault] = useState(false);
  const [addressType, setAddressType] = useState(typeId || null);
  const [addressTypeItems, setAddressTypeItems] = useState([]);
  const [location, setLocation] = useState(null);
  const [locationItems, setLocationItems] = useState([]);
  const [countryCode, setCountryCode] = useState('+91');
  const [countryCodeItems, setCountryCodeItems] = useState([]);
  const[dropdownOpen,setDropdownOpen] = useState();
  const[addressTypeOpen,setAddressTypeOpen] = useState(false);
  const[locationOpen,setLocationOpen] = useState(false);
  const[countryCodeOpen,setCountryCodeOpen] = useState(false);
  const[modelVisible,setModalVisible] = useState(false);
  const[alertTitle,setAlertTitle] = useState(false);
  const[alertMessage,setAlertMessage] = useState(false)

  

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isValid = () => {
    const { displayName, fullAddress, mobile, pinCode } = formData;
    const requiredFields = { displayName, fullAddress, mobile,  pinCode };
    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value) {
        setAlertTitle('Validatation Error')
        setAlertMessage( `${key} is required`);
        setModalVisible(true)

        return false;
      }
    }
    return true;
  };

  const getAddress = async () => {
    if (!addressId) return;
    setLoading(true);
    try {
      const userId = await StorageService.getItem('userId');
      const token = await StorageService.getItem('sessionId');
      const response = await apiService.post(`/address/query/${userId}`, {}, token);
      const address = response.data?.find((addr) => addr.id === addressId);
      if (address) {
        setFormData({
          ...address,
          mobile: address.mobile?.startsWith('+91') ? address.mobile.slice(3) : address.mobile,
          addressId: address.id,
          typeId: address.addressTypeId,
        });
        setIsDefault(address.isDefault);
        setAddressType(address.addressTypeId);
        setLocation(address.locationId);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!isValid()) return;
    setLoading(true);
    try {
      const token = await StorageService.getItem('sessionId');
      const inputData = {
        ...formData,
        mobile: `${countryCode}${formData.mobile}`,
        addressTypeId: addressType,
        locationId: location,
        isDefault,
      };
      if (addressId) {
        await apiService.put(`/address/${addressId}`, inputData, token);
      } else {
        await apiService.post(`/address`, inputData, token);
      }
      navigation.replace('Address');
    } catch (error) {
      console.error('Error saving address:', error);
    } finally {
      setLoading(false);
    }
  };

  const initLookup = async () => {
    try {
      const response = await apiService.post('/options/lookup', {
        lookups: {
          AddressType: { default: true },
          Tier4Locations: { default: true },
          CountryCode: { default: false },
        },
        filters: {},
      });
      setAddressTypeItems(
        response.data.AddressType.map((item) => ({ label: item.text, value: item.id }))
      );
      setLocationItems(
        response.data.Tier4Locations.map((item) => ({ label: item.text, value: item.id }))
      );
      setCountryCodeItems(
        response.data.CountryCode.map((item) => ({ label: item.text, value: item.code }))
      );
      setCountryCode(response.data.CountryCode?.[0]?.code || '+91');
    } catch (error) {
      console.error('Error initializing lookup:', error);
    }
  };

  useEffect(() => {
    initLookup();
    if (isNew) {
      setFormData((prev) => ({ ...prev, mobile: '' }));
    } else {
      getAddress();
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>Addresses</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          {loading ? <Loader loading={loading} /> : <Text style={styles.save}>Save</Text>}
        </TouchableOpacity>
      </View>

      {loading && <Loader loading={loading} />}
      <ScrollView>
        <Text style={styles.sectionLabel}>Default</Text>
        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => {
            const updated = !isDefault;
            setIsDefault(updated);
            if (updated) setAddressType(1);
          }}
        >
          <Text style={styles.toggleText}>Set as Default</Text>
          <FontAwesome
            name={isDefault ? 'toggle-on' : 'toggle-off'}
            size={30}
            color={isDefault ? '#4CAF50' : '#A9A9A9'}
          />
        </TouchableOpacity>
        

        <View style={styles.inputContainer}>
        <TextInput
            style={styles.input}
            placeholder="Full name(e.g., Mom's House)"
            placeholderTextColor={Colors.LightGrey}
            value={formData.fullName}
            onChangeText={(text) => handleChange('fullName', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Display Name (e.g., Mom's House)"
            placeholderTextColor={Colors.LightGrey}
            value={formData.displayName}
            onChangeText={(text) => handleChange('displayName', text)}
          />

          <DropDownPicker
            open={addressTypeOpen}
            value={addressType}
            items={addressTypeItems}
            setOpen={setAddressTypeOpen}
            setValue={setAddressType}
            placeholder="Select Address Type"
            zIndex={3000}
            zIndexInverse={1000}
            containerStyle={{ marginBottom: dropdownOpen ? 150 : 20 }}
            listMode="SCROLLVIEW"
          />

          <DropDownPicker
            open={locationOpen}
            value={location}
            items={locationItems}
            setOpen={setLocationOpen}
            setValue={setLocation}
            placeholder="Select Location"
            zIndex={2000}
            zIndexInverse={1000}
            style={styles.selecte}
            containerStyle={{ marginBottom: dropdownOpen ? 150 : 20, }}
            listMode="SCROLLVIEW"
          />

          <TextInput
            style={styles.input}
            placeholder="Full Address"
            placeholderTextColor={Colors.LightGrey}
            value={formData.fullAddress}
            onChangeText={(text) => handleChange('fullAddress', text)}
          />

          {/* <TextInput
            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
            placeholder="Landmark"
            placeholderTextColor={Colors.LightGrey}
            multiline
            numberOfLines={4}
            value={formData.landmark}
            onChangeText={(text) => handleChange('landmark', text)}
          /> */}


          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.smallInput]}
              placeholder="City"
              placeholderTextColor={Colors.LightGrey}
              value={formData.city}
              onChangeText={(text) => handleChange('city', text)}
            />
           <TextInput
              style={[styles.input, styles.smallInput]}
              placeholder="Tamil Nadu"
              placeholderTextColor={Colors.LightGrey}
              value={formData.state}
              editable={false}
            /> 
          </View>

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.smallInput]}
              placeholder="PIN Code"
              placeholderTextColor={Colors.LightGrey}
              value={formData.pinCode}
              onChangeText={(text) => handleChange('pinCode', text)}
            />
             <TextInput
              style={[styles.input, styles.smallInput]}
              placeholder="Country"
              placeholderTextColor={Colors.LightGrey}
              value={formData.country}
              editable={false}
            /> 
          </View>
          
          <View style={styles.row}>
          <TextInput
    style={[styles.input, styles.countryCodeInput]}
    value={countryCode}
    editable={false}
  />
 <TextInput
    style={[styles.input, styles.largeInput]}
    placeholder="Phone Number *"
    placeholderTextColor={Colors.LightGrey}
    keyboardType="phone-pad"
    value={formData.mobile}
    onChangeText={(text) => {
      const sanitizedText = text.replace(/[^0-9]/g, '');
      if (sanitizedText.length <= 10) {
        handleChange('mobile', sanitizedText);
      } else {
        Alert.alert('Invalid Input', 'Mobile number can only have 10 digits.');
      }
    }}
  />
          </View>
        </View>
          <AlertBox
        visible={modelVisible}
        onClose={() => setModalVisible(false)} // Only close when the user clicks "Okay"
        title={alertTitle}
        body={alertMessage} // Show OTP sent message
        buttonText="Ok"
      />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cancel: {
    fontSize: 16,
    color: Colors.Text,
  },
  title: {
    fontSize: 18,
     fontFamily:Fonts.bold,
    color: Colors.Text,
  },
  save: {
    fontSize: 16,
    color: Colors.primary,
        fontFamily:Fonts.semiBold
  },
  sectionLabel: {
    fontSize: 16,
       fontFamily:Fonts.semiBold,
    marginBottom: 10,
    color: Colors.Text,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.TextInputBackground,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  toggleText: {
    fontSize: 16,
    color: Colors.Text,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.LightGrey,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: Colors.Background,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  smallInput: {
    flex: 1,
    marginRight: 10,
  },
  largeInput: {
    flex: 3,
  },
  countryCodeInput: {
    width: 70,
    borderWidth: 1,
    borderColor: Colors.LightGrey,
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    backgroundColor: Colors.TextInputBackground,
    textAlign: 'center',
  },
  
});
