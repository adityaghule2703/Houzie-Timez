import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!mobile || !password) {
      Alert.alert('Error', 'Please enter mobile and password');
      return;
    }

    try {
      const response = await fetch(
        'https://tambolatime.co.in/public/api/user/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mobile,
            password,
          }),
        }
      );

      const data = await response.json();

      if (data.status === true) {
  await AsyncStorage.setItem('userToken', data.token);

  Alert.alert('Success', 'Login successful');

  navigation.replace('Main', { role: 'user' });
}
 else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Mobile Number"
        value={mobile}
        onChangeText={setMobile}
        keyboardType="phone-pad"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 6,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 16 },
});
