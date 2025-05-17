import { View, Text,StyleSheet ,Dimensions} from 'react-native'
import React from 'react'
import Colors from '../../../../constants/Colors'
import Fonts from '../../../../constants/Font'
import { ScrollView } from 'react-native-gesture-handler'

const{width,height} = Dimensions.get('window') // Dynamic screen size

export default function OrderAddress() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <Text style={styles.cancel}>Cancel</Text>
      <Text style={styles.title}>Change Address</Text>
        {/* <TouchableOpacity onPress={handleSave} disabled={loading}>
          {loading ? <Loader loading={loading} /> : <Text style={styles.save}>Save</Text>}
        </TouchableOpacity> */}
        <Text style={styles.save}>Save</Text>
      </View> 

      <ScrollView>

      <Text style={styles.sectionTitle}>Saved Address</Text>
      <View style={[styles.option, styles.optionFlexBox]}>
      			<View style={styles.optionFlexBox}>
        				<Text style={styles.optionName} numberOfLines={1}>Home</Text>
      			</View>
      			{/* <Radiob style={styles.radioButtonIcon} width={24} height={24} /> */}
    		</View>
    </ScrollView>  
     </View>
  )
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
sectionTitle: {
  marginVertical: width * 0.03,
  fontSize: 16,
  lineHeight: 26,
  fontFamily: Fonts.regular,
  color: Colors.Text
},

optionFlexBox: {
  alignItems: "center",
  flexDirection: "row",
  flex: 1
},
optionName: {
  fontSize: 16,
  lineHeight: 26,
  fontFamily: "Sora-Regular",
  color: "#2e323a",
  textAlign: "left",
  overflow: "hidden",
  flex: 1
},
radioButtonIcon: {
  borderRadius: 24,
  overflow: "hidden"
},
option: {
  alignSelf: "stretch",
  borderRadius: 8,
  backgroundColor: "#eff2f5",
  width: "100%",
  height: 48,
  paddingHorizontal: 16,
  paddingVertical: 12,
  gap: 12,
  overflow: "hidden"
}
})