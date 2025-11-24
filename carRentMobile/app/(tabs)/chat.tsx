import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import ChatBox from '../../components/ChatBox';

export default function ChatScreen() {
  const [conversationId, setConversationId] = useState<string | undefined>();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'AI Assistant',
          headerStyle: { backgroundColor: '#007AFF' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <View style={styles.container}>
        <ChatBox
          conversationId={conversationId}
          onConversationIdChange={setConversationId}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
