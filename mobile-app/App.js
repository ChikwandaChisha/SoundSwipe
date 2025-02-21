import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';

const API_URL = "https://project-api-soundswipe.onrender.com/"; // render URL

export default function App() {
  const [message, setMessage] = useState("Connecting to SoundSwipe...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then(response => response.text())
      .then(data => {
        setMessage(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching API:", error);
        setMessage("Failed to connect to SoundSwipe API.");
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎵 SoundSwipe 🎵</Text>
      <Text style={styles.subtitle}>Discover Music Instantly</Text>
      <View style={styles.statusBox}>
        {loading ? <ActivityIndicator size="large" color="#00bfff" /> : <Text style={styles.apiMessage}>{message}</Text>}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1DB954', // Spotify green-like color
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
  },
  statusBox: {
    padding: 15,
    backgroundColor: '#282828',
    borderRadius: 10,
  },
  apiMessage: {
    color: '#fff',
    fontSize: 14,
  },
});

