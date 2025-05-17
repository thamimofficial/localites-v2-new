import { View, Text,StyleSheet,Image } from 'react-native'
import React from 'react'
import Colors from '../../constants/Colors'
import Fonts from '../../constants/Font'
import BackButton from '../../components/CoreComponent/BackButton/BackButton'
import Images from '../../constants/Images'
export default function NoNotifiation() {
  return (
    <View style={styles.container}>
    {/* Header */}
    <View style={styles.header}>
      <BackButton replaceTo="Home" />
      <Text style={styles.label}>Notifications</Text>
    </View>
    <View style={styles.illustrationParent}>
      			<Image style={styles.illustrationIcon} resizeMode="cover" source={{uri:Images.NoNotification}} />
      			<Text style={[styles.noNotification, styles.youHaveNoFlexBox]}>No Notification</Text>
      			<Text style={[styles.youHaveNo, styles.youHaveNoFlexBox]}>You have no notification at this time thank you</Text>
    		</View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.Background,
      paddingHorizontal: 24,
      paddingVertical: 11,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start', // Keep back button to the left
      height: 60, // set a fixed height for accurate centering
      position: 'relative',
      marginBottom: 20,
    },
    label: {
      position: 'absolute',
      left: 0,
      right: 0,
      textAlign: 'center',
      fontSize: 17,
      fontFamily: Fonts.bold,
      color: Colors.Text,
      lineHeight: 22,

    },
    youHaveNoFlexBox: {
        textAlign: "center",
        alignSelf: "stretch"
  },
  illustrationIcon: {
        width: 220,
        height: 208
  },
  noNotification: {
        fontSize: 32,
        lineHeight: 38,
   fontFamily:Fonts.bold,
        color: "#1a1c21"
  },
  youHaveNo: {
        fontSize: 16,
        lineHeight: 26,
        fontFamily: "Sora-Regular",
        color: "#484d57"
  },
  illustrationParent: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        gap: 12,
        marginTop: 100,
  }})