import { StatusBar } from 'expo-status-bar';
import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Animated, TextInput, TouchableOpacity, ActivityIndicator, Dimensions, PanResponder } from 'react-native';

const API_URL = "https://project-api-soundswipe.onrender.com/";

const { height } = Dimensions.get("window");

export function LoginScreen({ navigation }) {
    const [message, setMessage] = useState("Connecting to SoundSwipe...");
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
  
    const translateY = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(1)).current;
  
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
  
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy < 0) { //only can move up
          const newY = Math.max(-height, gesture.dy);
          translateY.setValue(newY);
          opacity.setValue(Math.max(0, 1 + newY / 300));
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy < -300) { // if far enough do animation
          Animated.parallel([
            Animated.timing(translateY, { toValue: -height}),
            Animated.timing(opacity, { toValue: 0 })
          ]).start();
        } else {
          Animated.parallel([ //otherwise reset
            Animated.timing(translateY, { toValue: 0}),
            Animated.timing(opacity, { toValue: 1})
          ]).start();
        }
      }
    });
  
    const handleLogin = () => {
        // will need api logic
      navigation.replace("HomeScreen");
    };
  
    return (
      <View style={styles.container}>

        <View style={styles.loginScreen}>
          <Text style={styles.loginTitle}>Login to SoundSwipe</Text>
          <TextInput placeholder="Username" placeholderTextColor="#aaa" style={styles.input} value={username} onChangeText={setUsername} />
          <TextInput placeholder="Password" placeholderTextColor="#aaa" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
  
        <Animated.View {...panResponder.panHandlers} style={[styles.landingScreen, { transform: [{ translateY }], opacity }]}>
          <Text style={styles.title}>🎵 SoundSwipe 🎵</Text>
          <Text style={styles.subtitle}>Discover Music Instantly</Text>
          <View style={styles.statusBox}>
            {loading ? <ActivityIndicator size="large" color="#00bfff" /> : <Text style={styles.apiMessage}>{message}</Text>}
          </View>
          <View style={styles.dragContainer} {...panResponder.panHandlers}>
            <Text style={styles.dragText}>⬆️ Drag Up ⬆️</Text>
          </View>
        </Animated.View>
        <StatusBar style="auto" />
      </View>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },


  loginScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#181818',
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1DB954',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: '#282828',
    color: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
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


  landingScreen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2, 
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1DB954',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
  },
  statusBox: {
    padding: 15,
    backgroundColor: '#282828',
    borderRadius: 10,
    marginBottom: 20,
  },
  apiMessage: {
    color: '#fff',
    fontSize: 14,
  },

  dragContainer: {
    position: 'absolute',
    bottom: 30, 
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#1DB954',
    borderRadius: 20,
    zIndex: 3, 
  },
  dragText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;