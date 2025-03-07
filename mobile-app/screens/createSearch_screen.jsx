import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";

export function CreateSearchScreen({ navigation }) {
  const [name, setName] = useState("");
  const [genre, setGenre] = useState("");
  const [instruments, setInstruments] = useState("");
  const [similarSongs, setSimilarSongs] = useState("");

  const handleCreateSearch = () => {
    // connect api and send inputs to backend
    console.log({ name, genre, instruments, similarSongs });
    navigation.replace("FeedScreen");
  };

  const goBack = () => {
    navigation.replace("LoginScreen");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SOUNDSWIPE</Text>
      <Text style={styles.subtitle}>PERSONALIZE YOUR MUSIC SEARCH</Text>
      <Text style={styles.infoText}>
        This information will be used with an AI to help improve your search algorithm.
      </Text>

      <TextInput 
        style={styles.input} 
        placeholder="Name" 
        placeholderTextColor="#888" 
        value={name} 
        onChangeText={setName} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Genre" 
        placeholderTextColor="#888" 
        value={genre} 
        onChangeText={setGenre} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Instruments" 
        placeholderTextColor="#888" 
        value={instruments} 
        onChangeText={setInstruments} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Similar Songs" 
        placeholderTextColor="#888" 
        value={similarSongs} 
        onChangeText={setSimilarSongs} 
      />

      <TouchableOpacity style={styles.button} onPress={handleCreateSearch}>
        <Text style={styles.buttonText}>Create Search</Text>
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
    justifyContent: "start",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 700,
    color: "#1C3546",
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "Josefin Sans",
    marginTop: 90
  },
  subtitle: {
    fontSize: 35,
    fontWeight: 500,
    color: "#1C3546",
    marginBottom: 30,
    marginTop: 20,
    textAlign: "center",
    fontFamily: "Josefin Sans",
  },
  infoText: {
    fontSize: 14,
    color: "#1C35461C3546",
    textAlign: "center",
    marginBottom: 50,
    fontFamily: "Josefin Sans",
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
    alignSelf: 'start',
  },
  backButtonText: {
    fontSize: 16,
    color: "#1C3546",
    fontWeight: "bold",
  },
});

export default CreateSearchScreen;