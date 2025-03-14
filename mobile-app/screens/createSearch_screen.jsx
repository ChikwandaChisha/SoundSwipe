import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { auth } from "../services/firebaseConfig";

export function CreateSearchScreen({ navigation }) {
  const api = "https://project-api-soundswipe.onrender.com/api/v1/search-sessions/create";
  const [searchData, setSearchData] = useState({
    title: "",
    genre: "",
    instruments: "",
    similarSongs: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setSearchData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateSearch = async () => {
    console.log("Search Input Data:", searchData);
    const user = auth.currentUser;

    if (!user) {
      alert("Failed to get user ID, please close the app and log in again.");
      return;
    }

    const requestBody = {
      userId: user.uid,
      title: searchData.title,
      genre: searchData.genre,
      instruments: searchData.instruments,
      similar_songs: searchData.similar_songs,
    };

    console.log("REQUEST BODY being sent to backend: ", requestBody);
    setLoading(true);
    try {
      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log(data);
      setLoading(false);

      if (response.ok) {
        console.log("Search session created:", data);
        const { sessionId, recommendation } = data; // Ensure sessionId is part of the response
        console.log(recommendation);

        // Pass both sessionId and recommendation to FeedScreen
        navigation.replace("FeedScreen", { sessionId, searchResults: recommendation });
      } else {
        console.error("API Error:", data.error);
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Failed to connect to the server.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SOUNDSWIPE</Text>
      <Text style={styles.subtitle}>PERSONALIZE YOUR MUSIC SEARCH</Text>
      <Text style={styles.infoText}>
        This information will be used with an AI to improve your search algorithm.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Name of search"
        placeholderTextColor="#888"
        value={searchData.name}
        onChangeText={(text) => handleChange("title", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Genre"
        placeholderTextColor="#888"
        value={searchData.genre}
        onChangeText={(text) => handleChange("genre", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Instruments"
        placeholderTextColor="#888"
        value={searchData.instruments}
        onChangeText={(text) => handleChange("instruments", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Similar Songs"
        placeholderTextColor="#888"
        value={searchData.similar_songs}
        onChangeText={(text) => handleChange("similar_songs", text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleCreateSearch} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create Search</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#C9E7E0", alignItems: "center", paddingHorizontal: 20 },
  title: { fontSize: 45, fontWeight: "700", color: "#1C3546", marginTop: 90 },
  subtitle: { fontSize: 35, fontWeight: "500", color: "#1C3546", marginBottom: 30, marginTop: 20 },
  infoText: { fontSize: 14, color: "#1C3546", textAlign: "center", marginBottom: 50 },
  input: { width: "100%", height: 50, backgroundColor: "#fff", borderRadius: 25, paddingHorizontal: 15, fontSize: 16, marginBottom: 35 },
  button: { width: "70%", height: 100, backgroundColor: "#1C3546", justifyContent: "center", alignItems: "center", borderRadius: 30, marginTop: 25 },
  buttonText: { fontSize: 18, color: "#fff", fontWeight: "bold" },
});

export default CreateSearchScreen;
