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
  const [showPlaylist, setShowPlaylist] = useState(false);

  const playbackTimer = useRef(null);
  const remainingTime = useRef(30000);
  const lastPlayTime = useRef(null);
  const currentSong = songs[currentIndex];

  // Animated values - keep these in one place
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);
  const directionLocked = useSharedValue(null);

  const APPLE_MUSIC_DEV_TOKEN = "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkNYOEY3TFNQOUgifQ.eyJpc3MiOiJaSE02RDM0UTlXIiwiaWF0IjoxNzQxMjk1Mzc5LCJleHAiOjE3NTY3NjA5Nzl9.wKPH7XgkKFV1bj7Cd5S4Qbm9mqhi8p5ixsju8HMHGFvqMvuYjmTRH8oncO6iv3TDxjkPwPoLQMELMybh3SORqA";
  const BASE_URL = "https://project-api-soundswipe.onrender.com/api/v1";
  const NEW_RECOMMENDATION_API_URL = `${BASE_URL}/search-sessions/${sessionId}/recommendations`;
  const SESSION_STORAGE_API_URL = `${BASE_URL}/search-sessions/${sessionId}/update`;

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
    }
  };

  const handleShuffle = () => {
    const remainingSongs = songs.slice(currentIndex + 1);
    const shuffledRemaining = remainingSongs.sort(() => Math.random() - 0.5);
    const newSongs = [...songs.slice(0, currentIndex + 1), ...shuffledRemaining];
    setSongs(newSongs);
    opacity.value = withTiming(1, { duration: 800 });
  };

  const handlePreviousSong = () => {
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

  const updateSessionFeedback = async (liked) => {
    if (!sessionId || !currentSong) return;

    try {
      const response = await fetch(SESSION_STORAGE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          songId: currentSong.id,
          liked: liked
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update session feedback');
      }

      // If we're running low on songs after feedback, fetch more
      if (currentIndex >= songs.length - 5) {
        const recResponse = await fetch(NEW_RECOMMENDATION_API_URL);
        const data = await recResponse.json();
        
        if (recResponse.ok && data.recommendations) {
          setSongs(prevSongs => [...prevSongs, ...data.recommendations]);
        }
      }
    } catch (error) {
      console.error('Error updating session feedback:', error);
    }
  };

  const handleNextSong = async () => {
    if (currentIndex < songs.length - 1) {
      // Update feedback before moving to next song (swipe left = dislike)
      await updateSessionFeedback(false);
      
      opacity.value = 0;
      translateX.value = 0;
      translateY.value = 0;
      rotate.value = 0;
      setCurrentIndex((prev) => prev + 1);
      opacity.value = withTiming(1, { duration: 800 });
    }
    directionLocked.value = null;
  };

  const handleShowPlaylist = async () => {
    // Update feedback before showing playlist (swipe right = like)
    await updateSessionFeedback(true);
    setShowPlaylist(true);
    directionLocked.value = null;
  };

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
          // Reset timer state for new song
          remainingTime.current = 30000;
          if (isPlaying) {
            if (playbackTimer.current) {
              clearTimeout(playbackTimer.current);
            }
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
      if (playbackTimer.current) {
        clearTimeout(playbackTimer.current);
      }
    };
  }, [currentSong, isPlaying]);

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
      } else if (directionLocked.value === "vertical") {
        translateY.value = event.translationY;
      }
    })
    .onEnd(async (event) => {
      if (directionLocked.value === "vertical") {
        if (event.translationY < -150) {
          runOnJS(handleNextSong)();
        } else if (event.translationY > 150) {
          runOnJS(handlePreviousSong)();
        }
      } else if (directionLocked.value === "horizontal") {
        if (event.translationX > 150) {
          runOnJS(handleShowPlaylist)();
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

  const addSongs = () => {
    setShowPlaylist(false);
    handleNextSong();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {showPlaylist ? (
          <PlaylistTile 
            onClose={() => setShowPlaylist(false)} 
            cover={currentSong.artworkUrl}
            title={currentSong.foundName}
            artist={currentSong.foundArtist}
            playlists={[]}
            addSong={addSongs}
          />
        ) : (
          <>
            <GestureDetector gesture={swipeGesture}>
              <MusicTile
                title={currentSong.foundName}
                artist={currentSong.foundArtist}
                albumCover={currentSong.artworkUrl}
                songId={currentSong.foundId}
                trackUrl={previewUrl}
                animatedStyle={animatedStyle}
                backgroundColor={backgroundColor}
                onPlayStateChange={handlePlayPause}
              />
            </GestureDetector>
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.replace("ProfileScreen")}
              >
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
  shuffleButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(28, 53, 70, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  shuffleButtonText: {
    color: '#1C3546',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FeedScreen;
