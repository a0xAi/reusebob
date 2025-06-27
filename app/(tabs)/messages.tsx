import { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { useSession } from '../../ctx';
import { getUserByID } from '@/database/user';
import { getAllChats } from '@/database/chat';
import RichMenuItem from '@/components/RichMenuItem';
import MenuItem from '@/components/MenuItem';

export default function MessagesScreen() {
  const [chats, setChats] = useState([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const all = await getAllChats();
        setChats(all);
      })();

      return () => {
        // console.log("This route is now unfocused.");
      };
    }, [])
  );
  return (
    <View style={styles.container}>
      <Text>Zinutes cia</Text>
      <Text>
        {JSON.stringify(chats)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
  }
});