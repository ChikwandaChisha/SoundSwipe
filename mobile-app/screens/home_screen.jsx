import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to SoundSwipe!</Text>
      <Text style={styles.text}>This will need to be a home screen with past searches</Text>
    </View>
  );
}

const styles = StyleSheet.create({

  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#121212' 
    },
    text: { 
        fontSize: 24, color: '#1DB954' 
    },
});