import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');

      if (!token) {
        navigation.replace('Login');
        return;
      }

      const response = await fetch(
        'https://tambolatime.co.in/public/api/user/logout',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      // 🧹 Clear token
      await AsyncStorage.removeItem('userToken');

      Alert.alert('Logged out', data.message || 'Logout successful');

      // ⬅️ Go back to login
      navigation.replace('Login');
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Logout failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile Screen</Text>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, marginBottom: 20 },
  logoutBtn: {
    backgroundColor: 'red',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 6,
  },
  logoutText: { color: '#fff', fontSize: 16 },
});
