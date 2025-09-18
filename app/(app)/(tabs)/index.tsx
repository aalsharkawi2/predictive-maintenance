import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useRouter } from 'expo-router';
import { PlusCircle, History } from 'lucide-react-native';

export default function HomeScreen() {
  const engineer = useSelector((state: RootState) => state.auth.engineer);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=2070&auto=format&fit=crop',
          }}
          style={styles.headerImage}
        />
        <View style={styles.overlay} />
        <Text style={styles.welcome}>مرحباً {engineer}</Text>
        <Text style={styles.subtitle}>نظام توثيق الصيانة الكهربائية</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/devices/new')}
        >
          <PlusCircle size={32} color="#2563eb" />
          <Text style={styles.actionText}>جلسة صيانة جديدة</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/history')}
        >
          <History size={32} color="#2563eb" />
          <Text style={styles.actionText}>سجل الصيانة</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingBottom: 70, // Account for fixed tab bar
  },
  header: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  headerImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  welcome: {
    fontSize: 28,
    marginBottom: 10,
    fontFamily: 'Cairo-Bold',
    color: '#ffffff',
    textAlign: 'center',
    zIndex: 1,
  },
  subtitle: {
    fontSize: 18,
    color: '#ffffff',
    fontFamily: 'Cairo-Regular',
    textAlign: 'center',
    zIndex: 1,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  actionButton: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  actionText: {
    fontSize: 18,
    fontFamily: 'Cairo-Bold',
    color: '#1f2937',
  },
});
