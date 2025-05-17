import React, { useEffect } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StorageService from "../../services/StorageService/storageService";
import Images from "../../constants/Images";


const { width, height } = Dimensions.get("window");


const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      checkUserData();
    }, 2000);
  }, [navigation]);

  const checkUserData = async () => { 
    try {
      const userLocation = await StorageService.getItem("userLocation");
      const userId = await StorageService.getItem("userId");
      const token = await StorageService.getItem("sessionId");
     // console.log("userLocation from Splash:", userLocation);
      
      if (userLocation) {
        const { code, communityId } = userLocation;
        console.log('code communityId',code, communityId)
       
          if(token && userId && communityId && code){ 
            console.log('token userId',code,userId, communityId)
            navigation.replace("Home");
          }else {
            if (code && communityId) {
              navigation.replace("Home");
            } else {
              navigation.replace("Intro");
            }
          }

        
      } else {
        await AsyncStorage.clear(); // Clear AsyncStorage if userLocation is null
        navigation.replace("Intro");
      }
    } catch (error) {
      console.error("Error checking user data:", error);
      navigation.replace("Intro");
    }
  };

  return (
    <View style={styles.container}>
      <Image 
       source={
                typeof Images?.nameLogo === 'string'
                  ? { uri: Images.nameLogo }
                  : Images?.nameLogo
              }
      style={styles.symbol} />
      <Image 
             source={
              typeof Images?.logo === 'string'
                ? { uri: Images.logo }
                : Images?.logo
            }
      style={styles.logo} />
    </View>
  );
};  


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  symbol: {
    position: "absolute",
    top: (223 / 812) * height,
    left: (width - 150) / 2, // Center horizontally
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  logo: {
    position: "absolute",
    top: (609 / 812) * height,
    left: (width - 150) / 2, // Center horizontally
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
});


export default SplashScreen;
