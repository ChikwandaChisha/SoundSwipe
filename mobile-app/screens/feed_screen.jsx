import React, { useState, useEffect, useRef } from 'react';
import { View, SafeAreaView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, interpolateColor, runOnJS } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import MusicTile from '../components/music_tile';
import PlaylistTile from '../components/playlist_tile';
import { SAMPLE_SONGS } from '../assets/sampleSongs';
import { SAMPLE_PLAYLISTS } from '../assets/samplePlaylists';
import { Audio } from 'expo-av'; // Importing expo-av for audio playback

const APPLE_MUSIC_DEV_TOKEN = "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkNYOEY3TFNQOUgifQ.eyJpc3MiOiJaSE02RDM0UTlXIiwiaWF0IjoxNzQxMjk1Mzc5LCJleHAiOjE3NTY3NjA5Nzl9.wKPH7XgkKFV1bj7Cd5S4Qbm9mqhi8p5ixsju8HMHGFvqMvuYjmTRH8oncO6iv3TDxjkPwPoLQMELMybh3SORqA";

export function FeedScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  
  const searchResults = route.params?.searchResults || SAMPLE_SONGS;
  console.log(searchResults);
  
  const [songs, setSongs] = useState(() => [...searchResults].sort(() => Math.random() - 0.5));
  const [playlists, setPlaylists] = useState(SAMPLE_PLAYLISTS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playbackTimer = useRef(null);
  const remainingTime = useRef(30000);
  const lastPlayTime = useRef(null);
  const currentSong = songs[currentIndex];

  const sound = useRef(new Audio.Sound()); // Reference for the audio player

  const handlePlayPause = (playing) => {
    setIsPlaying(playing);
    if (playing) {
      lastPlayTime.current = Date.now();
      playbackTimer.current = setTimeout(() => {
        handleNextSong();
      }, remainingTime.current);
    } else {
      if (playbackTimer.current) {
        clearTimeout(playbackTimer.current);
        const elapsedSinceLastPlay = Date.now() - lastPlayTime.current;
        remainingTime.current = Math.max(0, remainingTime.current - elapsedSinceLastPlay);
      }

      if (sound.current) {
        sound.current.stopAsync(); // Stop the sound if paused
      }
    }
  };

  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);
  const directionLocked = useSharedValue(null);

  // Fetch preview URL from Apple Music when song changes
  useEffect(() => {
    const fetchPreviewUrl = async () => {
      if (!currentSong || !currentSong.foundId) {
        setPreviewUrl(null);
        return;
      }

      try {
        const response = await fetch(
          `https://api.music.apple.com/v1/catalog/us/songs/${currentSong.foundId}`,
          { headers: { Authorization: `Bearer ${APPLE_MUSIC_DEV_TOKEN}` } }
        );

        if (!response.ok) {
          console.error(`Apple Music API error: ${response.status} ${response.statusText}`);
          setPreviewUrl(null);
          return;
        }

        const text = await response.text();
        if (!text) {
          console.error("Apple Music API returned an empty response.");
          setPreviewUrl(null);
          return;
        }

        const data = JSON.parse(text);
        const previewItems = data?.data?.[0]?.attributes?.previews;

        if (previewItems && previewItems.length > 0) {
          setPreviewUrl(previewItems[0].url);
          remainingTime.current = 30000;

          if (isPlaying) {
            if (playbackTimer.current) clearTimeout(playbackTimer.current);
            lastPlayTime.current = Date.now();
            playbackTimer.current = setTimeout(() => {
              handleNextSong();
            }, 30000);
          }
        } else {
          setPreviewUrl(null);
        }
      } catch (err) {
        console.error("Error fetching Apple preview:", err);
        setPreviewUrl(null);
      }
    };

    fetchPreviewUrl();

    return () => {
      if (playbackTimer.current) clearTimeout(playbackTimer.current);
    };
  }, [currentSong, isPlaying]);

  useEffect(() => {
    const loadAndPlaySound = async () => {
      if (previewUrl && isPlaying) {
        try {
          await sound.current.loadAsync({ uri: previewUrl });
          await sound.current.playAsync();
        } catch (error) {
          console.error("Error playing sound", error);
        }
      }
    };

    loadAndPlaySound();

    return () => {
      if (sound.current) {
        sound.current.unloadAsync(); // Unload sound when component is unmounted or URL changes
      }
    };
  }, [previewUrl, isPlaying]);

  const handleNextSong = () => {
    if (currentIndex < songs.length - 1) {
      opacity.value = 0;
      setCurrentIndex((prev) => prev + 1);
      opacity.value = withTiming(1, { duration: 800 });
    } else {
      handleShuffle();
    }
    directionLocked.value = null;
  };

  const handlePreviousSong = () => {
    if (currentIndex > 0) {
      opacity.value = 0;
      setCurrentIndex((prev) => prev - 1);
      opacity.value = withTiming(1, { duration: 800 });
    }
    directionLocked.value = null;
  };

  const handleShuffle = () => {
    const remainingSongs = searchResults.filter(song => song !== currentSong);
    const shuffledRemaining = remainingSongs.sort(() => Math.random() - 0.5);
    const newSongs = [...shuffledRemaining];
    newSongs.splice(currentIndex, 0, currentSong);

    setSongs(newSongs);
    opacity.value = withTiming(1, { duration: 800 });
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
      if (!directionLocked.value) {
        directionLocked.value = Math.abs(event.translationX) > 30 ? "horizontal" : "vertical";
      }

      if (directionLocked.value === "horizontal") {
        translateX.value = event.translationX;
        rotate.value = event.translationX / 10;
      } else {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (directionLocked.value === "vertical") {
        if (event.translationY < -150) runOnJS(handleNextSong)();
        else if (event.translationY > 150) runOnJS(handlePreviousSong)();
      } else if (directionLocked.value === "horizontal") {
        if (event.translationX > 150) runOnJS(handleShowPlaylist)();
        else if (event.translationX < -150) runOnJS(handleNextSong)();
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
    backgroundColor: interpolateColor(translateX.value, [-200, 0, 200], ['#ff7070', '#fff', '#87ffa3']),
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {showPlaylist ? (
          <PlaylistTile 
            onClose={() => setShowPlaylist(false)} 
            cover={currentSong.artworkUrl}
            title={currentSong.foundName}
            artist={currentSong.foundArtist}
            playlists={playlists}
            addSong={() => { setShowPlaylist(false); handleNextSong(); }}
          />
        ) : (
          <>
            <GestureDetector gesture={swipeGesture}>
              <MusicTile
                title={currentSong.foundName}
                artist={currentSong.foundArtist}
                albumCover={currentSong.artworkUrl}
                trackUrl={previewUrl}
                animatedStyle={animatedStyle}
                backgroundColor={backgroundColor}
                onPlayStateChange={handlePlayPause}
              />
            </GestureDetector>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                <Text style={styles.backButtonText}>← Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shuffleButton} onPress={handleShuffle}>
                <MaterialIcons name="shuffle" size={20} color="#1C3546" />
                <Text style={styles.shuffleButtonText}>Shuffle</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ /* styling here */ });

export default FeedScreen;
