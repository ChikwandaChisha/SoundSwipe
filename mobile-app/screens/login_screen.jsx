import { StatusBar } from 'expo-status-bar';
import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Animated, TextInput, TouchableOpacity, ActivityIndicator, Dimensions, PanResponder, Image } from 'react-native';
import snoopyGif from '../assets/snoopyGif.gif';
import notesGif from '../assets/notesGif.gif';
import swipeIcon from '../assets/swipeIcon.png';

const API_URL = "https://project-api-soundswipe.onrender.com/api/v1";

const { height, width } = Dimensions.get("window");

export function LoginScreen({ navigation }) {
    const [message, setMessage] = useState("Connecting to SoundSwipe...");
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  
    const translateY = useRef(new Animated.Value(0)).current;
    // const opacity = useRef(new Animated.Value(1)).current;
  
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
        //   opacity.setValue(Math.max(0, 1 + newY / 300));
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy < -300) { // if far enough do animation
          Animated.parallel([
            Animated.timing(translateY, { toValue: -height, useNativeDriver: false}),
            // Animated.timing(opacity, { toValue: 0, useNativeDriver: false })
          ]).start();
        } else {
          Animated.parallel([ //otherwise reset
            Animated.timing(translateY, { toValue: 0, useNativeDriver: false}),
            // Animated.timing(opacity, { toValue: 1, useNativeDriver: false})
          ]).start();
        }
      }
    });
  
    const handleLogin = () => {
        // will need api logic
      navigation.replace("ProfileScreen");
    };
  
    return (
        <View style={styles.container}>
            <Animated.View {...panResponder.panHandlers} style={[styles.landingScreen, { transform: [{ translateY }] }]}>
                <View style={styles.landingScreenText}>
                    <Text style={styles.title}>SOUNDSWIPE</Text>
                    <Text style={styles.subtitle}>Discover New Music Instantly.</Text>
                    <Text style={styles.subtitle}>Sample and add new songs to your Apple Music playlist with just a swipe.</Text>
                    <Text style={styles.subtitle}>Getter better recommendations and build new playlists with the songs you like.</Text>
                </View>

                <View style={styles.statusBox}>
                    {loading ? <ActivityIndicator /> : <Text style={styles.apiMessage}>{message}</Text>}
                </View>

                <Image source={notesGif} style={styles.notesGif} cachePolicy="none" contentFit="cover" />
                <Image source={snoopyGif} style={styles.gif} cachePolicy="none" contentFit="cover" />


                <View style={styles.dragContainer} {...panResponder.panHandlers}>
                    <Image source={swipeIcon} style={styles.swipeIcon} />
                    <Text style={styles.icontext}>Swipe up to login to your Apple Music Account</Text>
                </View>
            
            </Animated.View>

            <View style={styles.loginScreen}>
                <Text style={[styles.loginTitle, isKeyboardActive && styles.shrinkTitle ]}>SOUNDSWIPE</Text>
                <Text style={styles.loginSubtitle}>Login with your Apple Music username and password below.</Text>
                <Text style={styles.loginSubtitle2}>Please note you must have an existing Apple Music account to use this app. This login is used to sign in directly to Apple Music for a seemless integration, we do not store your login information.</Text>
                <TextInput 
                placeholder="Apple Music Username" 
                placeholderTextColor="#aaa" 
                style={[styles.input]} 
                value={username} 
                onChangeText={setUsername} 
                onFocus={() => setIsKeyboardActive(true)}
                onBlur={() => setIsKeyboardActive(false)}

                />
                <TextInput
                placeholder="Apple Music Password" 
                placeholderTextColor="#aaa" 
                secureTextEntry 
                style={styles.input2} 
                value={password} o
                onChangeText={setPassword} 
                onFocus={() => setIsKeyboardActive(true)}
                onBlur={() => setIsKeyboardActive(false)}
                />
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login to Apple Music</Text>
                </TouchableOpacity>
            </View>

            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  landingScreen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FF8000',
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 3, 
  },
  landingScreenText: {
    backgroundColor: '#FF8000',
    alignItems: 'center',
    justifyContent: 'start',
  },
  title: {
    fontSize: 45,
    color: '#000',
    marginTop: 70,
    marginBottom: 50,
    fontfamily: "Josefin Sans",
    fontWeight: 700,
},
shrinkTitle: {
    fontSize: 45,
    color: '#000',
    marginTop: 70,
    fontfamily: "Josefin Sans",
    fontWeight: 700,
},
loginTitle: {
    fontSize: 45,
    color: '#000',
    marginTop: 120,
    marginBottom: 40,
    fontfamily: "Josefin Sans",
    fontWeight: 700,
},
  subtitle: {
    fontSize: 18,
    color: '#000',
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 500,
    fontfamily: "Josefin Sans",
    paddingLeft: 10,
    paddingRight: 10
  },
  loginSubtitle: {
    fontSize: 18,
    color: '#000',
    marginBottom: 40,
    marginTop: 30,
    textAlign: 'center',
    fontWeight: 500,
    fontfamily: "Josefin Sans",
    paddingLeft: 10,
    paddingRight: 10
  },
  
  loginSubtitle2: {
    fontSize: 18,
    color: '#333',
    marginBottom: 0,
    textAlign: 'center',
    fontWeight: 300,
    fontfamily: "Josefin Sans",
    paddingLeft: 10,
    paddingRight: 10
  },

  dragContainer: {
    position: 'absolute',
    bottom: 30, 
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    zIndex: 5 
  },
  swipeIcon: {
    width: 40,  
    height: 40,
    resizeMode: 'contain',
    alignSelf: 'center'

},
icontext:{
    fontSize: 12,
    color: '#0000000',
    margin: 10,
    fontWeight: 500,
    fontfamily: "Josefin Sans",
    alignSelf: 'center'
},
  gif: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    zIndex: 4,
    marginBottom: 120 
    }, 
   notesGif: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    zIndex: 3,
    marginBottom: -20
    }, 

  loginScreen: {
    flex: 1,
    backgroundColor: '#EA9A4A',
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 2, 
  },

  input: {
    width: '80%',
    height: 60,
    backgroundColor: '#fff',
    color: 'black',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 40,
    marginTop: 50
  },
  input2: {
    width: '80%',
    height: 60,
    backgroundColor: '#fff',
    color: '#000000',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    width: '70%',
    height: 90,
    backgroundColor: '#FF8000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    marginTop: 70,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },



});

export default LoginScreen;