// screens/login_screen.jsx
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, Animated, TextInput, TouchableOpacity, ActivityIndicator, Dimensions, PanResponder, Image } from 'react-native';
import snoopyGif from '../assets/snoopyGif.gif';
import notesGif from '../assets/notesGif.gif';
import swipeIcon from '../assets/swipeIcon.png';
import { signInAndEnsureUserDoc } from '../services/authService';

const API_URL = "https://project-api-soundswipe.onrender.com/api/v1";

const { height, width } = Dimensions.get("window");

export function LoginScreen({ navigation }) {
    const [message, setMessage] = useState("Connecting to SoundSwipe...");
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isKeyboardActive, setIsKeyboardActive] = useState(false);
    // const { authorizeMusicKit, appleMusicUserToken } = useContext(MusicKitContext);
  
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
  
    // Now with Firebase Authentication, see authService.js
    const handleLogin = async () => {
      try {
        // log in user via Firebase auth
        const result = await signInAndEnsureUserDoc(email, password);
        
        if (result.success) {
          if (result.existing) {
          setMessage(`Welcome back, docId: ${result.docId}`);
          console.log("Navigating to Profile Screen with docId:", result.docId);
          navigation.replace("ProfileScreen", { docId: result.docId }); // need to integrate docID - profile screen
          } else {
          setMessage(`New user created, docId: ${result.docId}`);
          console.log("Navigating to Profile Screen with docId:", result.docId);
          navigation.replace("ProfileScreen", { docId: result.docId }); // need to integrate docID - profile screen
          }

        } else {
          setMessage(`Error: ${result.error}`);
        }
      } catch (err) {
        console.error('Login failed:', err);
      }
    };

    // Can add handleSignUp function here later on if we decide
  
    return (
        <View style={styles.container}>
            <Animated.View {...panResponder.panHandlers} style={[styles.landingScreen, { transform: [{ translateY }] }]}>
                <View style={styles.landingScreenText}>
                    <Text style={styles.title}>SOUNDSWIPE</Text>
                    <Text style={styles.subtitle}>Discover New Music Instantly.</Text>
                    <Text style={styles.subtitle}>Sample and add new songs to your Apple Music playlist with just a swipe.</Text>
                    <Text style={styles.subtitle}>Getter better recommendations and build new playlists with the songs you like.</Text>
                </View>

                {/* <View style={styles.statusBox}>
                    {loading ? <ActivityIndicator /> : <Text style={styles.apiMessage}>{message}</Text>}
                </View> */}

                <View style={styles.dragContainer} {...panResponder.panHandlers}>
                    <Image source={swipeIcon} style={styles.swipeIcon} />
                    {/* <Text style={styles.icontext}>Swipe up to login to your Apple Music Account</Text> */}
                </View>
            
            </Animated.View>

            <View style={styles.loginScreen}>
                <Text style={[styles.loginTitle, isKeyboardActive && styles.shrinkTitle ]}>SOUNDSWIPE</Text>
                <Text style={styles.loginSubtitle}>Login with your email and password below.</Text>
                <Text style={styles.loginSubtitle2}>Please note you must have an existing Apple Music account to use this app. If you have not yet connected your Apple Music account, you will be prompted to do so after logging in.</Text>
                <TextInput 
                placeholder="Email" 
                placeholderTextColor="#aaa" 
                style={[styles.input]} 
                value={email} 
                onChangeText={setEmail} 
                onFocus={() => setIsKeyboardActive(true)}
                onBlur={() => setIsKeyboardActive(false)}

                />
                <TextInput
                placeholder="Password" 
                placeholderTextColor="#aaa" 
                secureTextEntry 
                style={styles.input2} 
                value={password} o
                onChangeText={setPassword} 
                onFocus={() => setIsKeyboardActive(true)}
                onBlur={() => setIsKeyboardActive(false)}
                />
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
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
    backgroundColor: '#C9E7E0',
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 3, 
    padding: 40,
  },
  landingScreenText: {
    backgroundColor: '#C9E7E0',
    alignItems: 'center',
    justifyContent: 'start',
  },
  title: {
    fontSize: 45,
    color: '#1C3546',
    marginTop: 100,
    marginBottom: 50,
    fontfamily: "Josefin Sans",
    fontWeight: 700,
},
shrinkTitle: {
    fontSize: 45,
    color: '#1C3546',
    marginTop: 70,
    fontfamily: "Josefin Sans",
    fontWeight: 700,
},
loginTitle: {
    fontSize: 45,
    color: '#1C3546',
    marginTop: 120,
    marginBottom: 40,
    fontfamily: "Josefin Sans",
    fontWeight: 700,
},
  subtitle: {
    fontSize: 20,
    color: '#305975',
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 500,
    fontfamily: "Josefin Sans",
    paddingLeft: 10,
    paddingRight: 10
  },
  loginSubtitle: {
    fontSize: 18,
    color: '#1C3546',
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
    color: '#1C3546',
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
  // gif: {
  //   width: 200,
  //   height: 200,
  //   resizeMode: 'contain',
  //   zIndex: 4,
  //   marginBottom: 120 
  //   }, 
  //  notesGif: {
  //   width: 200,
  //   height: 200,
  //   resizeMode: 'contain',
  //   zIndex: 3,
  //   marginBottom: -20
  //   }, 

  loginScreen: {
    flex: 1,
    backgroundColor: '#C9E7E0',
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 2, 
  },

  input: {
    width: '80%',
    height: 60,
    backgroundColor: '#fff',
    color: 'black',
    borderRadius: 20,
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
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    width: '70%',
    height: 90,
    backgroundColor: '#1C3546',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    marginTop: 70,
  },
  buttonText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },



});

export default LoginScreen;