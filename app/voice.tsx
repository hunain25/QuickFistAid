// VoiceChatScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Voice from '@react-native-voice/voice';
import * as Speech from 'expo-speech';

export default function VoiceChatScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [userText, setUserText] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResultsHandler;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechResultsHandler = (event: { value?: string[] }) => {
      if (event.value && event.value.length > 0) {
          const text = event.value[0];
          setUserText(text);
          getAIResponse(text);
      } else {
          console.error('No speech results received.');
      }
  };

  const startRecording = async () => {
    try {
      setIsRecording(true);
      await Voice.start('en-US');
    } catch (error) {
      console.error('Voice Start Error:', error);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setIsRecording(false);
    } catch (error) {
      console.error('Voice Stop Error:', error);
    }
  };

  const getAIResponse = async (message: any) => {
    setLoading(true);
    try {
      const response = await fetch('https://api.pawan.krd/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'pai-001',
          messages: [{ role: 'user', content: message }],
        }),
      });

      const data = await response.json();
      const reply = data.choices[0].message.content;
      setAiResponse(reply);
      Speech.speak(reply);
    } catch (error) {
      console.error('AI API Error:', error);
      setAiResponse('Sorry, something went wrong.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🎙️ AI Voice Assistant</Text>

      <View style={styles.chatBox}>
        <Text style={styles.label}>You:</Text>
        <Text style={styles.text}>{userText || 'Press the mic and start speaking...'}</Text>

        <Text style={styles.label}>AI:</Text>
        {loading ? (
          <ActivityIndicator size="small" color="#555" />
        ) : (
          <Text style={styles.text}>{aiResponse}</Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.micButton, isRecording && { backgroundColor: '#ff4d4d' }]}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Text style={styles.micText}>{isRecording ? 'Stop' : 'Start Talking'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 30,
  },
  chatBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 40,
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
  },
  micButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: 'center',
  },
  micText: {
    color: '#fff',
    fontSize: 18,
  },
});
