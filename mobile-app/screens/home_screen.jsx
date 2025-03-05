import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }) {
  const handleLogin = () => {
    // will need api logic
  navigation.replace("FeedScreen");
};

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to SoundSwipe!</Text>
      <Text style={styles.text}>This will need to be a home screen with past searches</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Your Feed</Text>
      </TouchableOpacity>
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
    button: {
      width: '80%',
      height: 50,
      backgroundColor: '#1DB954',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      marginTop: 10,
    },
    buttonText: {
      fontSize: 18,
      color: '#fff',
      fontWeight: 'bold',
    },
});