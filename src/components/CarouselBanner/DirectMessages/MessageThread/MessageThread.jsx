import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Fonts from '../../../../constants/Font'

const MessageThread = () => {
  return (
      <View style={[styles.bubbleContainer, isSent ? styles.sentAlign : styles.receivedAlign]}>
      <View style={[styles.bubble, isSent ? styles.sent : styles.received]}>
        <Text style={{ fontFamily: Fonts.regular }}>{text}</Text>
      </View>
      <Text style={styles.time}>{time}</Text>
    </View>
  )
}

export default MessageThread

const styles = StyleSheet.create({})