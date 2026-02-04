import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

const GameScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Game Screen</Text>
    </View>
  );
};

export default GameScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20 }
});
