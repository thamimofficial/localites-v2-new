import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Fonts from '../../constants/Font';
import Colors from '../../constants/Colors';


const HomeHeaderRow = ({ title, actionText, onActionPress}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={onActionPress}>
      <Text  style={styles.actionText}>{actionText}</Text>

      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 13,
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: Fonts.regular,
    color: Colors.TextColor,
    textAlign: 'left',
  },
  actionText: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: Fonts.regular,
    color: Colors.Grey,
    textAlign: 'center',
  },
});

export default HomeHeaderRow;
