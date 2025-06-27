import { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useSession } from '../../ctx';
import { getUserByID } from '@/database/user';
import RichMenuItem from '@/components/RichMenuItem';
import MenuItem from '@/components/MenuItem';

export default function HomeScreen() {
  const { signOut, session } = useSession();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (session) {
      const fetchUser = async () => {
        const userRaw = await getUserByID(session);
        setUser(userRaw);
      };
      fetchUser();
    }
  }, []);
  return (
    <View style={styles.container}>
      <RichMenuItem
        name={user?.name}
      />
      <View style={{ height: 1, backgroundColor: '#ddd' }} />
      <View>
        <MenuItem icon="all-inbox" onPress={() => alert('Not implemented yet')} title="Mano prekės" />
        <MenuItem icon="shopping-cart" onPress={() => alert('Not implemented yet')} title="Užsakymai" />
        <MenuItem icon="logout" onPress={() => {
          signOut();
        }} title="Atsijungti" />
      </View>
      <Text>{JSON.stringify(user)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
  }
});