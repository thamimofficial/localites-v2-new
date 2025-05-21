import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import Button from '../components/Button/ButtonStyle';
import { apiBase, apiService } from '../services/api';
import Loader from '../components/Loader/Loader';
import { useDispatch } from 'react-redux';
import { setLocation } from '../redux/slice/locationSlice';
import StorageService from '../services/StorageService/storageService';
import Colors from '../constants/Colors';
import Fonts from '../constants/Font';

export default function Location() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Dropdown states
  const [openState, setOpenState] = useState(false);
  const [openCity, setOpenCity] = useState(false);
  const [openArea, setOpenArea] = useState(false);
  const [isLoading,setIsLoading] = useState(false);

  // Selected values
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);

  // Dynamic dropdown data
  const [tier2Communities, setTier2Communities] = useState([]);
  const [tier3Communities, setTier3Communities] = useState([]);
  const [tier4Communities, setTier4Communities] = useState([]);

  // Fetch Tier 2 Communities (States)
  const getTier2Communities = async () => {
    try {
      const response = await apiService.post(`/community/tiertwo/list`, {});
    
      const tier2List = response.data.map(item => ({ label: item.name, value: item.id }));

      {tier2List.length > 0 ? setSelectedState(tier2List[0].value) :setSelectedArea("Tamil Nadu") }
      setTier2Communities(tier2List);
    } catch (error) {
      console.error('Error fetching Tier 2 communities:', error);
    }
  };

  // Fetch Tier 3 Communities (Cities)
  const getTier3Communities = async (stateId) => {
    setIsLoading(true);

    try {
      const response = await apiService.post(`/community/locationwise/list`, { communityId: stateId });
      const tier3List = response.data.items.map(item => ({
        label: item.Code.charAt(0).toUpperCase() + item.Code.slice(1),
        value: item.Id,
      }));


      setTier3Communities(tier3List);
      setIsLoading(false);

    } catch (error) {
      console.error('Error fetching Tier 3 communities:', error);
    }
  };

  // Fetch Tier 4 Communities (Areas)
  const getTier4Communities = async (cityId) => {
    
    try {
      const response = await apiService.post(`/community/parent/list`, { communityId: cityId });
      const tier4List = response.data.map(item => ({ label: item.name, value: item.id }));

      setTier4Communities(tier4List);
        } catch (error) {
      console.error('Error fetching Tier 4 communities:', error);
    }
  };

  // Fetch states on mount
  useEffect(() => {
    getTier2Communities();
  }, []);

  // Fetch cities when a state is selected
  useEffect(() => {
    if (selectedState) {
      getTier3Communities(selectedState);
    }
  }, [selectedState]);

  // Fetch areas when a city is selected
  useEffect(() => {
    if (selectedCity) {
      getTier4Communities(selectedCity);
    }
  }, [selectedCity]);


  const handleNext = async ()=>{
    const code = tier4Communities.find(item => item.value == selectedArea);
    console.log("code",code)

    const locationData = {
      // state:selectedState,
      // city:selectedCity,
      communityId:selectedArea,
      code : code?.label
    }
    dispatch(setLocation(locationData))
     await StorageService.setItem("userLocation",locationData);
     await StorageService.setItem("communityId",locationData?.communityId);
     await StorageService.setItem("code",locationData?.code);
     await StorageService.setItem("communityId",selectedArea);
     console.log("selectedArea",selectedArea)
  


    navigation.replace('Home')
    
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Your Location</Text>
      <Text style={styles.subText}>Choose your primary residence area to view local retail products and services</Text>

      {/* State Dropdown */}
      <Loader visible={isLoading}/>
         <DropDownPicker
    
        value={selectedState}
        items={tier2Communities}
        placeholder="Tamil Nadu"
        containerStyle={styles.dropdown}
        style={styles.disabledDropdown}
        dropDownContainerStyle={styles.dropdownContainerStyle}
        disabled={true}
                   textStyle={styles.dropdownText}
            labelStyle={styles.dropdownLabel}
            placeholderStyle={styles.dropdownPlaceholder}
      />
      
   

      {/* City Dropdown (Shown only if state is selected) */}
        <DropDownPicker
          open={openCity}
          setOpen={setOpenCity}
          value={selectedCity}
          setValue={setSelectedCity}
          items={tier3Communities}
          placeholder="Choose City"
          containerStyle={styles.dropdown}
          style={styles.dropdownStyle}
          selectedItemContainerStyle = {styles.selectedItemContainer}
          dropDownContainerStyle={styles.dropdownContainerStyle}
          zIndex={2000}
          textStyle={styles.dropdownText}
          labelStyle={styles.dropdownLabel}
          placeholderStyle={styles.dropdownPlaceholder}
        />
     

      {/* Area Dropdown (Shown only if city is selected) */}
        <DropDownPicker
          open={openArea}
          setOpen={setOpenArea}
          value={selectedArea}
          setValue={setSelectedArea}
          items={tier4Communities}
          placeholder="Choose Area"
          containerStyle={styles.dropdown}
          selectedItemContainerStyle = {styles.selectedItemContainer}
          style= {!selectedCity ? styles.disabledDropdown:styles.dropdownStyle}
          disabled = {!selectedCity}
          dropDownContainerStyle={styles.dropdownContainerStyle}
          zIndex={1000}
           textStyle={styles.dropdownText}
            labelStyle={styles.dropdownLabel}
            placeholderStyle={styles.dropdownPlaceholder}
        />
      

      {/* Next Button */}
      <Button
        style={styles.button}
        title="Next"
        // onPress={() => { navigation.navigate('Home', { state: selectedState, city: selectedCity, code: selectedArea, Name:selectedArea.name })}}

        onPress={handleNext}
        disabled={ !selectedArea || !selectedCity}
        
      />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
    padding: 20,
  },
  title: {
    fontSize: 32,
    color: Colors.Text,
    fontFamily:Fonts.bold,
    marginTop: 46,
  },
  subText: {
    fontSize: 16,
    color: Colors.Text,
    fontFamily:Fonts.regular,
    marginBottom: 20,
  },
  dropdown: {
    marginBottom: 15,
  },
  dropdownStyle: {
    backgroundColor: Colors.Background,
    borderColor:Colors.BorderColor,
    borderRadius:10,
    paddingHorizontal:10
  },
  disabledDropdown :{
    backgroundColor: '#EAEAEA',
    borderColor: '#DADADA',
    fontFamily:Fonts.regular,
  },
  dropdownContainerStyle: {
    backgroundColor: Colors.Background,
    borderColor: '#ddd',

  },
  selectedItemContainer: {
    backgroundColor: '#FEC77D', // Apply highlight color for default & selected
  },
  button: {
    width: 20,
    marginTop: 500,
  },
    dropdownText: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: Colors.Text,
  },
  dropdownLabel: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.Text,
  },
  dropdownPlaceholder: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: '#888',
  },

});