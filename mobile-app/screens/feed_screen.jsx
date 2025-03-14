import React, { useState, useEffect, useRef } from 'react';
import { View, SafeAreaView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, interpolateColor, runOnJS } from 'react-native-reanimated';
import MusicTile from '../components/music_tile';
import PlaylistTile from '../components/playlist_tile';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export function FeedScreen({ route, navigation }) {
  const { searchResults, sessionId } = route.params || { searchResults: [], sessionId: "" };
  const [songs, setSongs] = useState(searchResults);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const currentSong = songs[currentIndex];

  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);
  const directionLocked = useSharedValue(null);

  const APPLE_MUSIC_DEV_TOKEN = "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkNYOEY3TFNQOUgifQ.eyJpc3MiOiJaSE02RDM0UTlXIiwiaWF0IjoxNzQxMjk1Mzc5LCJleHAiOjE3NTY3NjA5Nzl9.wKPH7XgkKFV1bj7Cd5S4Qbm9mqhi8p5ixsju8HMHGFvqMvuYjmTRH8oncO6iv3TDxjkPwPoLQMELMybh3SORqA";
  const NEW_RECOMMENDATION_API_URL = `https://soundswipe.onrender.com/api/v1/search-sessions/recommendations?sessionId=${sessionId}`;
  const SESSION_STORAGE_API_URL = `https://soundswipe.onrender.com/api/v1/search-sessions/${sessionId}/update`;

  const playbackTimer = useRef(null);
  const lastPlayTime = useRef(null);
  const remainingTime = useRef(30000); // 30 seconds

  useEffect(() => {
    const fetchPreviewUrl = async () => {
      if (!currentSong || !currentSong.foundId) {
        setPreviewUrl(null);
        return;
      }
      try {
        const resp = await fetch(
          `https://api.music.apple.com/v1/catalog/us/songs/${currentSong.foundId}`,
          {
            headers: { Authorization: `Bearer ${APPLE_MUSIC_DEV_TOKEN}` },
          }
        );
        const data = await resp.json();
        const previewItems = data?.data?.[0]?.attributes?.previews;
        if (previewItems?.length) setPreviewUrl(previewItems[0].url);
        else setPreviewUrl(null);
      } catch (err) {
        console.error("Error fetching Apple preview:", err);
        setPreviewUrl(null);
      }
    };

    fetchPreviewUrl();
  }, [currentSong]);

  const fetchNewData = async () => {
    try {
      const response = await fetch(NEW_RECOMMENDATION_API_URL);
    
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (typeof data === "object") {
        // Clear old songs and set the new recommendations
        setSongs(data["recommendation"]);
        setTimeout(() => setCurrentIndex(0), 0);
      } else {
        console.error("Unexpected response format:", data);
      }

    } catch (error) {
      console.error("Error fetching new data:", error);
    }
  };

  const updateSearchSession = async (action) => {
    if (!currentSong?.searchTerm) {
      console.error("Error: No songId found for the current song.");
      return;
    }

    const validAction = action === "likedSongs" ? "like" : "dislike"; // Convert to expected format

    const payload = {
      songId: currentSong.searchTerm,
      action: validAction,
    };

    try {
      const response = await fetch(SESSION_STORAGE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Session updated:", data);
    } catch (error) {
      console.error("Error updating search session:", error);
    }
  };

  const handleNextSong = () => {

    if (currentIndex < songs.length - 1) {
      opacity.value = 0;
      translateX.value = 0;
      translateY.value = 0;
      rotate.value = 0;
      setCurrentIndex((prev) => prev + 1);
      opacity.value = withTiming(1, { duration: 800 });
      if (currentIndex >= songs.length - 2) fetchNewData();
    }
    directionLocked.value = null;
  };

  const handlePrevSong = () => {
    if (currentIndex > 0) {
      opacity.value = 0;
      translateX.value = 0;
      translateY.value = 0;
      rotate.value = 0;
      setCurrentIndex((prev) => prev - 1);
      opacity.value = withTiming(1, { duration: 800 });
    }
    directionLocked.value = null;
  };

  const handlePlayPause = (playing) => {
    setIsPlaying(playing);
    if (playing) {
      lastPlayTime.current = Date.now();
      if (playbackTimer.current) {
        clearTimeout(playbackTimer.current);
      }
      playbackTimer.current = setTimeout(() => {
        handleNextSong();
        setIsPlaying(false); // Stop playing when auto-advancing
      }, remainingTime.current);
    } else {
      if (playbackTimer.current) {
        clearTimeout(playbackTimer.current);
        const elapsedSinceLastPlay = Date.now() - lastPlayTime.current;
        remainingTime.current = Math.max(0, remainingTime.current - elapsedSinceLastPlay);
      }
    }
  };

  const swipeGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (directionLocked.value === null) {
        if (Math.abs(event.translationX) > 30) directionLocked.value = "horizontal";
        else if (Math.abs(event.translationY) > 60) directionLocked.value = "vertical";
      }

      if (directionLocked.value === "horizontal") {
        translateX.value = event.translationX;
        rotate.value = event.translationX / 10;
      } else if (directionLocked.value === "vertical") {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (directionLocked.value === "vertical") {
        if (event.translationY < -150) runOnJS(handleNextSong)();
        else if (event.translationY > 150) runOnJS(handlePrevSong)();
      } else if (directionLocked.value === "horizontal") {
        if (event.translationX > 150) {
          runOnJS(handleNextSong)();
          runOnJS(updateSearchSession)("likedSongs");
        } else if (event.translationX < -150) {
          runOnJS(handleNextSong)();
          runOnJS(updateSearchSession)("dislikeSongs");
        }
      }
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      rotate.value = withSpring(0);
      directionLocked.value = null;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { translateX: translateX.value }, { rotate: `${rotate.value}deg` }],
    opacity: opacity.value,
  }));

  const backgroundColor = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(translateX.value, [-200, 0, 200], ['#ff7070', '#fff', '#87ffa3']),
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity 
        style={{
          position: 'absolute',
          top: 50,
          left: 20,
          zIndex: 1,
        }}
        onPress={() => navigation.replace("ProfileScreen")}
      >
        <MaterialIcons name="arrow-back" size={28} color="#1C3546" />
      </TouchableOpacity>

      <View style={styles.container}>
        <GestureDetector gesture={swipeGesture}>
          <MusicTile
            title={currentSong.foundName}
            artist={currentSong.foundArtist}
            albumCover={currentSong.artworkUrl}
            songId={currentSong.foundId}
            trackUrl={previewUrl}
            animatedStyle={animatedStyle}
            backgroundColor={backgroundColor}
          />
        </GestureDetector>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#C9E7E0',
      alignItems: 'center',
      justifyContent: 'center',
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '90%',
      paddingHorizontal: 20,
      marginTop: 20,
    },
    backButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 10,
      backgroundColor: 'rgba(28, 53, 70, 0.1)',
    },
    backButtonText: {
      color: '#1C3546',
      fontSize: 16,
      fontWeight: 'bold',
    },

  });
export default FeedScreen;