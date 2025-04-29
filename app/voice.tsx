import React from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import Voice from '@react-native-voice/voice';
import * as Speech from 'expo-speech';

export default function VoiceComponent() {
  const [listening, setListening] = React.useState(false);
  const [userText, setUserText] = React.useState('');
  const [aiText, setAiText] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const startListening = async () => {
    setUserText('');
    setAiText('');
    setListening(true);
    Voice.onSpeechResults = (event) => {
      const text = event.value?.[0] ?? '';
      setUserText(text);
      getAIResponse(text);
    };
    await Voice.start('en-US');
  };

  const getAIResponse = async (text: string) => {
    setLoading(true);
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBK0Gqm_D1ZVjcqWVRKQ8Hken4mJ4rCunA', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text }] }],
        }),
      });

      const data = await response.json();
      const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I did not understand.';
      setAiText(aiReply);
      Speech.speak(aiReply);
    } catch (error) {
      console.error(error);
      setAiText('Error in getting response.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice AI Medical Assistant</Text>
      <Button title={listening ? "Listening..." : "Start Talking"} onPress={startListening} disabled={listening} />
      {loading && <ActivityIndicator size="large" />}
      <Text style={styles.label}>You Said:</Text>
      <Text>{userText}</Text>
      <Text style={styles.label}>AI Reply:</Text>
      <Text>{aiText}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 50 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  label: { fontWeight: 'bold', marginTop: 20 },
});