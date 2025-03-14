import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from "react-native";
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

  // Add ref for ScrollView
  const scrollViewRef = React.useRef();

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
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      // keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}  // Adjusted offset
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
      >
        <Text style={styles.title}>SOUNDSWIPE</Text>
        <Text style={styles.subtitle}>PERSONALIZE YOUR MUSIC SEARCH</Text>
        <View style={styles.noticeContainer}>
          <Text style={styles.noticeHeader}>Note:</Text>
          <Text style={styles.noticeText}>
            The information you provide will be used with AI to improve your search algorithm.
          </Text>
        </View>

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

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleCreateSearch} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Search</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C9E7E0",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: { 
    fontSize: 45,
    color: '#1C3546',
    marginTop: 120,
    marginBottom: 10,
    fontFamily: "Josefin Sans",
    fontWeight: 700,
  },
  subtitle: { 
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
  infoText: { 
    fontSize: 14, 
    color: "#1C3546", 
    textAlign: "center", 
    marginBottom: 50 
  },
  input: { 
    width: "80%", 
    height: 50, 
    backgroundColor: "#fff", 
    color: "black",
    borderRadius: 20, 
    paddingHorizontal: 15, 
    fontSize: 16, 
    marginBottom: 20 
  },
  button: { 
    width: "60%", 
    height: 60, 
    backgroundColor: "#1C3546", 
    justifyContent: "center", 
    alignItems: "center", 
    borderRadius: 30, 
    marginTop: 25,
    marginBottom: 50
  },
  buttonText: { 
    fontSize: 22, 
    color: "#fff", 
    fontWeight: "bold" 
  },
  noticeContainer: {
    width: '75%',
    backgroundColor: '#1C3546',
    borderRadius: 20,
    padding: 15,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 120,
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
  }
});

export default CreateSearchScreen;
