import { StatusBar } from 'expo-status-bar';
import React, { useRef, useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, Animated, TextInput, TouchableOpacity, ActivityIndicator, Dimensions, PanResponder, Image, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';

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
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
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
  
    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setIsKeyboardActive(true);
        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setIsKeyboardActive(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
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
        setError(null);
        setIsLoading(true);

        // Basic validation
        if (!email || !email.includes('@')) {
            setError('Please enter a valid email address');
            setIsLoading(false);
            return;
        }

        if (!password || password.length < 6) {
            setError('Password must be at least 6 characters');
            setIsLoading(false);
            return;
        }

        try {
            const result = await signInAndEnsureUserDoc(email, password);
            
            if (result.success) {
                navigation.replace("ProfileScreen", { docId: result.docId });
            } else {
                setError(result.error || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred during login');
            console.error('Login failed:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Can add handleSignUp function here later on if we decide
  
    return (
        <View style={styles.container}>
            <Animated.View {...panResponder.panHandlers} style={[styles.landingScreen, { transform: [{ translateY }] }]}>
                <View style={styles.landingScreenText}>
                    <Text style={styles.title}>SOUNDSWIPE</Text>
                    <Text style={styles.subtitle}>Discover New Music Instantly.</Text>
                    <Text style={styles.subtitle}>Sample and add new songs to your Apple Music playlists with just a swipe.</Text>
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

            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.loginScreen}
                keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
            >
                <View style={styles.loginContent}>
                    <Text style={[styles.loginTitle, isKeyboardActive && styles.shrinkTitle ]}>SOUNDSWIPE</Text> 
                    <Text style={styles.loginSubtitle}> USER LOG IN</Text>
                    <View style={styles.noticeContainer}>
                        <Text style={styles.noticeHeader}>Note:</Text>
                        <Text style={styles.noticeText}>You must have an existing Apple Music account to use SoundSwipe. You will be prompted to connect your Apple Music account after logging in.</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        {error && <Text style={styles.errorText}>{error}</Text>}
                        {isLoading && <ActivityIndicator size="small" color="#1C3546" />}
                        <TextInput 
                            placeholder="Email" 
                            placeholderTextColor="#aaa" 
                            style={styles.input}
                            value={email} 
                            onChangeText={setEmail} 
                            autoCapitalize="none"
                            autoCorrect={false}
                            onFocus={() => setIsKeyboardActive(true)}
                            onBlur={() => setIsKeyboardActive(false)}
                        />
                        <TextInput
                            placeholder="Password" 
                            placeholderTextColor="#aaa" 
                            secureTextEntry 
                            style={styles.input2}
                            value={password}
                            autoCapitalize="none"
                            autoCorrect={false}
                            passwordRules="minlength: 6"
                            onChangeText={setPassword} 
                            onFocus={() => setIsKeyboardActive(true)}
                            onBlur={() => setIsKeyboardActive(false)}
                        />
                        <TouchableOpacity style={styles.button} onPress={handleLogin}>
                            <Text style={styles.buttonText}>Log In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>

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
    fontFamily: "Josefin Sans",
    fontWeight: 700,
},
  shrinkTitle: {
      fontSize: 45,
      color: '#1C3546',
      marginTop: 70,
      fontFamily: "Josefin Sans",
      fontWeight: 700,
  },
  loginTitle: {
      fontSize: 45,
      color: '#1C3546',
      marginTop: 120,
      marginBottom: 10,
      fontFamily: "Josefin Sans",
      fontWeight: 700,
  },
  subtitle: {
    fontSize: 20,
    color: '#305975',
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 500,
    fontFamily: "Josefin Sans",
    paddingLeft: 10,
    paddingRight: 10
  },
  loginSubtitle: {
    fontSize: 24,
    fontWeight: 700,
    color: '#1C3546',
    marginBottom: 40,
    marginTop: 0,
    textAlign: 'center',
    fontFamily: "Josefin Sans",
    paddingLeft: 10,
    paddingRight: 10
  },

  // loginSubtitle2: {
  //   fontSize: 18,
  //   color: '#1C3546',
  //   marginBottom: 0,
  //   textAlign: 'center',
  //   fontWeight: 300,
  //   fontFamily: "Josefin Sans",
  //   paddingLeft: 10,
  //   paddingRight: 10
  // },

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
    alignSelf: 'center',
    marginBottom: 15
  },
  icontext:{
      fontSize: 12,
      color: '#0000000',
      margin: 10,
      fontWeight: 500,
      fontFamily: "Josefin Sans",
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
    zIndex: 2,
  },

  loginContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  inputContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  input: {
    width: '80%',
    height: 50,
    backgroundColor: '#fff',
    color: 'black',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  input2: {
    width: '80%',
    height: 50,
    backgroundColor: '#fff',
    color: '#000000',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    width: '60%',
    height: 60,
    backgroundColor: '#1C3546',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    marginTop: 30,
    marginBottom: 50,
  },
  buttonText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },

  noticeContainer: {
    width: '75%',
    backgroundColor: '#1C3546',
    borderRadius: 20,
    padding: 15,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 50,
    alignItems: 'center',
  },
  noticeHeader: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 5,
    fontFamily: "Josefin Sans",
  },
  noticeText: {
    fontSize: 13,
    color: '#fff',
    textAlign: 'center',
    fontFamily: "Josefin Sans",
    fontWeight: '400',
    marginLeft: 10,
    marginRight: 10,
    fontStyle: 'italic',
  },

  errorText: {
    color: 'red',
    marginBottom: 10,
  },

});

export default LoginScreen;