import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { useSession } from '../../ctx';
import { getUserByID } from '@/database/user';
import { getAllChats } from '@/database/chat';
import RichMenuItem from '@/components/RichMenuItem';
import MenuItem from '@/components/MenuItem';
import { MaterialIcons } from '@expo/vector-icons';

export default function MessagesScreen() {
  const [chats, setChats] = useState([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        // console.log(111)
        const all = await getAllChats();
        // console.log(all)
        setChats(all);
      })();

      return () => {
        console.log("messages route is now unfocused.");
      };
    }, [])
  );
  return (
    <ScrollView style={styles.container}>
      {/* <Text>
        {JSON.stringify(chats)}
      </Text> */}
      <View>
        {chats.map((chat, key) => (
          <TouchableOpacity
            style={{
              borderBottomWidth: 1,
              borderBottomColor: '#ddd',
              padding: 16,
              flexDirection: 'row',
            }}
          >
            <View style={{ backgroundColor: '#555', width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' }}>
              <MaterialIcons name="chat" size={24} color='#fff' />
            </View>
            <View style={{ justifyContent: 'center', marginLeft: 8, }}>
              <Text style={{ fontFamily: 'Inter_700Bold' }}>{`${chat.buyer.name} - ${chat.listing.name}`}</Text>
              <Text style={{ fontFamily: 'Inter_500Medium' }}>last message</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
  }
});