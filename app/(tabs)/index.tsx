import { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useSession } from '../../ctx';
import { getUserByID } from '@/database/user';
import RichMenuItem from '@/components/RichMenuItem';

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
      <Text>{JSON.stringify(user)}</Text>
      <Text
        onPress={() => {
          signOut();
        }}>
        Sign Out
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