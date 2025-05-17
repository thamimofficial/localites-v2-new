import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Fonts from '../../constants/Font';

const Button = ({ title, onPress, icon, width = '100%', align = 'center',disabled }) => {
  return (
    <View style={[styles.container, { alignItems: align }]}> 
      <TouchableOpacity style={[styles.button,  { width }, disabled && styles.disabled]} onPress={onPress} disabled={disabled}>
        {/* {icon && <Ionicons name={icon} size={20} color="white" style={styles.icon} />} */}
        <Text style={styles.text}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
   
  },
  button: {
    backgroundColor: '#F69516',
    paddingVertical: 12,
    borderRadius: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    height:56
  },
  disabled:{
    backgroundColor:'#FEC77D'
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily:Fonts.bold,
  },
  icon: {
    marginRight: 8,
  },
});

export default Button;
