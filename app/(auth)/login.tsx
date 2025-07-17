import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setEngineer } from '@/store/authSlice';

export default function LoginScreen() {
  const [engineerName, setEngineerName] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = () => {
    if (engineerName.trim()) {
      dispatch(setEngineer(engineerName));
      router.replace('/(app)/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>تسجيل الدخول</Text>
      <TextInput
        style={styles.input}
        placeholder="اسم المهندس"
        value={engineerName}
        onChangeText={setEngineerName}
        textAlign="right"
      />
      <TouchableOpacity
        style={[styles.button, !engineerName.trim() && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={!engineerName.trim()}
      >
        <Text style={styles.buttonText}>دخول</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    fontFamily: 'Cairo-Bold',
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontFamily: 'Cairo-Regular',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#2563eb',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Cairo-Bold',
  },
});
