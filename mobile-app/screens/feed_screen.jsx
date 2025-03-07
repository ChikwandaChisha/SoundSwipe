// screens/feed_screen.jsx
import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, interpolateColor, runOnJS } from 'react-native-reanimated';
import MusicTile from '../components/music_tile';
import PlaylistTile from '../components/playlist_tile';

const APPLE_MUSIC_DEV_TOKEN = "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkNYOEY3TFNQOUgifQ.eyJpc3MiOiJaSE02RDM0UTlXIiwiaWF0IjoxNzQxMjk1Mzc5LCJleHAiOjE3NTY3NjA5Nzl9.wKPH7XgkKFV1bj7Cd5S4Qbm9mqhi8p5ixsju8HMHGFvqMvuYjmTRH8oncO6iv3TDxjkPwPoLQMELMybh3SORqA";
import { SAMPLE_SONGS } from '../assets/sampleSongs';
import { SAMPLE_PLAYLISTS } from '../assets/samplePlaylists'

export function FeedScreen({ navigation }) {
  // Use sample of 30 songs (top charts from 2024)
  const [songs, setSongs] = useState(SAMPLE_SONGS);
  const [playlists, setPlaylists] = useState(SAMPLE_PLAYLISTS);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  
  const [previewUrl, setPreviewUrl] = useState(null);
  const currentSong = songs[currentIndex];

  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);
  const directionLocked = useSharedValue(null);
  
  // when user changes songs, fetch from Apple Music's catalog
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
            headers: {
              Authorization: `Bearer ${APPLE_MUSIC_DEV_TOKEN}`
            }
          }
        );
        const data = await resp.json();
        const previewItems = data?.data?.[0]?.attributes?.previews;
        if (previewItems && previewItems.length > 0) {
          setPreviewUrl(previewItems[0].url);
        } else {
          // no preview found
          setPreviewUrl(null);
        }
      } catch (err) {
        console.error("Error fetching Apple preview:", err);
        setPreviewUrl(null);
      }
    };

    fetchPreviewUrl();
  }, [currentSong]);

  const handleNextSong = () => {
    if (currentIndex < songs.length - 1) {
      opacity.value = 0;
      translateX.value = 0;
      translateY.value = 0;
      rotate.value = 0;
      setCurrentIndex((prev) => prev + 1);
      opacity.value = withTiming(1, { duration: 800 });
    }
    directionLocked.value = null;
  };

  const handleShowPlaylist = () => {
    setShowPlaylist(true);
    directionLocked.value = null;
  };

  const handleBackPress = () => {
    navigation.replace("ProfileScreen");
  };

  const swipeGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (directionLocked.value === null) {
        if (Math.abs(event.translationX) > 30) {
          directionLocked.value = "horizontal"; 
        } else if (Math.abs(event.translationY) > 60) {
          directionLocked.value = "vertical"; 
        }
      }

      if (directionLocked.value === "horizontal") {
        translateX.value = event.translationX;
        rotate.value = event.translationX / 10;
      } else if (directionLocked.value === "vertical" && event.translationY < 0) { 
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (directionLocked.value === "vertical" && event.translationY < -150) {
        runOnJS(handleNextSong)();
      } else if (directionLocked.value === "horizontal") {
        if (event.translationX > 150) {
          runOnJS(handleShowPlaylist)(); // change back to playlist when ready (next song for now)
        } else if (event.translationX < -150) {
          runOnJS(handleNextSong)();
        }
      }

      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      rotate.value = withSpring(0);
      directionLocked.value = null;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` }
    ],
    opacity: opacity.value,
  }));

  const backgroundColor = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      translateX.value, 
      [-200, 0, 200], 
      ['#ff7070', '#fff', '#87ffa3']
    ),
  }));

  const addSongs = (selectedPlaylists) => {
    //add song to playlists through API here
    console.log(`Added Song to ${selectedPlaylists}`);
    return(selectedPlaylists);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.container}>
        {showPlaylist ? (
          <PlaylistTile 
          onClose={() => setShowPlaylist(false)} 
          cover={currentSong.artworkUrl}
          title={currentSong.foundName}
          artist={currentSong.foundArtist}
          playlists={playlists}
          addSong={() => setShowPlaylist(false)}
          />
        ) : (
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
        )}
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
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  backButtonText: {
    color: '#1C3546',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FeedScreen;
