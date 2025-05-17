import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Fonts from '../../../constants/Font';
import Colors from '../../../constants/Colors';
import { apiBase, apiService } from '../../../services/api';
import StorageService from '../../../services/StorageService/storageService';
import Images from '../../../constants/Images';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock userId to identify if message is sent by "me"

// Static Data


// const mockChatData = {
//   messages: [
//     {
//       threadId: "997835ee-fce4-4ede-bec4-fbae4855382f",
//       targetUserId: 11376,
//       targetUserName: "GP",
//       msgDateTime: "2025-04-11T08:35:12.747",
//       msgBody: "Hi",
//       msgByName: "Thamim Ansari",
//       msgById: 11508,
//       msgStatus: "Read",
//       id: 1162
//     },
//     {
//       threadId: "997835ee-fce4-4ede-bec4-fbae4855382f",
//       targetUserId: 11508,
//       targetUserName: "Thamim Ansari",
//       msgDateTime: "2025-04-11T08:35:37.91",
//       msgBody: "hello",
//       msgByName: "GP",
//       msgById: 11376,
//       msgStatus: "Read",
//       id: 1163
//     },
//     {
//       threadId: "997835ee-fce4-4ede-bec4-fbae4855382f",
//       targetUserId: 11376,
//       targetUserName: "GP",
//       msgDateTime: "2025-04-25T11:17:00.183",
//       msgBody: "test message",
//       msgByName: "Thamim",
//       msgById: 11508,
//       msgStatus: "Read",
//       id: 1175
//     },
//     {
//       threadId: "997835ee-fce4-4ede-bec4-fbae4855382f",
//       targetUserId: 11508,
//       targetUserName: "Thamim Ansari",
//       msgDateTime: "2025-04-25T11:17:44.423",
//       msgBody: "hello super star Thamim ",
//       msgByName: "GP",
//       msgById: 11376,
//       msgStatus: "Read",
//       id: 1176
//     },
//   ],
// };

const DirectMessage = ({ navigation, route }) => {
  const { inputId, typeName } = route.params;

  const [chatMessages, setChatMessages] = useState();
  const [messageText, setMessageText] = useState('');

  const [threadId, setThreadId] = useState()
  const [stall, setStall] = useState()

  
  const [userId, setUserId] = useState()
  

  useEffect(() => {
    console.log('Input received:', inputId, typeName);
    getStallById()
    // Optionally: Fetch chat messages here instead of using mock
    checkMessageThreadByContext()
  }, []);



  const getInputData = () => {
    const inputData = {};
    if (typeName === "stallId") {
      inputData.entityTypeId = 1; // 1-Stall
      inputData.id = inputId;
    }
    else if (typeName === "orderId") {
      inputData.entityTypeId = 2; // 2-Order
      inputData.id = inputId;
    }
    else if (typeName === "postId") {
      inputData.entityTypeId = 3; // 3-Post
      inputData.id = inputId;
    }
    else if (typeName === "saleOrderId") {
      inputData.entityTypeId = 4; // 4-Sale Order
      inputData.id = inputId;
    }
    else if (typeName === "followedUserId") {
      inputData.entityTypeId = 5; // 5-User
      inputData.id = inputId;
    }
    return inputData;
  };

  const checkMessageThreadByContext = async () => {
    const inputData = getInputData();
    const token = await StorageService.getItem('sessionId');
    const userId = await StorageService.getItem('userId');
    setUserId(userId)

    try {
      const response = await apiService.post(`/message/order/thread`, inputData, token);
      console.log('checkMessageThreadByContext:', response.data);
      setThreadId(response.data?.threadId)
      if(response.data?.threadId){
        const ThreadId = response.data?.threadId
        getMessages(ThreadId)
      }else{console.log('id illa')}
      return response.data;
    } catch (error) {
      console.error('Error checkMessageThreadByContext:', error);
      throw error;
    }
  };

  const getMessages = async (ThreadId) => {
    const userId = await StorageService.getItem('userId')
    const inputData = {
      threadId: ThreadId,
      userId: userId
    }
    console.log('Input data from getmsg',inputData)
    const token = await StorageService.getItem('sessionId');

    try {
      const response = await apiService.post(`/message/thread/query`,inputData, token);
      console.log('getMessages:', response.data);
      console.log('getMessages:', response.data.messages);
      setChatMessages(response.data.messages)
      return response.data;
    } catch (error) {
      console.error('Error getMessages:', error);
      throw error;
    }
  };

  const getStallById = async () => {
    const token = await StorageService.getItem('sessionId');

    try {
      const response = await apiService.get(`/stall/${inputId}`, token);
      console.log('getStallById:', response.data);
      setStall(response.data)
      return response.data;
    } catch (error) {
      console.error('Error getStallById:', error);
      throw error;
    }
  };

  const getLocalBusinessById = async () => {
    const inputData = getInputData();
    const token = await StorageService.getItem('sessionId');

    try {
      const response = await apiService.get(`/localbusinessdirectory/${inputId}`, token);
      console.log('getLocalBusinessById:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getLocalBusinessById:', error);
      throw error;
    }
  };

  const sendMessage = async () => {
    const userId = await StorageService.getItem('userId');
    const inputData =   {
      threadId:  threadId || null,
      msgBody: messageText,
      userId: userId,
      entityId: inputId,
      msgEntityTypeId: 1
    }
    console.log("input dataaaa", inputData)
    const token = await StorageService.getItem('sessionId');

    if(!userId && !token) Alert.alert("Alert","Please Login")

    try {
      const response = await apiService.post(`/message/send`,inputData, token);
      console.log('sendMessage:', response.data);
      if(response.data.threadId){setMessageText()
        checkMessageThreadByContext()
      }
      return response.data;
    } catch (error) {
      console.error('Error sendMessage:', error);
      throw error;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Image
          source={{ uri: `${apiBase?.imagePath}${stall?.imagePath}`}}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>  
          <Text style={styles.username}>{stall?.name}</Text>
          <Text style={styles.status}>{stall?.providerName}</Text>
        </View>
      </View>

      {/* Chat Area */}
      <ScrollView style={styles.chatArea}>
      {chatMessages ? (
      chatMessages.map((msg, index) => (
        <ChatBubble
          key={msg.id || index}
          text={msg.msgBody}
          time={formatTime(msg.msgDateTime)}
          isSender={msg.msgById == userId}
        />
      ))
    ) : (
      <View style={styles.noMessagesContainer}>
       <Image 
        source={typeof Images?.noMessage === 'string' ? { uri: Images?.noMessage } : Images?.noMessage}
        style={styles.noMessagesImage}
        />
        <Text style={styles.noMessagesText}>No Messages</Text>
      </View>
    )}

      </ScrollView>

      {/* Message Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={90}
      >
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Write your message"
            placeholderTextColor={Colors.Text}
            style={styles.input}
            value={messageText}
            onChangeText={setMessageText}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
             <FontAwesome
                        name={"send"}
                        size={24}
                        color={Colors.White}
                      />
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const ChatBubble = ({ text, time, isSender }) => {
  return (
    <View style={[styles.bubbleContainer, isSender ? styles.sentAlign : styles.receivedAlign]}>
      <View style={[styles.bubble, isSender ? styles.sent : styles.received]}>
        <Text style={{ fontFamily: Fonts.regular }}>{text}</Text>
      </View>
      <Text style={styles.time}>{time}</Text>
    </View>
  );
};

// Helper to format ISO time like '10:00 AM'
const formatTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    elevation: 4
  },
  backArrow: {
    fontSize: 22,
    marginRight: 15,
    color: '#333'
  },
  avatar: {
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    marginRight: 15
  },
  userInfo: {
    flexDirection: 'column'
  },
  username: {
    fontFamily: Fonts.bold,
    fontSize: 16
  },
  status: {
    fontSize: 12,
    color: 'green',
    fontFamily: Fonts.regular
  },
  chatArea: {
    flex: 1,
    padding: 10,
  },
  bubbleContainer: {
    marginVertical: 5
  },
  sentAlign: {
    alignSelf: 'flex-end'
  },
  receivedAlign: {
    alignSelf: 'flex-start'
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 10
  },
  sent: {
    backgroundColor: '#e0f7fa'
  },
  received: {
    backgroundColor: '#ffe0b2'
  },
  time: {
    fontSize: 10,
    color: '#888',
    marginTop: 3,
    fontFamily: Fonts.regular
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd'
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#e8e8e8',
    marginRight: 10,
    fontFamily: Fonts.regular
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: Colors.primary,
    borderRadius: 50
  },
  noMessagesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noMessagesImage: {
    width: 100,
    height: 100,
    marginBottom: 10
  },
  noMessagesText: {
    fontSize: 16,
    color: Colors.Text,
    fontFamily: Fonts.bold
  }
});

export default DirectMessage;
