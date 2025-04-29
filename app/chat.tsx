import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
  Dimensions,
  Animated,
  Keyboard,
} from "react-native";
import axios from "axios";

const GEMINI_API_KEY = "AIzaSyCyq5_2H4g92yvOjFDhbyOsk9asqJKsjNE";

export default function Chat() {
  const [messages, setMessages] = useState<{ id: string; text: string; isUser: boolean; timestamp: string }[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: string; parts: { text: string }[] }[]>([]);
  const flatListRef = useRef<FlatList<{ id: string; text: string; isUser: boolean; timestamp: string }> | null>(null);

  const keyboardHeight = useRef(new Animated.Value(0)).current;
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const welcomeMessage = {
      id: "1",
      text: "Welcome! I am your medical emergency assistant. I can guide you through first aid steps and emergency situations. What urgent medical situation are you facing?",
      isUser: false,
      timestamp: new Date().toISOString(),
    };

    setMessages([welcomeMessage]);
    setChatHistory([
      {
        role: "model",
        parts: [{ text: welcomeMessage.text }],
      },
    ]);

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        setKeyboardVisible(true);
        Animated.timing(keyboardHeight, {
          toValue: e.endCoordinates.height,
          duration: 150,
          useNativeDriver: false,
        }).start();
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
        Animated.timing(keyboardHeight, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false,
        }).start();
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const addMessageToHistory = (text: string, isUserMessage: boolean) => {
    const role = isUserMessage ? "user" : "model";
    const newHistoryItem = {
      role: role,
      parts: [{ text: text }],
    };

    setChatHistory((prev) => [...prev, newHistoryItem]);
  };

  const sendMessage = async () => {
    if (inputText.trim() === "") return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    addMessageToHistory(inputText, true);

    const currentText = inputText;
    setInputText("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: currentText,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const aiResponse = response.data.candidates[0].content.parts[0].text;

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date().toISOString(),
      };

      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      addMessageToHistory(aiResponse, false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Gemini API Error:", error.response?.data || error.message);
      } else {
        console.error("Unexpected Error:", error);
      }

      const errorText =
        (axios.isAxiosError(error) && error.response?.data?.error?.message) ||
        "There is an issue with the API call. Please ensure your internet connection.";

      Alert.alert("Error", errorText, [{ text: "OK" }]);

      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I cannot respond at this time. Please try again later.",
        isUser: false,
        timestamp: new Date().toISOString(),
      };

      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }

    setIsLoading(false);
  };

  const clearChat = () => {
    Alert.alert(
      "Clear Chat",
      "Are you sure you want to clear the chat history?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          onPress: () => {
            const welcomeMessage = {
              id: "1",
              text: "Chat has been cleared. How can I help you?",
              isUser: false,
              timestamp: new Date().toISOString(),
            };

            setMessages([welcomeMessage]);
            setChatHistory([
              {
                role: "model",
                parts: [{ text: welcomeMessage.text }],
              },
            ]);
          },
          style: "destructive",
        },
      ]
    );
  };

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        if (flatListRef.current) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      }, 100);
    }
  }, [messages]);

  const formatTime = (timestamp: string | undefined) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderMessage = ({ item }: { item: { id: string; text: string; isUser: boolean; timestamp: string } }) => (
    <View
      style={[
        styles.messageBubble,
        item.isUser ? styles.userBubble : styles.aiBubble,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.isUser ? styles.userText : styles.aiText,
        ]}
      >
        {item.text}
      </Text>
      <Text
        style={[
          styles.timeText,
          item.isUser ? styles.userTimeText : styles.aiTimeText,
        ]}
      >
        {formatTime(item.timestamp)}
      </Text>
    </View>
  );

  const renderListHeader = () => (
    <View style={styles.chatHeader}>
      <View style={styles.aiInfoContainer}>
        {/* <Image
          source={{ uri: "https://via.placeholder.com/40" }}
          style={styles.aiAvatar}
        /> */}
        <View>
          <Text style={styles.aiName}>QuickFistAid AI</Text>
          <Text style={styles.aiStatus}>Online</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.clearButton} onPress={clearChat}>
        <Text style={styles.clearButtonText}>Clear All</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0050b3" />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <Animated.View
          style={[
            styles.chatContainer,
            { paddingBottom: isKeyboardVisible ? 5 : 5 },
          ]}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            style={styles.messageList}
            contentContainerStyle={styles.messageListContent}
            ListHeaderComponent={renderListHeader}
            onContentSizeChange={() => {
              if (messages.length > 0) {
                flatListRef.current?.scrollToEnd({ animated: true });
              }
            }}
          />
        </Animated.View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Enter Message here ..."
            placeholderTextColor="#888"
            multiline
            maxLength={1000}
          />
          {isLoading ? (
            <ActivityIndicator
              size="small"
              color="#0084ff"
              style={styles.loadingIndicator}
            />
          ) : (
            <TouchableOpacity
              style={[
                styles.sendButton,
                inputText.trim() === "" && styles.disabledButton,
              ]}
              onPress={sendMessage}
              disabled={inputText.trim() === ""}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0050b3",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    height: 60,
    backgroundColor: "#0050b3",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  aiInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  // aiAvatar: {
  //   width: 40,
  //   height: 40,
  //   borderRadius: 20,
  //   marginRight: 10,
  // },
  aiName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  aiStatus: {
    color: "#4CAF50",
    fontSize: 12,
  },
  clearButton: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 15,
  },
  clearButtonText: {
    color: "#f44336",
  },
  messageList: {
    flex: 1,
    padding: 10,
  },
  messageListContent: {
    paddingBottom: 10,
  },
  messageBubble: {
    borderRadius: 20,
    padding: 12,
    marginVertical: 5,
    maxWidth: "80%",
    minWidth: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  userBubble: {
    backgroundColor: "#fe2238",
    alignSelf: "flex-end",
    borderBottomRightRadius: 5,
    marginLeft: width * 0.2,
  },
  aiBubble: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 5,
    marginRight: width * 0.2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: "#fff",
  },
  aiText: {
    color: "#333",
  },
  timeText: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  userTimeText: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  aiTimeText: {
    color: "rgba(0, 0, 0, 0.5)",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#e4e4e4",
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 120,
    minHeight: 40,
    color: "#333",
    textAlignVertical: "center",
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#fe2238",
    width: 70,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#a0a0a0",
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loadingIndicator: {
    marginLeft: 10,
    width: 70,
    height: 40,
  },
});
