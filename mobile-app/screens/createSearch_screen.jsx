import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { auth } from "../services/firebaseConfig";

export function CreateSearchScreen({ navigation }) {
  const [name, setName] = useState("");
  const [genre, setGenre] = useState("");
  const [instruments, setInstruments] = useState("");
  const [similarSongs, setSimilarSongs] = useState("");
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreateSearch = async () => {
    console.log({ name, genre, instruments, similarSongs });
    const user = auth.currentUser;
    console.log("Current User:", user);

    if (!user) {
      alert("Failed to get user id, please close the app and login to authenticate.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("https://project-api-soundswipe.onrender.com/api/v1/search-sessions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,  
          input: 
          `Name: ${name}, 
          Genre: ${genre}, 
          Instruments: ${instruments}, 
          Similar Songs: ${similarSongs}`
        }),
      });
  
      const data = await response.json();
      setLoading(false);
  
      if (response.ok) {
        console.log("Search session created:", data);
        navigation.replace("FeedScreen"); 
      } else {
        console.error("API Error:", data.error);
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Failed to connect to the server.");
    }
  };

  const goBack = () => {
    navigation.replace("LoginScreen");
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, isKeyboardActive && styles.shrinkTitle]}>SOUNDSWIPE</Text>
      <Text style={[styles.subtitle, isKeyboardActive && styles.shrinkSubtitle]}>
        PERSONALIZE YOUR MUSIC SEARCH
      </Text>
      <Text style={[styles.infoText, isKeyboardActive && styles.shrinkInfoText]}>
        This information will be used with an AI to help improve your search algorithm.
      </Text>

      <TextInput 
        style={styles.input} 
        placeholder="Name of search" 
        placeholderTextColor="#888" 
        value={name} 
        onChangeText={setName} 
        onFocus={() => setIsKeyboardActive(true)}
        onBlur={() => setIsKeyboardActive(false)}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Genre" 
        placeholderTextColor="#888" 
        value={genre} 
        onChangeText={setGenre} 
        onFocus={() => setIsKeyboardActive(true)}
        onBlur={() => setIsKeyboardActive(false)}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Instruments" 
        placeholderTextColor="#888" 
        value={instruments} 
        onChangeText={setInstruments} 
        onFocus={() => setIsKeyboardActive(true)}
        onBlur={() => setIsKeyboardActive(false)}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Similar Songs" 
        placeholderTextColor="#888" 
        value={similarSongs} 
        onChangeText={setSimilarSongs} 
        onFocus={() => setIsKeyboardActive(true)}
        onBlur={() => setIsKeyboardActive(false)}
      />

      <TouchableOpacity style={styles.button} onPress={handleCreateSearch}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create Search</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C9E7E0",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 45,
    fontWeight: "700",
    color: "#1C3546",
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "Josefin Sans",
    marginTop: 90,
  },
  shrinkTitle: {
    marginTop: 50,
    fontSize: 40,
  },
  subtitle: {
    fontSize: 35,
    fontWeight: "500",
    color: "#1C3546",
    marginBottom: 30,
    marginTop: 20,
    textAlign: "center",
    fontFamily: "Josefin Sans",
  },
  shrinkSubtitle: {
    fontSize: 30,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: "#1C3546",
    textAlign: "center",
    marginBottom: 50,
    fontFamily: "Josefin Sans",
  },
  shrinkInfoText: {
    marginBottom: 20,
    fontSize: 12,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 35,
    color: "#000",
  },
  button: {
    width: "70%",
    height: 100,
    backgroundColor: "#1C3546",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    marginTop: 25,
    padding: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  backButton: {
    padding: 10,
    marginTop: 30,
    alignSelf: "flex-start",
  },
  backButtonText: {
    fontSize: 16,
    color: "#1C3546",
    fontWeight: "bold",
  },
});

export default CreateSearchScreen;