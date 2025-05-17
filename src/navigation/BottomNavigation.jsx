import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Fonts from "../constants/Font";
import Colors from "../constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BottomNavigation = ({ defaultTab }) => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const loadStorage = async () => {
      const storedToken = await AsyncStorage.getItem("sessionId");
      setToken(storedToken);
    };
    loadStorage();
  }, []);


  const tabs = token
    ? [
        { name: "Home", icon: "home", screen: "Home" },
        { name: "Account", icon: "account", screen: "Account" },
        { name: "Notification", icon: "message", screen: "Notification" },
        { name: "Menu", icon: "menu", screen: "MenuScreen" },
      ]
    : [
        { name: "Home", icon: "home", screen: "Home" },
        { name: "Login", icon: "login", screen: "Login" },
        { name: "Menu", icon: "menu", screen: "MenuScreen" },
      ];

  const handlePress = (tab) => {
    if(tab.name != "Login"){
    setActiveTab(tab.name);
    navigation.navigate(tab.screen);
  }else {
    setActiveTab(tab.name);
    navigation.replace(tab.screen);
  }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.name}
            style={[styles.tab, activeTab === tab.name && styles.activeTab]}
            onPress={() => handlePress(tab)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name={tab.icon}
              size={24}
              color={activeTab === tab.name ? "#f69516" : "#bbb"}
            />
            <Text
              style={[styles.text, activeTab === tab.name && styles.activeText]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    zIndex: 999,
  },
  container: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: Colors.BorderColor,
    width: screenWidth,
    alignSelf: "center",
    backgroundColor: Colors.White,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
  },
  activeTab: {
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 4,
  },
  text: {
    color: "#bbb",
    fontSize: 12,
    fontFamily: Fonts.regular,
    maxWidth: 70,
  },
  activeText: {
    color: "#f69516",
    fontFamily: Fonts.bold,
  },
});

export default BottomNavigation;
