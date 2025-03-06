import React, { useState } from 'react';
import { View, SafeAreaView, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, interpolateColor, runOnJS } from 'react-native-reanimated';
import MusicTile from '../components/music_tile';
import PlaylistTile from '../components/playlist_tile';

export function FeedScreen() {
  const songs = [
    { id: '1', title: "PassionFruit", artist: "Drake", albumCover: "https://i1.sndcdn.com/artworks-CCbZ4mG3Juom-0-t500x500.jpg" },
    { id: '2', title: "Like a Rolling Stone", artist: "Bob Dylan", albumCover: "https://cdn-images.dzcdn.net/images/cover/96193f14db0501c035bd43ab93960317/500x500-000000-80-0-0.jpg" },
    { id: '3', title: "Bohemian Rhapsody", artist: "Queen", albumCover: "https://dbzbooks.com/cdn/shop/files/81f5a2e2622469a37d468121f86e69f51ef91178560295055e205217a65160d5.jpg?v=1723056046&width=493" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);
  const directionLocked = useSharedValue(null);

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
      ['red', '#EA9A4A', 'green']
    ),
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {showPlaylist ? (
          <PlaylistTile onClose={() => setShowPlaylist(false)} />
        ) : (
          <GestureDetector gesture={swipeGesture}>
            <MusicTile
              title={songs[currentIndex].title}
              artist={songs[currentIndex].artist}
              albumCover={songs[currentIndex].albumCover}
              animatedStyle={animatedStyle}
              backgroundColor={backgroundColor}
            />
          </GestureDetector>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = {
  safeArea: {
    flex: 1,
    backgroundColor: '#B45225',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default FeedScreen;
