import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useSession } from '../../ctx';
import { getUserByID } from '@/database/user';

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

  // if (!user) {
  //   return null;
  // }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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